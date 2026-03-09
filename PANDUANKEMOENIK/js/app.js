// ============================================================
// KEMOENIK - APP LOGIC (Firebase diganti localStorage)
// ============================================================

// Global app state
let appState = {
  user: { nama: '', wa: '', gender: 'perempuan', usia: 0, berat: 0, tinggi: 0 },
  kalkulator: null,
  evaluasi: [],
  quiz: null,
  misiChecked: {}
};

// State Manager dengan localStorage persist
const StateManager = {
  get(path, defaultValue = null) {
    const keys = path.split('.');
    let val = appState;
    for (let k of keys) {
      if (val === null || val === undefined) return defaultValue;
      val = val[k];
    }
    return val !== undefined ? val : defaultValue;
  },
  set(path, value) {
    const keys = path.split('.');
    let target = appState;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!target[keys[i]] || typeof target[keys[i]] !== 'object') target[keys[i]] = {};
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = value;
    this._persist();
  },
  _persist() {
    try {
      localStorage.setItem('kemoenik_state_v2', JSON.stringify(appState));
    } catch (e) {
      console.warn('State persist failed:', e);
    }
  },
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('kemoenik_state_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        appState = Object.assign({}, appState, parsed);
      }
    } catch (e) {
      console.warn('State load failed:', e);
    }
  }
};

// DataService (localStorage per WA)
const DataService = {
  userKey(wa) { return `kemoenik_${wa}`; },

  loadUserData(wa) {
    try {
      const key = this.userKey(wa);
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('loadUserData error:', e);
      return null;
    }
  },

  saveUserData(wa, data) {
    try {
      const key = this.userKey(wa);
      localStorage.setItem(key, JSON.stringify(data));
      return { success: true };
    } catch (e) {
      console.error('saveUserData error:', e);
      return { success: false };
    }
  },

  saveKalkulator(wa, data) {
    const existing = this.loadUserData(wa) || {};
    if (existing.kalkulator && existing.kalkulator.dietCal) {
      return { success: false, reason: 'exists' };
    }
    existing.kalkulator = { ...data, savedAt: new Date().toISOString() };
    return this.saveUserData(wa, existing);
  },

  saveQuiz(wa, data) {
    const existing = this.loadUserData(wa) || {};
    if (existing.quiz && existing.quiz.tipe) {
      return { success: false, reason: 'exists' };
    }
    existing.quiz = { ...data, savedAt: new Date().toISOString() };
    return this.saveUserData(wa, existing);
  },

  saveEvaluasi(wa, evalData) {
    const existing = this.loadUserData(wa) || {};
    const evaluasi = existing.evaluasi || [];
    const idx = evaluasi.findIndex(e => e.minggu === evalData.minggu);
    if (idx >= 0) {
      evaluasi[idx] = { ...evalData, updatedAt: new Date().toISOString() };
    } else {
      evaluasi.push({ ...evalData, savedAt: new Date().toISOString() });
    }
    existing.evaluasi = evaluasi;
    return this.saveUserData(wa, existing);
  },

  saveProfile(wa, profile) {
    const existing = this.loadUserData(wa) || {};
    existing.profile = { ...profile, lastLogin: new Date().toISOString() };
    return this.saveUserData(wa, existing);
  },

  resetProgram(wa) {
    const existing = this.loadUserData(wa) || {};
    const profile = existing.profile || {};
    const newData = {
      profile,
      kalkulator: null,
      quiz: null,
      evaluasi: [],
      missions: null,
      consumption: null,
      menuHarian: null,
      resetAt: new Date().toISOString()
    };
    return this.saveUserData(wa, newData);
  }
};

// Inisialisasi berdasarkan URL params
async function initApp() {
  const urlParams = new URLSearchParams(window.location.search);
  let wa = urlParams.get('wa') || localStorage.getItem('kemoenik_wa') || '';
  let voucher = urlParams.get('voucher') || localStorage.getItem('kemoenik_voucher') || '';
  const mode = urlParams.get('mode') || 'continue';

  // Jika tidak ada WA, tampilkan access screen
  if (!wa || !voucher) {
    document.getElementById('accessScreen').style.display = 'flex';
    document.getElementById('loadingScreen').style.display = 'none';
    return;
  }

  wa = normalizeWA(wa);
  localStorage.setItem('kemoenik_wa', wa);
  localStorage.setItem('kemoenik_voucher', voucher);
  document.getElementById('accessScreen').style.display = 'none';
  document.getElementById('loadingScreen').style.display = 'flex';

  // Load data dari localStorage
  let userData = DataService.loadUserData(wa);

  // Handle mode new: reset program tapi keep profile
  if (mode === 'new' && userData) {
    await DataService.resetProgram(wa);
    userData = { profile: userData.profile };
  }

  // Sinkron ke appState
  if (userData) {
    if (userData.kalkulator) appState.kalkulator = userData.kalkulator;
    if (userData.quiz) appState.quiz = userData.quiz;
    if (userData.evaluasi) appState.evaluasi = userData.evaluasi;
    if (userData.profile) appState.user = { ...appState.user, ...userData.profile };
  }

  // Fallback ke state lama jika ada
  StateManager.loadFromStorage();
  if (appState.kalkulator && !userData?.kalkulator) {
    // Simpan ke storage per WA
    const saveData = { profile: appState.user, kalkulator: appState.kalkulator, evaluasi: appState.evaluasi, quiz: appState.quiz };
    DataService.saveUserData(wa, saveData);
  }

  // Update user nama dari kalkulator
  if (appState.kalkulator?.nama) appState.user.nama = appState.kalkulator.nama;

  StateManager._persist();

  // Simpan profile minimal
  await DataService.saveProfile(wa, {
    nama: appState.user.nama || 'User',
    wa: wa,
    voucherAktif: voucher,
    lastActive: new Date().toISOString()
  });

  document.getElementById('loadingScreen').style.display = 'none';
  document.getElementById('app').style.display = 'flex';

  renderAll();
  setTimeout(renderHomeJadwal, 150);

  if (localStorage.getItem('kemoenik_just_finished_quiz') === 'true') {
    localStorage.removeItem('kemoenik_just_finished_quiz');
    setTimeout(() => {
      renderProfilPage();
      ['acc-trait','acc-karakter','acc-skor'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('on');
      });
    }, 200);
  }
}

// Render semua komponen
function renderAll() {
  renderHomeStats();
  renderHomeGreeting();
  renderProgress();
  renderEvalHome();
  renderFAQ();
  renderProfilPage();
  renderTipsNotif();
  renderJadwalOlahraga();
  renderMenuHarian();
  renderDrawer();
  renderHomeJadwal();

  const kuisNotif = document.getElementById('kuisFirstNotif');
  if (kuisNotif) kuisNotif.style.display = appState.quiz ? 'none' : 'flex';
}

// Navigasi antar halaman
function go(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.bn').forEach(b => b.classList.remove('on'));
  document.querySelectorAll('.d-item').forEach(d => d.classList.remove('on'));

  const pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('on');

  const pills = document.querySelectorAll('.pill');
  const pillMap = { home:0, profil:1, tips:2, program:3 };
  if (pillMap[page] !== undefined && pills[pillMap[page]]) pills[pillMap[page]].classList.add('on');

  const bn = document.getElementById('bn-' + page);
  if (bn) bn.classList.add('on');

  const di = document.getElementById('di-' + page);
  if (di) di.classList.add('on');

  if (page === 'profil') renderProfilPage();

  document.getElementById('content').scrollTo({ top: 0, behavior: 'smooth' });
  gtag('event', 'page_view', { page_title: page });
}

// ==================== RENDER FUNGSI ====================
// (semua fungsi render seperti di 9.html, disesuaikan dengan appState)
// Karena panjang, di sini hanya placeholder. Pada implementasi nyata,
// salin seluruh fungsi render dari 9.html dan ganti referensi Firebase dengan localStorage.
// Contoh beberapa fungsi:

function renderHomeStats() {
  const k = appState.kalkulator;
  const q = appState.quiz;
  const nama = k ? (k.nama || '—') : (q ? (q.nama || '—') : '—');
  document.getElementById('userName').textContent = nama.split(' ')[0] || '—';
  document.getElementById('dName').textContent = nama || '—';

  if (q) {
    document.getElementById('heroName').innerHTML = escHtml(q.tipeName) + ' <span>' + escHtml(q.tipe_emoji) + '</span>';
    document.getElementById('heroBadge').textContent = q.metode === 'agresif' ? '🔥 Agresif' : q.metode === 'ringan' ? '🐢 Ringan' : '⚖️ Standar';
    document.getElementById('statMetode').textContent = q.metode || '—';
  }

  if (k) {
    document.getElementById('statKkal').textContent = k.dietCal ? Math.round(k.dietCal).toLocaleString('id') : '—';
    document.getElementById('statMinggu').textContent = k.targetMinggu ? k.targetMinggu + 'mg' : '—';
    document.getElementById('estMinggu').textContent = k.targetMinggu ? k.targetMinggu + ' minggu' : '—';
    document.getElementById('estTanggal').textContent = k.estTanggal || '—';
    document.getElementById('estLingkar').textContent = k.estLingkar ? k.estLingkar + ' cm' : '—';
    document.getElementById('progNama').textContent = (nama || '—') + (q ? ' — ' + q.tipeName : '');
    document.getElementById('progDesc').textContent = 'Mulai: ' + (k.startDateDisplay || k.startDate || '—') + ' | Target: ' + (k.target || '—') + ' kg';
    document.getElementById('piSubKalori').textContent = k.dietCal ? Math.round(k.dietCal) + ' kkal/hari • ' + k.targetMinggu + ' minggu' : 'Hitung kebutuhan kalori & target mingguanmu';
    document.getElementById('progNotif').style.display = 'flex';
  }

  document.getElementById('evalTarget').textContent = k ? (k.target || '—') + ' kg' : '—';
  if (document.getElementById('mealTargetDisplay')) document.getElementById('mealTargetDisplay').textContent = k ? Math.round(k.dietCal) : '—';
  if (document.getElementById('targetKcalLengkap')) document.getElementById('targetKcalLengkap').textContent = k ? Math.round(k.dietCal) : '—';
}

function renderHomeGreeting() {
  // ... sama seperti 9.html
}

function renderProgress() {
  // ... hitung hari dari startDate
}

function renderEvalHome() {
  // ... hitung total turun
}

function renderFAQ() {
  const container = document.getElementById('faqContainer');
  let html = '';
  faqData.forEach((cat, catIdx) => {
    html += '<div class="faq-item" id="faqCat' + catIdx + '">';
    html += '<div class="faq-hd" onclick="togFaq(\'faqCat' + catIdx + '\')">' + cat.cat + '<span class="faq-arr">›</span></div>';
    html += '<div class="faq-bd">';
    cat.items.forEach(item => {
      html += '<div class="faq-q">❓ ' + item.q + '</div>';
      html += '<div class="faq-a">' + item.a + '</div>';
    });
    html += '</div></div>';
  });
  setSafeHTML(container, html);
}

function renderProfilPage() {
  // ... tampilkan trait, karakter, skor dari appState.quiz
}

function renderTipsNotif() {
  const notif = document.getElementById('tipsNotifBanner');
  if (notif) notif.style.display = appState.quiz ? 'flex' : 'none';
}

function renderJadwalOlahraga() {
  const metode = appState.quiz ? appState.quiz.metode : 'standar';
  const data = targetOlahragaData[metode] || targetOlahragaData.standar;
  let html = '';
  data.forEach(d => {
    const isRest = d.aktivitas.indexOf('Istirahat') !== -1;
    html += '<div class="jadwal-item">';
    html += '<div class="jadwal-time" style="color:' + (isRest ? 'var(--text3)' : 'var(--green)') + ';">' + d.hari + '</div>';
    html += '<div class="jadwal-content"><div class="jadwal-title">' + d.aktivitas + '</div></div>';
    if (!isRest) html += '<div>💪</div>';
    html += '</div>';
  });
  setSafeHTML(document.getElementById('jadwalNormalList'), html);
}

function renderHomeJadwal() {
  const el = document.getElementById('homeJadwalContent');
  if (!el) return;
  const metode = appState.quiz ? appState.quiz.metode : 'standar';
  const jadwal = targetOlahragaData[metode] || targetOlahragaData.standar;
  const hariIdx = new Date().getDay();
  const hariMap = [6,0,1,2,3,4,5];
  const todayData = jadwal[hariMap[hariIdx]] || jadwal[0];
  const hariNames = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const hariName = hariNames[hariIdx];
  const akt = todayData.aktivitas || '';
  const isRest = akt.indexOf('Istirahat') !== -1;

  let html = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">';
  html += '<div style="width:44px;height:44px;border-radius:13px;background:' + (isRest ? '#F3F4F6' : 'linear-gradient(135deg,var(--green),var(--green3))') + ';display:flex;align-items:center;justify-content:center;">';
  if (isRest) html += '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>';
  else html += '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="5" r="2"/><path d="M12 7v8"/></svg>';
  html += '</div>';
  html += '<div><div style="font-size:14px;font-weight:800;color:var(--text);">' + hariName + '</div>';
  html += '<div style="font-size:11px;color:var(--text3);">Metode ' + metode.charAt(0).toUpperCase() + metode.slice(1) + '</div></div></div>';
  html += '<div style="background:' + (isRest ? '#F9FAFB' : '#ECFDF5') + ';border-radius:12px;padding:12px 14px;">';
  html += '<div style="font-size:13px;color:' + (isRest ? '#6B7280' : '#065F46') + ';line-height:1.7;">' + akt + '</div>';
  if (!isRest) {
    html += '<div style="display:flex;gap:8px;margin-top:10px;"><div style="background:white;border-radius:8px;padding:5px 10px;">⏱️ 30 menit</div>';
    html += '<div style="background:white;border-radius:8px;padding:5px 10px;">🔥 ~150 kkal</div></div>';
  }
  html += '</div>';
  html += '<button onclick="openPanel(\'panelJadwalOlahraga\')" style="width:100%;margin-top:10px;padding:10px;background:var(--green);color:white;border:none;border-radius:10px;font-weight:700;">Jadwal Lengkap</button>';
  setSafeHTML(el, html);
}

function renderDrawer() {
  const nama = appState.kalkulator?.nama || appState.user.nama || '—';
  document.getElementById('dName').textContent = nama;
  document.getElementById('dSub').textContent = appState.quiz ? appState.quiz.tipeName : 'Program Diet KEMOENIK';
}

function renderMenuHarian() {
  const totalCal = appState.kalkulator ? Math.round(appState.kalkulator.dietCal) : 1450;
  document.getElementById('mealTargetDisplay').textContent = totalCal;
  let html = '';
  menuHarianData.forEach(m => {
    html += '<div class="meal-card">';
    html += '<div class="meal-time-box"><div class="meal-time-label">WIB</div><div class="meal-time-value">' + m.time + '</div></div>';
    html += '<div class="meal-content"><div class="meal-title">' + m.icon + ' ' + m.label + '</div><div class="meal-desc">' + m.menu + '</div></div>';
    html += '<div class="meal-cal">~' + m.cal + ' kkal</div></div>';
  });
  setSafeHTML(document.getElementById('menuHariIni'), html);
}

function renderEvalHistory() {
  const container = document.getElementById('weeklyHistoryList');
  if (!appState.evaluasi.length) {
    container.innerHTML = '<div class="ph">Belum ada riwayat evaluasi</div>';
    return;
  }
  let html = '';
  appState.evaluasi.slice().reverse().forEach((e, revIdx) => {
    const realIdx = appState.evaluasi.length - 1 - revIdx;
    html += '<div class="hist-card">';
    html += '<div style="display:flex;justify-content:space-between;"><div><div class="hist-week">Minggu ke-' + e.minggu + '</div><div class="hist-date">' + e.tanggal + '</div></div>';
    html += '<button onclick="editEval(' + realIdx + ')" style="padding:5px 10px;background:var(--offwhite);border:1px solid var(--border);border-radius:6px;font-size:11px;">Edit</button></div>';
    html += '<div class="hist-vals"><div><div class="hv-label">Awal</div><div class="hv-val">' + e.beratAwal + ' kg</div></div>';
    html += '<div><div class="hv-label">Akhir</div><div class="hv-val">' + e.beratAkhir + ' kg</div></div>';
    html += '<div><div class="hv-label">Turun</div><div class="hv-val">-' + e.turun + ' kg</div></div></div>';
    if (e.kondisi) html += '<div style="font-size:11px;color:var(--text3);">Kondisi: ' + e.kondisi.replace(/,/g,' · ') + '</div>';
    if (e.obstacle) html += '<div style="font-size:11px;color:var(--text3);">Catatan: ' + e.obstacle + '</div>';
    html += '</div>';
  });
  setSafeHTML(container, html);
}

// ==================== KALKULATOR ====================
function hitungKalkulator() {
  const nama = document.getElementById('inputNama').value.trim();
  const gender = document.getElementById('inputGender').value;
  const usia = parseFloat(document.getElementById('inputUsia').value) || 0;
  const berat = parseFloat(document.getElementById('inputBerat').value) || 0;
  const tinggi = parseFloat(document.getElementById('inputTinggi').value) || 0;
  const aktivitas = parseFloat(document.getElementById('inputAktivitas').value) || 0;
  const target = parseFloat(document.getElementById('inputTarget').value) || 0;
  const metode = document.getElementById('inputMetode').value;

  if (!nama || usia < 10 || berat < 30 || tinggi < 100 || target < 30 || !aktivitas) {
    showToast('Lengkapi semua data ya kak!');
    return;
  }
  if (target >= berat) {
    showToast('Target BB harus lebih kecil dari berat saat ini!');
    return;
  }

  // Hitung BMR (Mifflin-St Jeor)
  let bmr;
  if (gender === 'laki') {
    bmr = 10 * berat + 6.25 * tinggi - 5 * usia + 5;
  } else {
    bmr = 10 * berat + 6.25 * tinggi - 5 * usia - 161;
  }
  const tdee = Math.round(bmr * aktivitas);
  const defisit = metode === 'ringan' ? 300 : metode === 'agresif' ? 700 : 500;
  const dietCal = Math.round(tdee - defisit);
  const penurunanPerMinggu = metode === 'ringan' ? 0.3 : metode === 'agresif' ? 0.7 : 0.5;
  const selisihBB = berat - target;
  const targetMinggu = Math.ceil(selisihBB / penurunanPerMinggu);

  const today = new Date();
  const estDate = new Date(today.getTime() + targetMinggu * 7 * 24 * 60 * 60 * 1000);
  const estTanggal = estDate.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });

  // Estimasi lingkar perut sederhana
  const bmi = berat / ((tinggi/100) ** 2);
  let estLingkar;
  if (gender === 'laki') {
    estLingkar = Math.round(0.722 * bmi + 0.525 * (tinggi/100)*100 - 48.3 - (selisihBB * 0.8));
  } else {
    estLingkar = Math.round(0.735 * bmi + 0.625 * (tinggi/100)*100 - 40.2 - (selisihBB * 0.8));
  }
  estLingkar = Math.max(60, estLingkar);

  // Tampilkan hasil
  document.getElementById('hasilKkal').textContent = dietCal.toLocaleString('id');
  document.getElementById('hasilMinggu').textContent = targetMinggu + ' minggu';
  document.getElementById('hasilTanggal').textContent = estTanggal;
  document.getElementById('hasilLingkar').textContent = estLingkar + ' cm';
  document.getElementById('hasilBMR').textContent = Math.round(bmr).toLocaleString('id');
  document.getElementById('hasilTDEE').textContent = tdee.toLocaleString('id');
  document.getElementById('hasilDefisit').textContent = defisit;

  document.getElementById('kalkulatorForm').style.display = 'none';
  document.getElementById('hasilKalkulator').style.display = 'block';

  const startDateISO = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2,'0') + '-' +
    String(today.getDate()).padStart(2,'0');
  const startDateDisplay = today.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });

  window._tempKalData = {
    nama, gender, usia, berat, tinggi, aktivitas, target, metode,
    dietCal, targetMinggu, estTanggal, estLingkar, bmr: Math.round(bmr), tdee, defisit,
    startDate: startDateISO, startDateISO, startDateDisplay
  };
}

async function simpanKalkulator(btnEl) {
  const data = window._tempKalData;
  if (!data) { showToast('Klik "Generate Program" dulu!'); return; }

  const wa = appState.user.wa || localStorage.getItem('kemoenik_wa');
  if (!wa) { showToast('WA tidak ditemukan'); return; }

  const check = DataService.saveKalkulator(wa, data);
  if (!check.success && check.reason === 'exists') {
    showToast('Kalkulator sudah pernah diisi. Gunakan tombol Reset.');
    return;
  }
  if (!check.success) { showToast('Gagal menyimpan'); return; }

  appState.kalkulator = data;
  appState.user.nama = data.nama;
  StateManager._persist();
  localStorage.setItem('kemoenik_kal_data', JSON.stringify(data));

  window._tempKalData = null;
  closePanel('panelKalkulator');
  go('home');
  setTimeout(() => {
    renderAll();
    showToast('✅ Program tersimpan!');
  }, 80);
}

function resetKalkulator() {
  if (!confirm('Yakin reset kalkulator? Data akan dihapus.')) return;
  const wa = appState.user.wa || localStorage.getItem('kemoenik_wa');
  if (wa) {
    const userData = DataService.loadUserData(wa) || {};
    userData.kalkulator = null;
    DataService.saveUserData(wa, userData);
  }
  appState.kalkulator = null;
  StateManager._persist();
  localStorage.removeItem('kemoenik_kal_data');
  document.getElementById('hasilKalkulator').style.display = 'none';
  document.getElementById('kalkulatorForm').style.display = 'block';
  showToast('✅ Kalkulator direset');
}

function loadKalkulatorForm() {
  const k = appState.kalkulator;
  const q = appState.quiz;
  if (k) {
    document.getElementById('inputNama').value = k.nama || '';
    document.getElementById('inputGender').value = k.gender || 'perempuan';
    document.getElementById('inputUsia').value = k.usia || '';
    document.getElementById('inputBerat').value = k.berat || '';
    document.getElementById('inputTinggi').value = k.tinggi || '';
    document.getElementById('inputAktivitas').value = k.aktivitas || 1.375;
    document.getElementById('inputTarget').value = k.target || '';
    document.getElementById('inputMetode').value = k.metode || 'standar';
  } else if (q) {
    document.getElementById('inputMetode').value = q.metode || 'standar';
  }
}

// ==================== QUIZ ====================
let currentQ = 0;
let selectedAnswers = new Array(15).fill(null);
let finalResult = null;

function startQuiz() {
  currentQ = 0;
  selectedAnswers = new Array(15).fill(null);
  finalResult = null;
  document.getElementById('quizIntro').style.display = 'none';
  document.getElementById('quizRunning').style.display = 'block';
  document.getElementById('quizResult').style.display = 'none';
  renderQuestion();
}

function renderQuestion() {
  const q = quizQuestions[currentQ];
  const pct = Math.round((currentQ / 15) * 100);
  document.getElementById('qCurrent').textContent = currentQ + 1;
  document.getElementById('qPct').textContent = pct + '%';
  document.getElementById('qFill').style.width = pct + '%';
  document.getElementById('qNum').textContent = 'PERTANYAAN ' + String(currentQ+1).padStart(2,'0');
  document.getElementById('qText').textContent = q.text;

  let html = '';
  q.options.forEach((opt, idx) => {
    const sel = selectedAnswers[currentQ] === idx;
    html += '<div class="quiz-option' + (sel ? ' selected' : '') + '" onclick="selectAnswer(' + idx + ')">';
    html += '<div class="quiz-opt-emoji">' + opt.emoji + '</div>';
    html += '<div class="quiz-opt-text">' + opt.text + '</div>';
    html += '<div class="quiz-opt-radio">' + (sel ? '<div style="width:8px;height:8px;border-radius:50%;background:#FFF;"></div>' : '') + '</div>';
    html += '</div>';
  });
  setSafeHTML(document.getElementById('qOptions'), html);

  document.getElementById('btnBack').style.display = currentQ > 0 ? 'flex' : 'none';
  document.getElementById('btnNext').disabled = selectedAnswers[currentQ] === null;
  document.getElementById('btnNext').innerHTML = currentQ === 14 ? '<i class="fas fa-chart-bar"></i> Lihat Hasil' : 'Lanjut <i class="fas fa-arrow-right"></i>';
}

function selectAnswer(idx) {
  selectedAnswers[currentQ] = idx;
  renderQuestion();
}
function goNext() {
  if (selectedAnswers[currentQ] === null) return;
  if (currentQ < 14) { currentQ++; renderQuestion(); }
  else showResult();
}
function goBack() {
  if (currentQ > 0) { currentQ--; renderQuestion(); }
}

function calculateResult() {
  const scores = [0,0,0,0,0,0,0];
  selectedAnswers.forEach((ansIdx, qIdx) => {
    if (ansIdx === null) return;
    quizQuestions[qIdx].options[ansIdx].scores.forEach((val, tIdx) => scores[tIdx] += val);
  });
  const maxIdx = scores.indexOf(Math.max(...scores));
  return quizTypes[maxIdx];
}

async function showResult() {
  finalResult = calculateResult();
  document.getElementById('quizRunning').style.display = 'none';
  document.getElementById('quizResult').style.display = 'block';

  document.getElementById('qrTypeName').innerHTML = 'Tipe <em>' + escHtml(finalResult.name.replace('Tipe ','')) + '</em>';
  document.getElementById('qrTagline').textContent = finalResult.tagline;
  document.getElementById('qrMetodeName').textContent = finalResult.metodeName;
  document.getElementById('qrScore').textContent = finalResult.skor;
  setTimeout(() => document.getElementById('qrGaugeBar').style.width = finalResult.skor + '%', 400);

  const traits = traitDataByType[finalResult.id] || traitDataByType[2];
  let tHtml = '';
  traits.forEach(t => {
    tHtml += '<div class="trait-card"><div class="trait-top"><div class="trait-name">' + t.name + '</div><div class="trait-badge ' + t.badgeClass + '">' + t.badge + '</div></div>';
    tHtml += '<div class="trait-bar-bg"><div class="trait-bar-marker" style="left:' + t.pct + '%"></div></div>';
    tHtml += '<div class="trait-labels">' + t.labels.map(l => '<span>' + l + '</span>').join('') + '</div>';
    tHtml += '<div class="trait-desc">' + t.desc + '</div></div>';
  });
  setSafeHTML(document.getElementById('quizTraitCards'), tHtml);

  let tipsHtml = '<div style="background:' + finalResult.bg + ';border-radius:14px;padding:14px;margin-bottom:14px;">';
  tipsHtml += '<div style="font-size:12px;font-weight:700;color:' + finalResult.textColor + ';margin-bottom:8px;">🎯 Metode Kamu: ' + finalResult.metodeName + '</div></div>';
  finalResult.tips.forEach(tip => {
    tipsHtml += '<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);"><div style="color:var(--green);">✓</div><div style="font-size:13px;color:var(--text3);">' + tip + '</div></div>';
  });
  setSafeHTML(document.getElementById('quizTipsContent'), tipsHtml);

  const metodeKey = finalResult.metode;
  const jadwal = targetOlahragaData[metodeKey] || targetOlahragaData.standar;
  let progHtml = '<div style="font-size:12px;font-weight:700;color:var(--green);margin-bottom:12px;">📅 Jadwal Olahraga Mingguan</div>';
  progHtml += '<div style="background:var(--offwhite);border-radius:12px;padding:14px;">';
  jadwal.forEach(d => {
    progHtml += '<div style="display:flex;gap:10px;padding:6px 0;border-bottom:1px solid var(--border);">';
    progHtml += '<div style="font-size:11px;font-weight:700;color:var(--green);width:28px;">' + d.hari + '</div>';
    progHtml += '<div style="flex:1;font-size:12px;">' + d.aktivitas + '</div>';
    progHtml += '<div>💪</div></div>';
  });
  progHtml += '</div>';
  setSafeHTML(document.getElementById('quizProgramContent'), progHtml);

  const qData = {
    tipe: finalResult.id, tipeName: finalResult.name, metode: finalResult.metode,
    metodeName: finalResult.metodeName, tagline: finalResult.tagline,
    skor: finalResult.skor, tipe_emoji: finalResult.emoji
  };
  appState.quiz = qData;
  StateManager._persist();
  localStorage.setItem('kemoenik_quiz', JSON.stringify(qData));

  const wa = appState.user.wa || localStorage.getItem('kemoenik_wa');
  if (wa) await DataService.saveQuiz(wa, qData);

  renderAll();
  gtag('event', 'quiz_completed', { tipe: finalResult.name });
}

async function selesaiQuiz() {
  if (!finalResult) { showToast('Error'); return; }
  const wa = appState.user.wa || localStorage.getItem('kemoenik_wa');
  if (!wa) { showToast('WA tidak ditemukan'); return; }

  const qData = {
    tipe: finalResult.id, tipeName: finalResult.name, metode: finalResult.metode,
    metodeName: finalResult.metodeName, tagline: finalResult.tagline,
    skor: finalResult.skor, tipe_emoji: finalResult.emoji
  };

  const check = DataService.saveQuiz(wa, qData);
  if (!check.success && check.reason === 'exists') {
    showToast('Kuis sudah pernah diisi. Gunakan tombol Reset Quiz.');
    return;
  }
  if (!check.success) { showToast('Gagal menyimpan'); return; }

  appState.quiz = qData;
  StateManager._persist();
  localStorage.setItem('kemoenik_quiz', JSON.stringify(qData));

  go('profil');
  setTimeout(() => {
    renderAll();
    renderProfilPage();
    ['acc-trait','acc-karakter','acc-skor'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('on');
    });
    showToast('✅ Profil metabolisme tersimpan!');
  }, 150);
}

function ulangQuiz() {
  currentQ = 0;
  selectedAnswers = new Array(15).fill(null);
  finalResult = null;
  document.getElementById('quizIntro').style.display = 'block';
  document.getElementById('quizRunning').style.display = 'none';
  document.getElementById('quizResult').style.display = 'none';
}

function resetQuizData() {
  if (!confirm('Yakin reset hasil kuis?')) return;
  const wa = appState.user.wa || localStorage.getItem('kemoenik_wa');
  if (wa) {
    const userData = DataService.loadUserData(wa) || {};
    userData.quiz = null;
    DataService.saveUserData(wa, userData);
  }
  appState.quiz = null;
  StateManager._persist();
  localStorage.removeItem('kemoenik_quiz');
  showToast('✅ Quiz direset');
  document.getElementById('quizIntro').style.display = 'block';
  document.getElementById('quizRunning').style.display = 'none';
  document.getElementById('quizResult').style.display = 'none';
}

function showResultTab(name, btn) {
  document.querySelectorAll('.result-tab-panel').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.rt-btn').forEach(b => b.classList.remove('on'));
  document.getElementById('rt' + name.charAt(0).toUpperCase() + name.slice(1)).classList.add('on');
  if (btn) btn.classList.add('on');
}

// ==================== EVALUASI MINGGUAN ====================
let editingEvalIdx = -1;
let condChecked = {};

function toggleCond(el, key) {
  el.classList.toggle('checked');
  condChecked[key] = el.classList.contains('checked');
}

function calcWeeklyLoss() {
  const start = parseFloat(document.getElementById('weekStartWeight').value) || 0;
  const end = parseFloat(document.getElementById('weekEndWeight').value) || 0;
  if (start > 0 && end > 0 && start > end) {
    const loss = (start - end).toFixed(1);
    document.getElementById('weeklyLossValue').textContent = loss + ' kg';
    document.getElementById('weeklyLossResult').style.display = 'block';
  } else {
    document.getElementById('weeklyLossResult').style.display = 'none';
  }
}

async function saveWeeklyEval() {
  const start = parseFloat(document.getElementById('weekStartWeight').value) || 0;
  const end = parseFloat(document.getElementById('weekEndWeight').value) || 0;
  const obstacle = document.getElementById('weeklyObstacle').value;

  if (!start || !end) { showToast('Isi berat awal dan akhir!'); return; }

  const turun = Math.max(0, parseFloat((start - end).toFixed(1)));
  const tanggal = new Date().toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });

  let minggu;
  if (editingEvalIdx >= 0) {
    minggu = appState.evaluasi[editingEvalIdx].minggu;
  } else {
    minggu = appState.evaluasi.length + 1;
  }

  const evalData = {
    minggu, beratAwal: start, beratAkhir: end, turun,
    obstacle: obstacle || '',
    kondisi: Object.keys(condChecked).filter(k => condChecked[k]).join(','),
    tanggal, savedAt: new Date().toISOString()
  };

  if (editingEvalIdx >= 0) {
    appState.evaluasi[editingEvalIdx] = evalData;
    editingEvalIdx = -1;
    document.getElementById('editModeIndicator').style.display = 'none';
    document.getElementById('btnCancelEdit').style.display = 'none';
  } else {
    appState.evaluasi.push(evalData);
  }
  StateManager._persist();

  const wa = appState.user.wa || localStorage.getItem('kemoenik_wa');
  if (wa) await DataService.saveEvaluasi(wa, evalData);

  document.getElementById('weekStartWeight').value = '';
  document.getElementById('weekEndWeight').value = '';
  document.getElementById('weeklyObstacle').value = '';
  document.getElementById('weeklyLossResult').style.display = 'none';
  condChecked = {};
  document.querySelectorAll('.cond-item').forEach(el => el.classList.remove('checked'));

  renderEvalHome();
  renderEvalHistory();
  renderHomeStats();

  showToast('✅ Evaluasi Minggu ke-' + minggu + ' disimpan! -' + turun + ' kg');
}

function cancelEdit() {
  editingEvalIdx = -1;
  document.getElementById('editModeIndicator').style.display = 'none';
  document.getElementById('btnCancelEdit').style.display = 'none';
  document.getElementById('weekStartWeight').value = '';
  document.getElementById('weekEndWeight').value = '';
  document.getElementById('weeklyObstacle').value = '';
  document.getElementById('weeklyLossResult').style.display = 'none';
}

function editEval(idx) {
  const e = appState.evaluasi[idx];
  document.getElementById('weekStartWeight').value = e.beratAwal;
  document.getElementById('weekEndWeight').value = e.beratAkhir;
  document.getElementById('weeklyObstacle').value = e.obstacle || '';
  document.getElementById('editWeekNumber').textContent = e.minggu;
  document.getElementById('editModeIndicator').style.display = 'block';
  document.getElementById('btnCancelEdit').style.display = 'block';
  editingEvalIdx = idx;
  calcWeeklyLoss();
}

// ==================== MISSION ====================
function setMissionMode(mode) {
  document.querySelectorAll('.mission-set').forEach(s => s.classList.remove('show'));
  document.querySelectorAll('.mm-btn').forEach(b => b.classList.remove('on'));
  if (mode === 'normal') {
    document.getElementById('misiNormal').classList.add('show');
    document.getElementById('modeNormal').classList.add('on');
  } else {
    document.getElementById('misiIF').classList.add('show');
    document.getElementById('modeIF').classList.add('on');
  }
  localStorage.setItem('kemoenik_mission_mode', mode);
}

function toggleMission(itemId, checkId) {
  const item = document.getElementById(itemId);
  const check = document.getElementById(checkId);
  const isDone = item.classList.toggle('done');
  if (isDone) { check.classList.add('checked'); check.textContent = '✓'; }
  else { check.classList.remove('checked'); check.textContent = ''; }

  const saved = JSON.parse(localStorage.getItem('kemoenik_misi_' + getTodayStr()) || '{}');
  saved[itemId] = isDone;
  localStorage.setItem('kemoenik_misi_' + getTodayStr(), JSON.stringify(saved));
}

function loadMisiChecked() {
  const saved = JSON.parse(localStorage.getItem('kemoenik_misi_' + getTodayStr()) || '{}');
  Object.keys(saved).forEach(id => {
    const checkId = id.replace('n','nc').replace('i','ic');
    const item = document.getElementById(id);
    const check = document.getElementById(checkId);
    if (item && check && saved[id]) {
      item.classList.add('done');
      check.classList.add('checked');
      check.textContent = '✓';
    }
  });
  const mode = localStorage.getItem('kemoenik_mission_mode') || 'normal';
  setMissionMode(mode);
}

// ==================== CUSTOM MENU ====================
let cmSelectedItems = [];
let cmTargetCalories = 1450;
let cmCurrentCategory = 'all';

function cmSetTarget(val) {
  cmTargetCalories = parseInt(val) || 1450;
  document.getElementById('cmCurrentTarget').textContent = cmTargetCalories + ' kcal';
  document.getElementById('cmDisplayTarget').textContent = cmTargetCalories;
  cmUpdateSummary();
}

function cmFilterCat(cat, btn) {
  cmCurrentCategory = cat;
  document.querySelectorAll('#cmCatFilter button').forEach(b => {
    b.style.background = 'var(--white)'; b.style.color = 'var(--text3)'; b.style.border = '1px solid var(--border)';
  });
  if (btn) { btn.style.background = 'var(--green)'; btn.style.color = '#FFF'; btn.style.border = '1px solid var(--green)'; }
  renderCmFoodGrid();
}

function renderCmFoodGrid() {
  const k = appState.kalkulator;
  if (k && k.dietCal) {
    cmTargetCalories = Math.round(k.dietCal);
    document.getElementById('cmTargetCal').value = cmTargetCalories;
    document.getElementById('cmCurrentTarget').textContent = cmTargetCalories + ' kcal';
    document.getElementById('cmDisplayTarget').textContent = cmTargetCalories;
  }
  const foods = cmCurrentCategory === 'all' ? cmFoodDatabase : cmFoodDatabase.filter(f => f.category === cmCurrentCategory);
  let html = '';
  foods.forEach(f => {
    const isSel = cmSelectedItems.find(s => s.id === f.id);
    html += '<div class="cm-food-item' + (isSel ? ' cm-selected' : '') + '" onclick="cmToggleFood(' + f.id + ')">';
    html += '<div class="cm-check">✓</div>';
    html += '<div class="cm-name">' + f.name + '</div>';
    html += '<div class="cm-cal">' + f.baseCal + ' kkal/' + f.baseAmount + ' ' + f.unit + '</div>';
    html += '</div>';
  });
  setSafeHTML(document.getElementById('cmFoodGrid'), html);
}

function cmToggleFood(id) {
  const food = cmFoodDatabase.find(f => f.id === id);
  const idx = cmSelectedItems.findIndex(s => s.id === id);
  if (idx >= 0) cmSelectedItems.splice(idx, 1);
  else cmSelectedItems.push({ id: food.id, name: food.name, cal: food.baseCal, amount: food.baseAmount, unit: food.unit, baseCal: food.baseCal, baseAmount: food.baseAmount });
  renderCmFoodGrid();
  cmUpdateSummary();
}

function cmUpdateSummary() {
  const total = cmSelectedItems.reduce((sum, item) => sum + (item.baseAmount > 0 ? Math.round(item.cal * item.amount / item.baseAmount) : 0), 0);
  const pct = cmTargetCalories > 0 ? Math.min(100, Math.round(total / cmTargetCalories * 100)) : 0;
  document.getElementById('cmDisplayUsed').textContent = total;
  document.getElementById('cmProgressBar').style.width = pct + '%';
  const statusEl = document.getElementById('cmStatus');
  if (total > cmTargetCalories * 1.05) {
    statusEl.textContent = '⚠️ Melebihi target! Kurangi porsi';
    statusEl.style.background = 'rgba(239,68,68,0.3)';
  } else if (total >= cmTargetCalories * 0.9) {
    statusEl.textContent = '✅ Kalori pas! Diet terjaga';
    statusEl.style.background = 'rgba(46,204,113,0.3)';
  } else {
    const sisa = cmTargetCalories - total;
    statusEl.textContent = '📊 Sisa ' + sisa + ' kkal lagi';
    statusEl.style.background = 'rgba(255,255,255,0.2)';
  }
}

function cmReset() {
  cmSelectedItems = [];
  renderCmFoodGrid();
  cmUpdateSummary();
}

// ==================== ACCORDION & FAQ ====================
function tog(id) {
  document.getElementById(id).classList.toggle('on');
}
function togFaq(id) {
  document.getElementById(id).classList.toggle('on');
}

function switchMenuTab(tab, btn) {
  ['ekonomis','standar','premium','custom'].forEach(t => {
    const el = document.getElementById('tabMenu' + t.charAt(0).toUpperCase() + t.slice(1));
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('.menu-tab-btn').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  if (tab === 'custom') renderCmFoodGrid();
}

function toggleOlahraga(mode) {
  const isIF = mode === 'if';
  document.getElementById('jadwalNormalWrap').style.display = isIF ? 'none' : 'block';
  document.getElementById('jadwalIFWrap').style.display = isIF ? 'block' : 'none';
  const normalBtn = document.getElementById('olahragaNormalBtn');
  const ifBtn = document.getElementById('olahragaIFBtn');
  if (isIF) {
    normalBtn.style.background = 'var(--white)'; normalBtn.style.color = 'var(--text3)'; normalBtn.style.border = '2px solid var(--border)';
    ifBtn.style.background = '#F5F3FF'; ifBtn.style.color = '#7C3AED'; ifBtn.style.border = '2px solid #DDD6FE';
  } else {
    normalBtn.style.background = 'var(--green)'; normalBtn.style.color = '#FFF'; normalBtn.style.border = '2px solid var(--green)';
    ifBtn.style.background = 'var(--white)'; ifBtn.style.color = 'var(--text3)'; ifBtn.style.border = '2px solid var(--border)';
  }
}

function animScore() {
  const q = appState.quiz;
  const skor = q ? (q.skor || 72) : 72;
  const circumference = 326;
  const offset = circumference - (skor / 100 * circumference);
  document.getElementById('srFill').style.strokeDashoffset = offset;
}

// ==================== NOTIFICATION SCHEDULER ====================
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

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  renderFAQ();
  const mode = localStorage.getItem('kemoenik_mission_mode') || 'normal';
  setMissionMode(mode);
  initApp();

  // Setup reminder check setiap menit
  setInterval(checkAndShowReminder, 60000);
  setTimeout(checkAndShowReminder, 2000);

  // Permission notifikasi
  if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-panel.on').forEach(p => closePanel(p.id));
  }
});

// Expose fungsi ke global
window.go = go;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.openPanel = openPanel;
window.closePanel = closePanel;
window.openBeli = openBeli;
window.goToAktivitas = goToAktivitas;
window.tog = tog;
window.togFaq = togFaq;
window.setMissionMode = setMissionMode;
window.toggleMission = toggleMission;
window.hitungKalkulator = hitungKalkulator;
window.simpanKalkulator = simpanKalkulator;
window.resetKalkulator = resetKalkulator;
window.startQuiz = startQuiz;
window.selectAnswer = selectAnswer;
window.goNext = goNext;
window.goBack = goBack;
window.selesaiQuiz = selesaiQuiz;
window.ulangQuiz = ulangQuiz;
window.resetQuizData = resetQuizData;
window.showResultTab = showResultTab;
window.toggleCond = toggleCond;
window.calcWeeklyLoss = calcWeeklyLoss;
window.saveWeeklyEval = saveWeeklyEval;
window.cancelEdit = cancelEdit;
window.editEval = editEval;
window.cmSetTarget = cmSetTarget;
window.cmFilterCat = cmFilterCat;
window.cmToggleFood = cmToggleFood;
window.cmReset = cmReset;
window.switchMenuTab = switchMenuTab;
window.toggleOlahraga = toggleOlahraga;
window.animScore = animScore;
window.dismissReminder = dismissReminder;
window.markReminderDone = markReminderDone;
window.snoozeReminder = snoozeReminder;
