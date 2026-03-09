/* ============================================================
   KEMOENIK APP v2.0
   ============================================================ */

/* utils.js: localStorage helpers, StateManager, Notifications, Drawer, DOMContentLoaded */

// LOCAL STORAGE HELPERS — data disimpan per nomor WA
// ============================================================
function _lsKey(wa, suffix) {
  return 'kemoenik_' + (wa || 'guest') + '_' + suffix;
}

function lsSave(wa, key, data) {
  try {
    localStorage.setItem(_lsKey(wa, key), JSON.stringify(data));
    return true;
  } catch(e) {
    console.warn('lsSave error:', e);
    return false;
  }
}

function lsLoad(wa, key) {
  try {
    var raw = localStorage.getItem(_lsKey(wa, key));
    return raw ? JSON.parse(raw) : null;
  } catch(e) {
    return null;
  }
}

function lsRemove(wa, key) {
  try { localStorage.removeItem(_lsKey(wa, key)); } catch(e) {}
}

function lsLoadAll(wa) {
  return {
    kalkulator: lsLoad(wa, 'kalkulator'),
    quiz:       lsLoad(wa, 'quiz'),
    evaluasi:   lsLoad(wa, 'evaluasi') || [],
    profile:    lsLoad(wa, 'profile')
  };
}


// ============================================================
// STATE MANAGER — persistent, safe state management
// ============================================================
var StateManager = /** @class */ (function() {
  function StateManager() {
    this._state = {
      user: { nama:'', wa:'', voucher:'', gender:'perempuan', usia:0, berat:0, tinggi:0 },
      kalkulator: null,
      evaluasi: [],
      quiz: null,
      misiChecked: {}
    };
  }

  StateManager.prototype.get = function(path, defaultValue) {
    if (defaultValue === undefined) defaultValue = null;
    var keys = path.split('.');
    var value = this._state;
    for (var i = 0; i < keys.length; i++) {
      if (value === null || value === undefined) return defaultValue;
      value = value[keys[i]];
    }
    return value !== undefined ? value : defaultValue;
  };

  StateManager.prototype.set = function(path, value) {
    var keys = path.split('.');
    var target = this._state;
    for (var i = 0; i < keys.length - 1; i++) {
      if (!target[keys[i]] || typeof target[keys[i]] !== 'object') target[keys[i]] = {};
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = value;
    this._persist();
  };

  StateManager.prototype._persist = function() {
    try {
      localStorage.setItem('kemoenik_state_v2', JSON.stringify(this._state));
    } catch(e) { console.warn('State persist failed:', e); }
  };

  StateManager.prototype.loadFromStorage = function() {
    try {
      var saved = localStorage.getItem('kemoenik_state_v2');
      if (saved) {
        var parsed = JSON.parse(saved);
        // Merge top-level keys, keeping defaults for missing ones
        var s = this._state;
        if (parsed.user) s.user = Object.assign({}, s.user, parsed.user);
        if (parsed.kalkulator) s.kalkulator = parsed.kalkulator;
        if (parsed.evaluasi && Array.isArray(parsed.evaluasi)) s.evaluasi = parsed.evaluasi;
        if (parsed.quiz) s.quiz = parsed.quiz;
        if (parsed.misiChecked) s.misiChecked = parsed.misiChecked;
      }
    } catch(e) { console.warn('State load failed:', e); }
  };

  return StateManager;
}());

var state = new StateManager();

// appState as transparent alias to state._state for backward compatibility
// All existing code using appState.kalkulator etc continues to work
var appState = state._state;

// ============================================================

// ============================================================
// NOTIFICATION & REMINDER SYSTEM
// ============================================================
const NotificationService = {
  async requestPermission() {
    if (!("Notification" in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === "granted";
  },

  scheduleReminder(title, body, timestamp) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const now = Date.now();
    const delay = timestamp - now;
    if (delay > 0) {
      setTimeout(() => {
        new Notification(title, {
          body: body,
          icon: "https://i.postimg.cc/3JZ3Y0K0/Logo-Kemoenik-jpg.jpg",
          badge: "https://i.postimg.cc/3JZ3Y0K0/Logo-Kemoenik-jpg.jpg",
          tag: "kemoenik-reminder",
          requireInteraction: true
        });
      }, delay);
    }
  },

  setupDailyReminders() {
    if (!appState.kalkulator) return;
    const now = new Date();
    const times = [
      { hour: 7, minute: 30, title: "☀️ KEMOENIK Pagi", body: "Minum 3 kapsul sesudah sarapan + air hangat" },
      { hour: 18, minute: 30, title: "🌙 KEMOENIK Malam", body: "Minum 3 kapsul sesudah makan malam + air putih" }
    ];
    times.forEach(t => {
      const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), t.hour, t.minute);
      if (reminderTime > now) {
        this.scheduleReminder(t.title, t.body, reminderTime.getTime());
      }
    });
  }
};
window.NotificationService = NotificationService;

function checkAndShowReminder() {
  if (!appState.kalkulator) return;
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 7 && hour < 9) {
    showInAppReminder("☀️ KEMOENIK Pagi", "Minum 3 kapsul sesudah sarapan + air hangat");
  } else if (hour >= 18 && hour < 20) {
    showInAppReminder("🌙 KEMOENIK Malam", "Minum 3 kapsul sesudah makan malam + air putih");
  }
}

function showInAppReminder(title, body) {
  const today = new Date().toDateString();
  const dismissed = localStorage.getItem('kemoenik_reminder_dismissed');
  if (dismissed === today) return;
  document.getElementById('reminderTitle').textContent = title;
  document.getElementById('reminderBody').textContent = body;
  document.getElementById('inAppReminder').style.display = 'block';
}

function dismissReminder() {
  document.getElementById('inAppReminder').style.display = 'none';
  localStorage.setItem('kemoenik_reminder_dismissed', new Date().toDateString());
}

function markReminderDone() {
  dismissReminder();
  showToast('✅ Great! Konsistensi adalah kunci sukses 💪');
}

function snoozeReminder() {
  dismissReminder();
  setTimeout(() => {
    document.getElementById('inAppReminder').style.display = 'block';
  }, 15 * 60 * 1000);
}

// Check reminder setiap menit
setInterval(checkAndShowReminder, 60000);
setTimeout(checkAndShowReminder, 2000);

// ============================================================
// DRAWER RENDER
// ============================================================
function renderDrawer() {
  var k = appState.kalkulator;
  var nama = k ? k.nama : (appState.user.nama || '—');
  document.getElementById('dName').textContent = nama || '—';
  var dSub = appState.quiz ? appState.quiz.tipeName : 'Program Diet KEMOENIK';
  document.getElementById('dSub').textContent = dSub;
}

// ============================================================
// OPEN PANEL HOOKS
// ============================================================
// (panel hooks sudah diintegrasikan langsung ke openPanel di atas)

// ============================================================
// INIT on DOM ready
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  renderFAQ();
  // Load mission state
  var mode = localStorage.getItem('kemoenik_mission_mode') || 'normal';
  setMissionMode(mode);
});

// Trap click outside modals that are open
window.addEventListener('keydown', function(e){
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-panel.on').forEach(function(p){ closePanel(p.id); });
  }
});
