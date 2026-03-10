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
    // Selalu overwrite — izinkan update/re-generate kalkulator
    userData.kalkulator = { ...kalkulatorData, savedAt: new Date().toISOString() };
    this.saveUserData(wa, userData);
    return { success: true };
  },

  async saveQuiz(wa, quizData) {
    const userData = this.loadUserData(wa) || {};
    // Selalu overwrite — edit quiz diizinkan
    if (quizData === null) {
      userData.quiz = null;
    } else {
      userData.quiz = { ...quizData, savedAt: new Date().toISOString() };
    }
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
      profile: { ...profile, lastReset: new Date().toISOString() },
      kalkulator: null,
      quiz: null,
      evaluasi: [],
      misiChecked: {},
      resetAt: new Date().toISOString()
    };
    this.saveUserData(wa, newData);
    // Hapus juga key-key lama
    localStorage.removeItem('kemoenik_kal_data');
    localStorage.removeItem('kemoenik_quiz');
    localStorage.removeItem('kemoenik_state_v2');
    localStorage.removeItem('kemoenik_program_pilihan');
    return { success: true };
  },

  // BARU: Simpan & load pilihan program (Normal atau IF)
  saveProgramPilihan(wa, pilihan) {
    const userData = this.loadUserData(wa) || {};
    userData.programPilihan = pilihan;
    this.saveUserData(wa, userData);
    localStorage.setItem('kemoenik_program_pilihan', pilihan);
    return { success: true };
  },

  loadProgramPilihan(wa) {
    const userData = this.loadUserData(wa);
    return (userData && userData.programPilihan)
      ? userData.programPilihan
      : (localStorage.getItem('kemoenik_program_pilihan') || 'normal');
  },

  // BARU: Simpan & load misi harian
  saveMisiChecked(wa, misiKey, checked) {
    const userData = this.loadUserData(wa) || {};
    if (!userData.misiChecked) userData.misiChecked = {};
    userData.misiChecked[misiKey] = checked;
    this.saveUserData(wa, userData);
    state.set('misiChecked.' + misiKey, checked);
    return { success: true };
  },

  getMisiChecked(wa) {
    const userData = this.loadUserData(wa);
    return (userData && userData.misiChecked) ? userData.misiChecked : {};
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

// ========== DEVICE & BINDING HELPERS ==========

function getDeviceFingerprint() {
    var fp = localStorage.getItem('kemoenik_device_fp');
    if (!fp) {
        var raw = navigator.userAgent + '|' + screen.width + 'x' + screen.height + '|' + Math.random();
        fp = btoa(raw).substr(0, 32);
        localStorage.setItem('kemoenik_device_fp', fp);
    }
    return fp;
}

function getDeviceId() {
    var id = localStorage.getItem('kemoenik_device_id');
    if (!id) {
        id = 'D_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('kemoenik_device_id', id);
    }
    return id;
}

function checkLocalBinding(voucher, wa) {
    var key = 'kemoenik_bind_' + voucher;
    var stored = localStorage.getItem(key);
    
    if (!stored) return { exists: false };
    
    var data = JSON.parse(stored);
    return {
        exists: true,
        wa: data.wa,
        device: data.device,
        matchWA: data.wa === wa,
        matchDevice: data.device === getDeviceId()
    };
}

function saveBinding(voucher, wa, deviceId) {
    var key = 'kemoenik_bind_' + voucher;
    localStorage.setItem(key, JSON.stringify({
        wa: wa,
        device: deviceId || getDeviceId(),
        createdAt: Date.now(),
        expiry: Date.now() + (7 * 24 * 60 * 60 * 1000)
    }));
}

// Expose ke window
window.getDeviceFingerprint = getDeviceFingerprint;
window.getDeviceId = getDeviceId;
window.checkLocalBinding = checkLocalBinding;
window.saveBinding = saveBinding;
