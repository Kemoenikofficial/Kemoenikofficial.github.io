// ============================================================
// UTILITAS & STATE MANAGEMENT
// ============================================================

// ========== KONSTANTA ==========
const STORAGE_KEY_PREFIX = 'kemoenik_user_';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEzIIntNL_LO2imvYtXzULGeX_KTyDlnZlAzE4PkjAIOiuwbkTsTQEIUr8k_8qIFm2/exec';

// ========== FUNGSI UTILITAS ==========
function normalizeWA(wa) {
  wa = wa.replace(/\D/g, '');
  if (wa.startsWith('08')) return '62' + wa.substring(1);
  if (wa.startsWith('+62')) return wa.substring(1);
  if (wa.startsWith('62')) return wa;
  if (wa.startsWith('0')) return '62' + wa.substring(1);
  return wa;
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setSafeHTML(el, html) {
  if (!el) return;
  el.innerHTML = '';
  var tmp = document.createElement('div');
  tmp.innerHTML = html;
  while (tmp.firstChild) el.appendChild(tmp.firstChild);
}

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

function getQueryParam(key) {
  var params = new URLSearchParams(window.location.search);
  return params.get(key) || '';
}

function goToAktivitas() {
  window.location.href = APP_URL;
}

// ========== VERIFIKASI VOUCHER ==========
async function checkVoucherValid(wa, voucher) {
  try {
    const response = await fetch(
      `${APPS_SCRIPT_URL}?action=verify&kode=${encodeURIComponent(voucher)}&wa=${encodeURIComponent(wa)}&_=${Date.now()}`
    );
    const data = await response.json();
    if (data.status === "SUCCESS" || data.status === "ACTIVE_SAME_WA") {
      return { valid: true, expiredDate: data.tanggal_expired };
    } else if (data.status === "EXPIRED") {
      return { valid: false, message: "Voucher sudah expired. Silakan gunakan voucher baru." };
    } else if (data.status === "ACTIVE_DIFFERENT_WA") {
      return { valid: false, message: "Voucher ini digunakan nomor WA lain." };
    } else {
      return { valid: false, message: "Voucher tidak valid." };
    }
  } catch(e) {
    console.error("checkVoucherValid error:", e);
    return { valid: true, fallback: true };
  }
}

// ========== DATA SERVICE (localStorage) ==========
const DataService = {
  getUserKey(wa) {
    return STORAGE_KEY_PREFIX + wa;
  },

  loadUserData(wa) {
    try {
      const key = this.getUserKey(wa);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("DataService.loadUserData error:", e);
      return null;
    }
  },

  saveUserData(wa, data) {
    try {
      const key = this.getUserKey(wa);
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("DataService.saveUserData error:", e);
      return false;
    }
  },

  async saveKalkulator(wa, kalkulatorData) {
    const userData = this.loadUserData(wa) || {};
    if (userData.kalkulator && userData.kalkulator.dietCal) {
      return { success: false, reason: "exists" };
    }
    userData.kalkulator = { ...kalkulatorData, savedAt: new Date().toISOString() };
    this.saveUserData(wa, userData);
    return { success: true };
  },

  async saveQuiz(wa, quizData) {
    const userData = this.loadUserData(wa) || {};
    if (userData.quiz && userData.quiz.tipe) {
      return { success: false, reason: "exists" };
    }
    userData.quiz = { ...quizData, savedAt: new Date().toISOString() };
    this.saveUserData(wa, userData);
    return { success: true };
  },

  async saveEvaluasi(wa, evalData) {
    const userData = this.loadUserData(wa) || {};
    const evaluasi = userData.evaluasi || [];
    const idx = evaluasi.findIndex(e => e.minggu === evalData.minggu);
    if (idx >= 0) {
      evaluasi[idx] = { ...evalData, updatedAt: new Date().toISOString() };
    } else {
      evaluasi.push({ ...evalData, savedAt: new Date().toISOString() });
    }
    userData.evaluasi = evaluasi;
    this.saveUserData(wa, userData);
    return { success: true };
  },

  async saveProfile(wa, profile) {
    const userData = this.loadUserData(wa) || {};
    userData.profile = { ...profile, lastLogin: new Date().toISOString() };
    this.saveUserData(wa, userData);
    return { success: true };
  },

  async resetProgram(wa) {
    const userData = this.loadUserData(wa) || {};
    const profile = userData.profile || {};
    const newData = {
      profile: profile,
      kalkulator: null,
      quiz: null,
      evaluasi: [],
      resetAt: new Date().toISOString()
    };
    this.saveUserData(wa, newData);
    return { success: true };
  }
};

// ========== STATE MANAGER ==========
var StateManager = /** @class */ (function() {
  function StateManager() {
    this._state = {
      user: { nama: '', wa: '', voucher: '', gender: 'perempuan', usia: 0, berat: 0, tinggi: 0 },
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
var appState = state._state;

// ========== FUNGSI NAVIGASI & DRAWER ==========
function openDrawer() {
  document.getElementById('drawer').classList.add('on');
  document.getElementById('overlay').classList.add('on');
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('on');
  document.getElementById('overlay').classList.remove('on');
}

function openPanel(id) {
  document.getElementById(id).classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closePanel(id) {
  document.getElementById(id).classList.remove('on');
  document.body.style.overflow = '';
}

function openBeli() { openPanel('modalBeli'); }
function openFaq() { go('home'); setTimeout(function(){ document.getElementById('faqHomeSection').scrollIntoView({behavior:'smooth'}); }, 200); }

// ========== REMINDER ==========
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