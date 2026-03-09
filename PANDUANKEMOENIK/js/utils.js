/* ============================================================
   KEMOENIK APP v2.0 - utils.js
   LocalStorage helpers, StateManager, Notifications
   ============================================================ */

// LOCAL STORAGE HELPERS
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
    quiz: lsLoad(wa, 'quiz'),
    evaluasi: lsLoad(wa, 'evaluasi') || [],
    profile: lsLoad(wa, 'profile')
  };
}

// STATE MANAGER
var StateManager = function() {
  this._state = {
    user: { nama:'', wa:'', voucher:'', gender:'perempuan', usia:0, berat:0, tinggi:0 },
    kalkulator: null,
    evaluasi: [],
    quiz: null,
    misiChecked: {}
  };
};

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
      var s = this._state;
      if (parsed.user) s.user = Object.assign({}, s.user, parsed.user);
      if (parsed.kalkulator) s.kalkulator = parsed.kalkulator;
      if (parsed.evaluasi && Array.isArray(parsed.evaluasi)) s.evaluasi = parsed.evaluasi;
      if (parsed.quiz) s.quiz = parsed.quiz;
      if (parsed.misiChecked) s.misiChecked = parsed.misiChecked;
    }
  } catch(e) { console.warn('State load failed:', e); }
};

var state = new StateManager();
var appState = state._state;

// NOTIFICATION SERVICE
var NotificationService = {
  requestPermission: function() {
    if (!("Notification" in window)) return Promise.resolve(false);
    return Notification.requestPermission().then(function(p) { return p === "granted"; });
  },
  
  scheduleReminder: function(title, body, timestamp) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    var now = Date.now();
    var delay = timestamp - now;
    if (delay > 0) {
      setTimeout(function() {
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

  setupDailyReminders: function() {
    if (!appState.kalkulator) return;
    var now = new Date();
    var times = [
      { hour: 7, minute: 30, title: "☀️ KEMOENIK Pagi", body: "Minum 3 kapsul sesudah sarapan + air hangat" },
      { hour: 18, minute: 30, title: "🌙 KEMOENIK Malam", body: "Minum 3 kapsul sesudah makan malam + air putih" }
    ];
    var self = this;
    times.forEach(function(t) {
      var reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), t.hour, t.minute);
      if (reminderTime > now) {
        self.scheduleReminder(t.title, t.body, reminderTime.getTime());
      }
    });
  }
};

window.NotificationService = NotificationService;

function checkAndShowReminder() {
  if (!appState.kalkulator) return;
  var now = new Date();
  var hour = now.getHours();
  if (hour >= 7 && hour < 9) {
    showInAppReminder("☀️ KEMOENIK Pagi", "Minum 3 kapsul sesudah sarapan + air hangat");
  } else if (hour >= 18 && hour < 20) {
    showInAppReminder("🌙 KEMOENIK Malam", "Minum 3 kapsul sesudah makan malam + air putih");
  }
}

function showInAppReminder(title, body) {
  var today = new Date().toDateString();
  var dismissed = localStorage.getItem('kemoenik_reminder_dismissed');
  if (dismissed === today) return;
  var el = document.getElementById('inAppReminder');
  if (!el) return;
  document.getElementById('reminderTitle').textContent = title;
  document.getElementById('reminderBody').textContent = body;
  el.style.display = 'block';
}

function dismissReminder() {
  var el = document.getElementById('inAppReminder');
  if (el) el.style.display = 'none';
  localStorage.setItem('kemoenik_reminder_dismissed', new Date().toDateString());
}

function markReminderDone() {
  dismissReminder();
  showToast('✅ Great! Konsistensi adalah kunci sukses 💪');
}

function snoozeReminder() {
  dismissReminder();
  setTimeout(function() {
    var el = document.getElementById('inAppReminder');
    if (el) el.style.display = 'block';
  }, 15 * 60 * 1000);
}

// DRAWER RENDER
function renderDrawer() {
  var k = appState.kalkulator;
  var nama = k ? k.nama : (appState.user.nama || '—');
  var dName = document.getElementById('dName');
  var dSub = document.getElementById('dSub');
  if (dName) dName.textContent = nama || '—';
  if (dSub) dSub.textContent = appState.quiz ? appState.quiz.tipeName : 'Program Diet KEMOENIK';
}

// TOAST NOTIFICATION
function showToast(msg) {
  var existing = document.getElementById('appToast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.id = 'appToast';
  toast.textContent = msg;
  toast.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#1A3A1F;color:white;padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.3);max-width:85vw;text-align:center;animation:toastIn 0.3s ease;';
  document.body.appendChild(toast);
  setTimeout(function() {
    toast.style.animation = 'toastIn 0.3s ease reverse';
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 300);
  }, 3000);
}

// ESCAPE HTML
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// SAFE HTML SETTER
function setSafeHTML(el, html) {
  if (!el) return;
  el.innerHTML = '';
  var tmp = document.createElement('div');
  tmp.innerHTML = html;
  while (tmp.firstChild) el.appendChild(tmp.firstChild);
}

// GET TODAY STRING
function getTodayStr() { 
  return new Date().toISOString().split('T')[0]; 
}

// SET MISSION MODE
function setMissionMode(mode) {
  var normalSet = document.getElementById('misiNormal');
  var ifSet = document.getElementById('misiIF');
  var normalBtn = document.getElementById('modeNormal');
  var ifBtn = document.getElementById('modeIF');
  
  if (normalSet) normalSet.classList.remove('show');
  if (ifSet) ifSet.classList.remove('show');
  if (normalBtn) normalBtn.classList.remove('on');
  if (ifBtn) ifBtn.classList.remove('on');
  
  if (mode === 'normal') {
    if (normalSet) normalSet.classList.add('show');
    if (normalBtn) normalBtn.classList.add('on');
  } else {
    if (ifSet) ifSet.classList.add('show');
    if (ifBtn) ifBtn.classList.add('on');
  }
  localStorage.setItem('kemoenik_mission_mode', mode);
}

// TOGGLE MISSION
function toggleMission(itemId, checkId) {
  var item = document.getElementById(itemId);
  var check = document.getElementById(checkId);
  if (!item || !check) return;
  var isDone = item.classList.toggle('done');
  if (isDone) { 
    check.classList.add('checked'); 
    check.textContent = '✓'; 
  } else { 
    check.classList.remove('checked'); 
    check.textContent = ''; 
  }
  var saved = JSON.parse(localStorage.getItem('kemoenik_misi_' + getTodayStr()) || '{}');
  saved[itemId] = isDone;
  localStorage.setItem('kemoenik_misi_' + getTodayStr(), JSON.stringify(saved));
}

// LOAD MISSION CHECKED
function loadMisiChecked() {
  var saved = JSON.parse(localStorage.getItem('kemoenik_misi_' + getTodayStr()) || '{}');
  Object.keys(saved).forEach(function(id) {
    var checkId = id.replace('n','nc').replace('i','ic');
    var item = document.getElementById(id);
    var check = document.getElementById(checkId);
    if (item && check && saved[id]) {
      item.classList.add('done');
      check.classList.add('checked');
      check.textContent = '✓';
    }
  });
  var mode = localStorage.getItem('kemoenik_mission_mode') || 'normal';
  setMissionMode(mode);
}

// INIT ON DOM READY
document.addEventListener('DOMContentLoaded', function() {
  state.loadFromStorage();
  if (typeof renderFAQ === 'function') renderFAQ();
  loadMisiChecked();
  setInterval(checkAndShowReminder, 60000);
  setTimeout(checkAndShowReminder, 2000);
});

// ESCAPE KEY HANDLER
window.addEventListener('keydown', function(e){
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-panel.on').forEach(function(p){ 
      if (typeof closePanel === 'function') closePanel(p.id); 
    });
  }
});
