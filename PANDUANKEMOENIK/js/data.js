/*
 * data.js — KEMOENIK
 * DataService (localStorage keyed by WA), StateManager, App Config, Data Statis
 */


/*
 * KEMOENIK APP v2.0
 * Storage: localStorage (keyed by nomor WA)
 * Features: Voucher-based access, Kalkulator, Quiz, Evaluasi Mingguan
 */

var APP_URL = 'https://kemoenikofficial.github.io/aktivitas/';

// ============================================================
// DATA SERVICE — localStorage operations
// ============================================================
// ============================================================
// DataService — localStorage (keyed by nomor WA)
// ============================================================
var DataService = {
  _key: function(wa) {
    return 'kemoenik_user_' + wa;
  },

  loadUserData: function(wa) {
    try {
      var raw = localStorage.getItem(this._key(wa));
      if (raw) return JSON.parse(raw);
      return null;
    } catch(e) {
      console.error('DataService.loadUserData error:', e);
      return null;
    }
  },

  _save: function(wa, data) {
    try {
      localStorage.setItem(this._key(wa), JSON.stringify(data));
      return true;
    } catch(e) {
      console.error('DataService._save error:', e);
      return false;
    }
  },

  saveKalkulator: function(wa, data) {
    try {
      var existing = this.loadUserData(wa) || {};
      if (existing.kalkulator && existing.kalkulator.dietCal > 0) {
        return { success: false, reason: 'exists' };
      }
      existing.kalkulator = Object.assign({}, data, { savedAt: new Date().toISOString(), version: '2.0' });
      existing.updatedAt = new Date().toISOString();
      this._save(wa, existing);
      return { success: true };
    } catch(e) {
      console.error('DataService.saveKalkulator error:', e);
      return { success: false, reason: 'error' };
    }
  },

  saveQuiz: function(wa, data) {
    try {
      var existing = this.loadUserData(wa) || {};
      if (existing.quiz && existing.quiz.tipe) {
        return { success: false, reason: 'exists' };
      }
      existing.quiz = {
        tipe: data.tipe,
        tipeName: data.tipeName,
        metode: data.metode,
        metodeName: data.metodeName,
        skor: data.skor,
        tagline: data.tagline,
        tipe_emoji: data.tipe_emoji,
        savedAt: new Date().toISOString()
      };
      existing.updatedAt = new Date().toISOString();
      this._save(wa, existing);
      return { success: true };
    } catch(e) {
      console.error('DataService.saveQuiz error:', e);
      return { success: false, reason: 'error' };
    }
  },

  saveEvaluasi: function(wa, evalData) {
    try {
      var existing = this.loadUserData(wa) || {};
      var evaluasi = existing.evaluasi || [];
      var idx = evaluasi.findIndex(function(e) { return e.minggu === evalData.minggu; });
      if (idx >= 0) {
        evaluasi[idx] = Object.assign({}, evalData, { updatedAt: new Date().toISOString() });
      } else {
        evaluasi.push(Object.assign({}, evalData, { savedAt: new Date().toISOString() }));
      }
      existing.evaluasi = evaluasi;
      existing.updatedAt = new Date().toISOString();
      this._save(wa, existing);
      return { success: true };
    } catch(e) {
      console.error('DataService.saveEvaluasi error:', e);
      return { success: false };
    }
  },

  saveProfile: function(wa, profile) {
    try {
      var existing = this.loadUserData(wa) || {};
      existing.profile = Object.assign({}, profile, { lastLogin: new Date().toISOString() });
      existing.updatedAt = new Date().toISOString();
      this._save(wa, existing);
      return { success: true };
    } catch(e) {
      console.error('DataService.saveProfile error:', e);
      return { success: false };
    }
  },

  resetProgram: function(wa) {
    try {
      var existing = this.loadUserData(wa) || {};
      var profile = existing.profile || {};
      var resetData = {
        profile: profile,
        kalkulator: null,
        quiz: null,
        evaluasi: [],
        resetAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this._save(wa, resetData);
      return { success: true };
    } catch(e) {
      console.error('DataService.resetProgram error:', e);
      return { success: false };
    }
  }
};

window.DataService = DataService;

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
      // Juga sinkronisasi ke WA-keyed storage jika WA tersedia
      var wa = this._state.user && this._state.user.wa;
      if (wa) {
        var existing = {};
        try {
          var raw = localStorage.getItem('kemoenik_user_' + wa);
          if (raw) existing = JSON.parse(raw);
        } catch(e) {}
        if (this._state.kalkulator) existing.kalkulator = this._state.kalkulator;
        if (this._state.quiz) existing.quiz = this._state.quiz;
        if (this._state.evaluasi) existing.evaluasi = this._state.evaluasi;
        existing.updatedAt = new Date().toISOString();
        localStorage.setItem('kemoenik_user_' + wa, JSON.stringify(existing));
      }
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
// OLAHRAGA DATA — dideklarasi di sini agar tersedia saat renderAll() pertama dipanggil
// ============================================================
var targetOlahragaData = {
  ringan: [{hari:'Sen',aktivitas:'Jalan kaki 30 menit'},{hari:'Sel',aktivitas:'Lymphatic 15 menit'},{hari:'Rab',aktivitas:'Istirahat aktif — jalan santai'},{hari:'Kam',aktivitas:'Jalan kaki 30 menit'},{hari:'Jum',aktivitas:'Jumping jack 3 set'},{hari:'Sab',aktivitas:'Jalan kaki 45 menit'},{hari:'Min',aktivitas:'Istirahat total'}],
  standar: [{hari:'Sen',aktivitas:'Jalan kaki 30 menit + Jumping jack 3 set'},{hari:'Sel',aktivitas:'Lompat tali 10 menit + Lymphatic 10 menit'},{hari:'Rab',aktivitas:'Jalan kaki 30 menit'},{hari:'Kam',aktivitas:'Jumping jack 4 set + Lompat tali 10 menit'},{hari:'Jum',aktivitas:'Jalan kaki 45 menit + Lymphatic 15 menit'},{hari:'Sab',aktivitas:'Lompat tali 15 menit + Jumping jack 3 set'},{hari:'Min',aktivitas:'Istirahat — Lymphatic sebelum tidur'}],
  agresif: [{hari:'Sen',aktivitas:'Lompat tali 15 menit + Jalan kaki 30 menit'},{hari:'Sel',aktivitas:'Jumping jack 5 set + Lymphatic 15 menit'},{hari:'Rab',aktivitas:'Jalan kaki 45 menit + Lompat tali 10 menit'},{hari:'Kam',aktivitas:'Lompat tali 20 menit + Jumping jack 4 set'},{hari:'Jum',aktivitas:'Jalan kaki 60 menit'},{hari:'Sab',aktivitas:'Lompat tali 15 menit + Jumping jack 5 set + Lymphatic'},{hari:'Min',aktivitas:'Jalan kaki santai 30 menit — recovery'}]
};

// ============================================================
