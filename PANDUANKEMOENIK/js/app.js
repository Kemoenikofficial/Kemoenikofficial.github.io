/* ============================================================
   KEMOENIK APP v2.0 - script.js
   Main application logic
   ============================================================ */

var APP_URL = 'https://kemoenikofficial.github.io/aktivitas/';

// ACCESS CONTROL
function goToAktivitas() {
  window.location.href = APP_URL;
}

function getQueryParam(key) {
  var params = new URLSearchParams(window.location.search);
  return params.get(key) || '';
}

// NORMALIZE WA
function normalizeWA(wa) {
  wa = wa.replace(/\D/g, '');
  if (wa.startsWith('08')) return '62' + wa.substring(1);
  if (wa.startsWith('+62')) return wa.substring(1);
  if (wa.startsWith('62')) return wa;
  if (wa.startsWith('0')) return '62' + wa.substring(1);
  return wa;
}

// INIT APP
function initApp() {
  try {
    var wa = getQueryParam('wa') || localStorage.getItem('kemoenik_wa') || '';
    var mode = getQueryParam('mode') || 'continue';

    if (!wa) wa = localStorage.getItem('kemoenik_temp_wa') || '';
    var normalizedWA = wa ? normalizeWA(wa) : '';

    if (normalizedWA) {
      localStorage.setItem('kemoenik_wa', normalizedWA);
    }
    localStorage.setItem('kemoenik_mode', mode);

    var accessScreen = document.getElementById('accessScreen');
    var loadingScreen = document.getElementById('loadingScreen');
    var app = document.getElementById('app');
    
    if (accessScreen) accessScreen.style.display = 'none';
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (app) app.style.display = 'flex';

    // Load data dari localStorage
    var userData = normalizedWA ? lsLoadAll(normalizedWA) : null;

    // Handle mode "new"
    if (mode === 'new' && userData && normalizedWA) {
      lsRemove(normalizedWA, 'kalkulator');
      lsRemove(normalizedWA, 'quiz');
      lsRemove(normalizedWA, 'evaluasi');
      userData = { profile: userData.profile };
    }

    // Sync ke appState
    if (userData) {
      if (userData.kalkulator) state.set('kalkulator', userData.kalkulator);
      if (userData.quiz) state.set('quiz', userData.quiz);
      if (userData.evaluasi && userData.evaluasi.length) state.set('evaluasi', userData.evaluasi);
      if (userData.profile) state.set('user.nama', userData.profile.nama);
      if (normalizedWA) state.set('user.wa', normalizedWA);
    }

    // Fallback backward compat
    if (!appState.kalkulator) {
      try {
        var raw = localStorage.getItem('kemoenik_kal_data');
        if (raw) {
          var p = JSON.parse(raw);
          if (p && (p.dietCal || p.kaloriHarian)) {
            if (!p.dietCal && p.kaloriHarian) p.dietCal = p.kaloriHarian;
            state.set('kalkulator', p);
            if (normalizedWA) lsSave(normalizedWA, 'kalkulator', appState.kalkulator);
          }
        }
      } catch(e) {}
    }
    if (!appState.quiz) {
      try {
        var rawQ = localStorage.getItem('kemoenik_quiz');
        if (rawQ) {
          var pq = JSON.parse(rawQ);
          if (pq && pq.tipe) {
            state.set('quiz', pq);
            if (normalizedWA) lsSave(normalizedWA, 'quiz', pq);
          }
        }
      } catch(e) {}
    }

    if (appState.kalkulator && appState.kalkulator.nama) {
      state.set('user.nama', appState.kalkulator.nama);
      appState.user.nama = appState.kalkulator.nama;
    }

    if (normalizedWA) {
      lsSave(normalizedWA, 'profile', {
        nama: appState.user.nama || 'User',
        wa: normalizedWA,
        lastActive: new Date().toISOString()
      });
    }

    state._persist();

    if (loadingScreen) loadingScreen.style.display = 'none';
    if (app) app.style.display = 'flex';

    renderAll();
    setTimeout(renderHomeJadwal, 150);

    if (localStorage.getItem('kemoenik_just_finished_quiz') === 'true') {
      localStorage.removeItem('kemoenik_just_finished_quiz');
      setTimeout(function() {
        go('profil');
        ['acc-trait','acc-karakter','acc-skor'].forEach(function(id) {
          var el = document.getElementById(id);
          if (el) el.classList.add('on');
        });
      }, 200);
    }

  } catch(e) {
    console.error('initApp error:', e);
    showToast('Gagal memuat aplikasi. Coba refresh halaman.');
  }
}

document.addEventListener('DOMContentLoaded', function() { 
  initApp(); 
});

// NAVIGATION
function go(page) {
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('on'); });
  document.querySelectorAll('.pill').forEach(function(p){ p.classList.remove('on'); });
  document.querySelectorAll('.bn').forEach(function(b){ b.classList.remove('on'); });
  document.querySelectorAll('.d-item').forEach(function(d){ d.classList.remove('on'); });

  var pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('on');

  var bn = document.getElementById('bn-' + page);
  if (bn) bn.classList.add('on');

  var di = document.getElementById('di-' + page);
  if (di) di.classList.add('on');

  if (page === 'profil') renderProfilPage();
  if (page === 'progress') { 
    renderEvalHome(); 
    renderEvalHistory(); 
    renderProgress(); 
  }

  var content = document.getElementById('content');
  if (content) content.scrollTo({top: 0, behavior:'smooth'});
}

function openDrawer() {
  var drawer = document.getElementById('drawer');
  var overlay = document.getElementById('overlay');
  if (drawer) drawer.classList.add('on');
  if (overlay) overlay.classList.add('on');
}

function closeDrawer() {
  var drawer = document.getElementById('drawer');
  var overlay = document.getElementById('overlay');
  if (drawer) drawer.classList.remove('on');
  if (overlay) overlay.classList.remove('on');
}

function openPanel(id) {
  if (id === 'panelKalkulator') {
    var kalNotif = document.getElementById('kalNotifKuis');
    if (kalNotif) kalNotif.style.display = appState.quiz ? 'none' : 'block';
    
    var hasilVisible = document.getElementById('hasilKalkulator') && 
                       document.getElementById('hasilKalkulator').style.display !== 'none';
    if (!hasilVisible) {
      window._tempKalData = null;
      var hasilEl = document.getElementById('hasilKalkulator');
      var formEl = document.getElementById('kalkulatorForm');
      if (hasilEl) hasilEl.style.display = 'none';
      if (formEl) formEl.style.display = 'block';
      loadKalkulatorForm();
    }
  }
  
  if (id === 'panelEvaluasi') {
    var n = appState.evaluasi.length + 1;
    var weekLabel = editingEvalIdx >= 0 ? 
      'Edit Minggu ke-' + appState.evaluasi[editingEvalIdx].minggu : 
      'Evaluasi Minggu ke-' + n;
    var evalWeekDisplay = document.getElementById('evalWeekDisplay');
    if (evalWeekDisplay) evalWeekDisplay.textContent = weekLabel;
    renderEvalHistory();
  }
  
  if (id === 'panelMenu') renderMenuHarian();
  if (id === 'panelJadwalOlahraga') renderJadwalOlahraga();
  if (id === 'panelPanduanLengkap') {
    var targetKcalLengkap = document.getElementById('targetKcalLengkap');
    if (targetKcalLengkap) {
      targetKcalLengkap.textContent = appState.kalkulator ? 
        Math.round(appState.kalkulator.dietCal) : '—';
    }
  }
  
  var panel = document.getElementById(id);
  if (panel) panel.classList.add('on');
  document.body.style.overflow = 'hidden';
}

function closePanel(id) {
  var panel = document.getElementById(id);
  if (panel) panel.classList.remove('on');
  document.body.style.overflow = '';
}

function openBeli() { 
  openPanel('modalBeli'); 
}

function openFaq() { 
  go('faq'); 
}

// ACCORDION
function tog(id) {
  var el = document.getElementById(id);
  if (el) el.classList.toggle('on');
}

function togFaq(id) {
  var el = document.getElementById(id);
  if (el) el.classList.toggle('on');
}

// RENDER ALL
function renderAll() {
  renderHomeStats();
  renderHomeGreeting();
  renderProgress();
  renderEvalHome();
  renderProfilPage();
  renderJadwalOlahraga();
  renderMenuHarian();
  renderDrawer();
  renderHomeJadwal();
  renderMetScoreCard();
  syncProgressPage();

  var kuisNotif = document.getElementById('kuisFirstNotif');
  if (kuisNotif) kuisNotif.style.display = appState.quiz ? 'none' : 'flex';
}

// HOME STATS
function renderHomeStats() {
  var k = appState.kalkulator;
  var q = appState.quiz;

  var nama = k ? (k.nama || '—') : (q ? (q.nama || '—') : '—');
  var userName = document.getElementById('userName');
  var dName = document.getElementById('dName');
  if (userName) userName.textContent = nama.split(' ')[0] || '—';
  if (dName) dName.textContent = nama || '—';

  if (q) {
    var heroName = document.getElementById('heroName');
    var heroBadge = document.getElementById('heroBadge');
    var statMetode = document.getElementById('statMetode');
    if (heroName) heroName.innerHTML = escHtml(q.tipeName) + ' <span>' + escHtml(q.tipe_emoji) + '</span>';
    if (heroBadge) heroBadge.textContent = q.metode === 'agresif' ? '🔥 Agresif' : 
                                           q.metode === 'ringan' ? '🐢 Ringan' : '⚖️ Standar';
    if (statMetode) statMetode.textContent = q.metode || '—';
  }

  if (k) {
    var statKkal = document.getElementById('statKkal');
    var statMinggu = document.getElementById('statMinggu');
    var estMinggu = document.getElementById('estMinggu');
    var estTanggal = document.getElementById('estTanggal');
    var estLingkar = document.getElementById('estLingkar');
    
    if (statKkal) statKkal.textContent = k.dietCal ? Math.round(k.dietCal).toLocaleString('id') : '—';
    if (statMinggu) statMinggu.textContent = k.targetMinggu ? k.targetMinggu + 'mg' : '—';
    if (estMinggu) estMinggu.textContent = k.targetMinggu ? k.targetMinggu + ' minggu' : '—';
    if (estTanggal) estTanggal.textContent = k.estTanggal || '—';
    if (estLingkar) estLingkar.textContent = k.estLingkar ? k.estLingkar + ' cm' : '—';

    var startDisplay = k.startDateDisplay || k.startDate || '';
    if (!k.startDateDisplay && k.startDateISO) {
      try {
        var sd = new Date(k.startDateISO);
        if (!isNaN(sd)) startDisplay = sd.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'});
      } catch(e) {}
    }

    var progNama = document.getElementById('progNama');
    var progDesc = document.getElementById('progDesc');
    var piSubKalori = document.getElementById('piSubKalori');
    var piSubTimeline = document.getElementById('piSubTimeline');
    var progNotif = document.getElementById('progNotif');
    
    if (progNama) progNama.textContent = (nama || '—') + (q ? ' — ' + q.tipeName : '');
    if (progDesc) progDesc.textContent = 'Mulai: ' + (startDisplay || '—') + ' | Target: ' + (k.target || '—') + ' kg';
    if (piSubKalori) piSubKalori.textContent = k.dietCal ? 
      Math.round(k.dietCal) + ' kkal/hari • ' + k.targetMinggu + ' minggu' : 
      'Hitung kebutuhan kalori & target mingguanmu';
    if (piSubTimeline) piSubTimeline.textContent = k.startDate ? 
      'Mulai ' + (startDisplay || k.startDate) + ' → ' + k.estTanggal : 
      'Fase & jadwal program dietmu';
    if (progNotif) progNotif.style.display = 'flex';
  }

  var evalTarget = document.getElementById('evalTarget');
  if (evalTarget) evalTarget.textContent = k ? (k.target || '—') + ' kg' : '—';
}

// HOME GREETING
function renderHomeGreeting() {
  var q = appState.quiz;
  var k = appState.kalkulator;
  var nama = k ? k.nama : (q ? q.nama : '');
  var firstName = nama ? nama.split(' ')[0] : '—';
  
  var userName = document.getElementById('userName');
  if (userName) userName.textContent = firstName;

  var greetEl = document.getElementById('greetingDesc');
  var desc = 'Selamat datang di panduan diet<br><strong>KEMOENIK</strong> — hari ini kita jaga komitmenmu 💪';
  if (q) {
    desc = 'Tipe: <strong>' + escHtml(q.tipeName) + '</strong> | Metode: <strong>' + escHtml(q.metodeName) + '</strong><br>Tetap konsisten dengan program KEMOENIK kamu! 💪';
  }
  if (greetEl) setSafeHTML(greetEl, desc);

  var tips = [
    'Minum KEMOENIK sesudah makan untuk penyerapan optimal. Jangan skip meski tidak lapar!',
    'Ganti nasi putih dengan nasi merah atau ubi untuk kalori lebih rendah & serat lebih tinggi.',
    'Minum 2 gelas air putih sebelum makan — terbukti kurangi porsi makan secara alami.',
    'Olahraga 30 menit pagi hari meningkatkan metabolisme sepanjang hari. Mulai dari jalan kaki!',
    'Hindari makan setelah jam 7 malam. Beri tubuh waktu istirahat untuk proses pembakaran lemak.',
    'Konsistensi lebih penting dari kesempurnaan. Skip 1 hari tidak masalah, asal lanjut besok!',
    'Kurangi gula secara bertahap — mulai dari tidak minum teh manis dahulu.'
  ];
  var dayIdx = new Date().getDay();
  var dailyTipText = document.getElementById('dailyTipText');
  if (dailyTipText) dailyTipText.textContent = tips[dayIdx];
}

// METABOLISM SCORE CARD
function renderMetScoreCard() {
  var q = appState.quiz;
  var card = document.getElementById('metScoreCard');
  if (!card) return;
  if (!q || !q.tipe) { 
    card.style.display = 'none'; 
    return; 
  }

  card.style.display = 'block';
  
  var metScoreTipe = document.getElementById('metScoreTipe');
  var metScoreTagline = document.getElementById('metScoreTagline');
  var metScoreMetodeBadge = document.getElementById('metScoreMetodeBadge');
  var metScorePct = document.getElementById('metScorePct');
  
  if (metScoreTipe) metScoreTipe.textContent = (q.tipe_emoji || '') + ' ' + (q.tipeName || q.tipe);
  if (metScoreTagline) metScoreTagline.textContent = q.tagline || '';
  if (metScoreMetodeBadge) metScoreMetodeBadge.textContent = q.metodeName || q.metode || '';

  var skor = parseInt(q.skor) || 0;
  if (metScorePct) metScorePct.textContent = skor + '%';

  var circumference = 238.76;
  var offset = circumference - (skor / 100) * circumference;
  setTimeout(function() {
    var ring = document.getElementById('metScoreRing');
    if (ring) ring.style.strokeDashoffset = offset;
  }, 100);
}

// SYNC PROGRESS PAGE
function syncProgressPage() {
  var k = appState.kalkulator;
  var evals = appState.evaluasi || [];

  if (k && k.startDate) {
    var isoStr = k.startDateISO || k.startDate;
    var startDate = new Date(isoStr);
    var today = new Date();
    if (isNaN(startDate)) startDate = today;
    var totalHari = (k.targetMinggu || 4) * 7;
    var hariKe = Math.max(1, Math.min(Math.floor((today - startDate) / 86400000) + 1, totalHari));
    var pct = Math.round((hariKe / totalHari) * 100);
    
    var progHari2 = document.getElementById('progHari2');
    var progTotal2 = document.getElementById('progTotal2');
    var progTotalLabel2 = document.getElementById('progTotalLabel2');
    var progPct2 = document.getElementById('progPct2');
    var progFill2 = document.getElementById('progFill2');
    var progThumb2 = document.getElementById('progThumb2');
    
    if (progHari2) progHari2.textContent = hariKe;
    if (progTotal2) progTotal2.textContent = totalHari;
    if (progTotalLabel2) progTotalLabel2.textContent = totalHari;
    if (progPct2) progPct2.textContent = pct + '%';
    
    setTimeout(function() {
      if (progFill2) progFill2.style.width = pct + '%';
      if (progThumb2) progThumb2.style.left = pct + '%';
    }, 100);
  }

  var evalTarget2 = document.getElementById('evalTarget2');
  if (evalTarget2 && k) evalTarget2.textContent = (k.target || '—') + ' kg';
  
  if (evals.length > 0) {
    var last = evals[evals.length - 1];
    var total = evals.reduce(function(s, e) { return s + (e.turun || 0); }, 0);
    
    var evalMingguLabel2 = document.getElementById('evalMingguLabel2');
    var evalPenurunan2 = document.getElementById('evalPenurunan2');
    var evalBerat2 = document.getElementById('evalBerat2');
    
    if (evalMingguLabel2) evalMingguLabel2.textContent = 'Minggu ' + evals.length;
    if (evalPenurunan2) evalPenurunan2.textContent = '-' + total.toFixed(1) + ' kg';
    if (evalBerat2) evalBerat2.textContent = (last.beratAkhir || '—') + ' kg';
  }

  var wrap = document.getElementById('evalHistoryWrap2');
  if (!wrap) return;
  if (!evals.length) {
    wrap.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r-md);padding:40px 20px;text-align:center;"><div style="font-size:32px;margin-bottom:10px;">📊</div><div style="font-size:13px;color:var(--text3);">Belum ada evaluasi. Tambah data mingguanmu!</div></div>';
    return;
  }
  var html = '';
  evals.slice().reverse().forEach(function(e) {
    html += '<div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r-md);padding:14px 16px;margin-bottom:8px;display:flex;align-items:center;gap:12px;box-shadow:var(--shadow-sm);">';
    html += '<div style="width:42px;height:42px;border-radius:12px;background:rgba(46,125,91,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:var(--font-display);font-size:15px;font-weight:700;color:var(--green);">' + (e.minggu || '?') + '</div>';
    html += '<div style="flex:1;">';
    html += '<div style="font-size:13px;font-weight:700;color:var(--text);">Minggu ke-' + (e.minggu || '?') + '</div>';
    html += '<div style="font-size:11px;color:var(--text3);margin-top:2px;">' + (e.tanggal || '') + ' · ' + (e.beratAwal || '—') + ' → ' + (e.beratAkhir || '—') + ' kg</div>';
    html += '</div>';
    html += '<div style="text-align:right;flex-shrink:0;">';
    html += '<div style="font-family:var(--font-display);font-size:17px;font-weight:700;color:' + (e.turun > 0 ? 'var(--green)' : 'var(--text3)') + ';">-' + (e.turun || 0).toFixed(1) + ' kg</div>';
    html += '<div style="font-size:10px;color:var(--text3);">penurunan</div>';
    html += '</div></div>';
  });
  wrap.innerHTML = html;
}

// PROGRESS BAR
function renderProgress() {
  var k = appState.kalkulator;
  if (!k || (!k.startDate && !k.startDateISO)) {
    var progHari = document.getElementById('progHari');
    var progTotal = document.getElementById('progTotal');
    var progPct = document.getElementById('progPct');
    var progTotalLabel = document.getElementById('progTotalLabel');
    if (progHari) progHari.textContent = '—';
    if (progTotal) progTotal.textContent = '—';
    if (progPct) progPct.textContent = '—%';
    if (progTotalLabel) progTotalLabel.textContent = '—';
    return;
  }

  var start = null;
  var isoStr = k.startDateISO || k.startDate || '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoStr)) {
    start = new Date(isoStr + 'T00:00:00');
  }
  if (!start || isNaN(start.getTime())) {
    var dateStr = k.startDate || '';
    var parts = dateStr.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
    if (parts) {
      var monthMap = {
        jan:0, feb:1, mar:2, apr:3, mei:4, jun:5,
        jul:6, agu:7, sep:8, okt:9, nov:10, des:11,
        januari:0, februari:1, maret:2, april:3, juni:5,
        juli:6, agustus:7, september:8, oktober:9, november:10, desember:11,
        may:4, aug:7, oct:9, dec:11
      };
      var mKey = parts[2].toLowerCase();
      if (monthMap[mKey] !== undefined) {
        start = new Date(parseInt(parts[3]), monthMap[mKey], parseInt(parts[1]));
      }
    }
  }
  if (!start || isNaN(start.getTime())) {
    start = new Date(k.startDate || k.startDateISO || '');
  }
  if (!start || isNaN(start.getTime())) {
    start = new Date();
  }

  var today = new Date();
  var startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  var todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  var totalHari = (k.targetMinggu || 4) * 7;
  var hariKe = Math.max(1, Math.floor((todayDay - startDay) / (1000*60*60*24)) + 1);
  hariKe = Math.min(hariKe, totalHari);
  var pct = totalHari > 0 ? Math.round((hariKe / totalHari) * 100) : 0;

  var progHari = document.getElementById('progHari');
  var progTotal = document.getElementById('progTotal');
  var progPct = document.getElementById('progPct');
  var progTotalLabel = document.getElementById('progTotalLabel');
  
  if (progHari) progHari.textContent = hariKe;
  if (progTotal) progTotal.textContent = totalHari;
  if (progPct) progPct.textContent = pct + '%';
  if (progTotalLabel) progTotalLabel.textContent = totalHari;

  var fill = document.getElementById('progFill');
  var thumb = document.getElementById('progThumb');
  if (fill && thumb) {
    fill.style.transition = 'none';
    thumb.style.transition = 'none';
    fill.style.width = '0%';
    thumb.style.left = '0%';
    void fill.offsetWidth;
    fill.style.transition = '';
    thumb.style.transition = '';
    setTimeout(function() {
      fill.style.width = pct + '%';
      thumb.style.left = pct + '%';
    }, 50);
  }

  var displayStart = k.startDateDisplay || k.startDate || '—';
  if (!k.startDateDisplay && k.startDateISO) {
    try {
      var sdT = new Date(k.startDateISO);
      if (!isNaN(sdT)) displayStart = sdT.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'});
    } catch(e) {}
  }
  
  var timelineStartDate = document.getElementById('timelineStartDate');
  var timelineEndDate = document.getElementById('timelineEndDate');
  if (timelineStartDate) timelineStartDate.textContent = displayStart;
  if (timelineEndDate) timelineEndDate.textContent = k.estTanggal || '—';
}

// EVAL HOME
function renderEvalHome() {
  var evals = appState.evaluasi;
  var evalMingguLabel = document.getElementById('evalMingguLabel');
  var evalPenurunan = document.getElementById('evalPenurunan');
  var evalBerat = document.getElementById('evalBerat');
  
  if (!evals || !evals.length) {
    if (evalMingguLabel) evalMingguLabel.textContent = '—';
    if (evalPenurunan) evalPenurunan.textContent = '— kg';
    if (evalBerat) evalBerat.textContent = '— kg';
    return;
  }

  var totalTurun = 0;
  evals.forEach(function(e){ totalTurun += (e.turun || 0); });
  var last = evals[evals.length - 1];

  if (evalMingguLabel) evalMingguLabel.textContent = 'Minggu ' + (evals.length);
  if (evalPenurunan) evalPenurunan.textContent = '-' + totalTurun.toFixed(1) + ' kg';
  if (evalBerat) evalBerat.textContent = last.beratAkhir ? last.beratAkhir + ' kg' : '— kg';

  renderEvalHistory();
}

// TRAIT DATA BY TYPE
var traitDataByType = {
  1: [
    { name:'Respons terhadap Karbohidrat', badge:'Sensitif Tinggi', badgeClass:'badge-tinggi', pct:85, labels:['Rendah','Normal','Tinggi'], desc:'Tubuhmu bereaksi kuat terhadap asupan karbohidrat. Batasi karbohidrat sederhana & ganti dengan yang kompleks.' },
    { name:'Kemampuan Bakar Lemak', badge:'Normal', badgeClass:'badge-optimal', pct:50, labels:['Rendah','Normal','Tinggi'], desc:'Kemampuan bakar lemak dalam batas normal. Defisit kalori konsisten akan memberikan hasil optimal.' },
    { name:'Efisiensi Metabolisme Basal', badge:'Di Atas Rata-rata', badgeClass:'badge-optimal', pct:65, labels:['Rendah','Normal','Tinggi'], desc:'Metabolisme basalmu cukup efisien. Ini membantumu membakar kalori lebih banyak saat istirahat.' },
    { name:'Toleransi Puasa', badge:'Rendah', badgeClass:'badge-perlu', pct:30, labels:['Rendah','Normal','Tinggi'], desc:'Kamu cenderung kurang toleran terhadap puasa panjang. IF tidak direkomendasikan untuk tipe ini.' },
    { name:'Sensitivitas Stres vs BB', badge:'Sedang', badgeClass:'badge-perlu', pct:50, labels:['Rendah','Sedang','Tinggi'], desc:'Stres cukup berpengaruh terhadap berat badanmu. Kelola stres dengan olahraga ringan & tidur cukup.' }
  ],
  2: [
    { name:'Kemampuan Bakar Lemak', badge:'Perlu Perhatian', badgeClass:'badge-perlu', pct:72, labels:['Rendah','Normal','Tinggi'], desc:'Tubuhmu cenderung lebih lambat membakar lemak. Atasi dengan defisit kalori konsisten + IF 16:8.' },
    { name:'Respons terhadap Karbohidrat', badge:'Normal', badgeClass:'badge-optimal', pct:45, labels:['Sensitif','Normal','Toleran'], desc:'Respons gula darahmu terhadap karbohidrat masih normal. Tetap batasi karbohidrat sederhana.' },
    { name:'Efisiensi Metabolisme Basal', badge:'Di Bawah Rata-rata', badgeClass:'badge-perlu', pct:30, labels:['Rendah','Normal','Tinggi'], desc:'Metabolisme basalmu lebih hemat energi — membakar lebih sedikit kalori saat istirahat.' },
    { name:'Respons terhadap Kardio', badge:'Kurang Optimal', badgeClass:'badge-tinggi', pct:78, labels:['Kurang','Cukup','Baik'], desc:'Kardio saja tidak cukup efektif. Kombinasikan dengan latihan kekuatan untuk hasil lebih optimal.' },
    { name:'Toleransi Puasa', badge:'Baik', badgeClass:'badge-optimal', pct:25, labels:['Rendah','Normal','Tinggi'], desc:'Tubuhmu cukup toleran terhadap puasa. IF 16:8 sangat cocok dan efektif untukmu!' }
  ],
  3: [
    { name:'Kemampuan Bakar Lemak', badge:'Baik', badgeClass:'badge-optimal', pct:60, labels:['Rendah','Normal','Tinggi'], desc:'Kemampuan membakar lemakmu cukup baik, terutama saat dikombinasikan dengan latihan kekuatan.' },
    { name:'Metabolisme Protein', badge:'Tinggi', badgeClass:'badge-optimal', pct:80, labels:['Rendah','Normal','Tinggi'], desc:'Tubuhmu efisien menggunakan protein untuk membangun & mempertahankan otot.' },
    { name:'Respons terhadap Olahraga', badge:'Sangat Baik', badgeClass:'badge-optimal', pct:20, labels:['Kurang','Cukup','Baik'], desc:'Tubuhmu merespons sangat baik terhadap latihan fisik — ini keunggulan besar!' },
    { name:'Toleransi Kalori Rendah', badge:'Perlu Perhatian', badgeClass:'badge-perlu', pct:65, labels:['Toleran','Sedang','Sensitif'], desc:'Diet terlalu rendah kalori bisa merusak ototmu. Jangan potong kalori terlalu drastis.' },
    { name:'Efisiensi Metabolisme Basal', badge:'Tinggi', badgeClass:'badge-optimal', pct:25, labels:['Rendah','Normal','Tinggi'], desc:'Metabolisme basalmu efisien dan tinggi — kamu membakar lebih banyak kalori bahkan saat istirahat.' }
  ],
  4: [
    { name:'Kecepatan Metabolisme', badge:'Lambat', badgeClass:'badge-tinggi', pct:80, labels:['Cepat','Normal','Lambat'], desc:'Metabolismemu bekerja lebih pelan. Jangan potong kalori drastis — defisit kecil lebih efektif.' },
    { name:'Kemampuan Bakar Lemak', badge:'Rendah', badgeClass:'badge-perlu', pct:70, labels:['Rendah','Normal','Tinggi'], desc:'Pembakaran lemak butuh lebih banyak waktu. Konsistensi jangka panjang adalah kuncinya.' },
    { name:'Toleransi Aktivitas Fisik', badge:'Sedang', badgeClass:'badge-perlu', pct:55, labels:['Rendah','Sedang','Tinggi'], desc:'Tingkatkan aktivitas fisik secara bertahap — jalan kaki, naik tangga, hindari lift.' },
    { name:'Respons terhadap Perubahan', badge:'Butuh Waktu', badgeClass:'badge-perlu', pct:72, labels:['Cepat','Sedang','Lambat'], desc:'Tubuhmu butuh lebih banyak waktu untuk beradaptasi. Sabar dan tetap konsisten!' },
    { name:'Sensitivitas Stres vs BB', badge:'Sedang', badgeClass:'badge-perlu', pct:55, labels:['Rendah','Sedang','Tinggi'], desc:'Stres cukup berpengaruh. Prioritaskan tidur 7–8 jam dan kelola stres dengan baik.' }
  ],
  5: [
    { name:'Pengaruh Stres terhadap BB', badge:'Tinggi', badgeClass:'badge-tinggi', pct:82, labels:['Rendah','Sedang','Tinggi'], desc:'Stres sangat mempengaruhi berat badanmu. Prioritaskan manajemen stres & tidur berkualitas.' },
    { name:'Pola Tidur', badge:'Perlu Perhatian', badgeClass:'badge-perlu', pct:70, labels:['Baik','Sedang','Buruk'], desc:'Kurang tidur meningkatkan hormon lapar & menurunkan metabolisme. Targetkan 7–8 jam/malam.' },
    { name:'Makan Emosional', badge:'Perlu Diwaspadai', badgeClass:'badge-perlu', pct:75, labels:['Rendah','Sedang','Tinggi'], desc:'Kamu cenderung makan saat emosi. Kenali triggernya dan cari alternatif — olahraga, meditasi.' },
    { name:'Konsistensi Rutinitas', badge:'Perlu Ditingkatkan', badgeClass:'badge-tinggi', pct:65, labels:['Konsisten','Sedang','Tidak Konsisten'], desc:'Rutinitas yang tidak konsisten menghambat program diet. Buat jadwal makan & minum KEMOENIK tetap.' },
    { name:'Kemampuan Bakar Lemak', badge:'Normal', badgeClass:'badge-optimal', pct:45, labels:['Rendah','Normal','Tinggi'], desc:'Kemampuan bakar lemakmu normal. Dengan perbaikan gaya hidup, hasilnya akan meningkat signifikan.' }
  ],
  6: [
    { name:'Kesehatan Pencernaan', badge:'Perlu Perhatian', badgeClass:'badge-tinggi', pct:75, labels:['Baik','Sedang','Sensitif'], desc:'Sistem pencernaanmu sensitif. Hindari makanan pemicu: susu, gluten, gorengan, makanan pedas.' },
    { name:'Kemampuan Bakar Lemak', badge:'Normal', badgeClass:'badge-optimal', pct:50, labels:['Rendah','Normal','Tinggi'], desc:'Kemampuan bakar lemak normal, namun masalah pencernaan sering menghambat proses diet.' },
    { name:'Respons terhadap Lemak', badge:'Sensitif', badgeClass:'badge-perlu', pct:70, labels:['Toleran','Normal','Sensitif'], desc:'Makanan berlemak tinggi memicu ketidaknyamanan pencernaan. Fokus pada lemak sehat & porsi kecil.' },
    { name:'Keberagaman Bakteri Usus', badge:'Perlu Ditingkatkan', badgeClass:'badge-perlu', pct:60, labels:['Baik','Sedang','Kurang'], desc:'Tambahkan probiotik: yogurt, tempe, kimchi untuk kesehatan usus yang lebih baik.' },
    { name:'Toleransi Puasa', badge:'Rendah', badgeClass:'badge-tinggi', pct:75, labels:['Tinggi','Sedang','Rendah'], desc:'IF tidak direkomendasikan untuk tipe perutmu yang sensitif. Makan teratur lebih disarankan.' }
  ],
  7: [
    { name:'Kemampuan Bakar Lemak', badge:'Baik', badgeClass:'badge-optimal', pct:35, labels:['Rendah','Normal','Tinggi'], desc:'Kemampuan bakar lemakmu baik. Pertahankan dengan defisit kalori konsisten.' },
    { name:'Respons terhadap Karbohidrat', badge:'Normal', badgeClass:'badge-optimal', pct:50, labels:['Sensitif','Normal','Toleran'], desc:'Respons karbohidratmu seimbang. Tetap variasikan antara karbohidrat kompleks dan sederhana.' },
    { name:'Efisiensi Metabolisme Basal', badge:'Normal', badgeClass:'badge-optimal', pct:50, labels:['Rendah','Normal','Tinggi'], desc:'Metabolisme basalmu dalam kondisi optimal. Pertahankan pola makan sehat & olahraga rutin.' },
    { name:'Toleransi Olahraga', badge:'Baik', badgeClass:'badge-optimal', pct:25, labels:['Rendah','Sedang','Tinggi'], desc:'Tubuhmu merespons baik terhadap berbagai jenis olahraga. Variasikan kardio + latihan kekuatan.' },
    { name:'Konsistensi', badge:'Kunci Utama', badgeClass:'badge-optimal', pct:50, labels:['Rendah','Sedang','Tinggi'], desc:'Metabolismemu sudah baik — kunci keberhasilanmu adalah KONSISTENSI dalam menjalankan program.' }
  ]
};

// RENDER PROFIL PAGE
function renderProfilPage() {
  var q = appState.quiz;
  var belumKuis = document.getElementById('profilBelumKuis');
  var profilContent = document.getElementById('profilContent');
  
  if (!q) {
    if (belumKuis) belumKuis.style.display = 'block';
    if (profilContent) profilContent.style.display = 'none';
    return;
  }
  if (belumKuis) belumKuis.style.display = 'none';
  if (profilContent) profilContent.style.display = 'block';

  var tipeId = q.tipe || 2;
  var traits = traitDataByType[tipeId] || traitDataByType[2];

  // Trait bars
  var traitHtml = '';
  traits.forEach(function(t) {
    traitHtml += '<div class="trait-card">';
    traitHtml += '<div class="trait-top"><div class="trait-name">' + t.name + '</div><div class="trait-badge ' + t.badgeClass + '">' + t.badge + '</div></div>';
    traitHtml += `<div class="trait-bar-bg"><div class="trait-bar-marker" style="left:${t.pct}%"></div></div>`;
    traitHtml += '<div class="trait-labels">' + t.labels.map(function(l){ return '<span>' + l + '</span>'; }).join('') + '</div>';
    traitHtml += '<div class="trait-desc">' + t.desc + '</div>';
    traitHtml += '</div>';
  });
  
  var traitBarContent = document.getElementById('traitBarContent');
  var traitBarSub = document.getElementById('traitBarSub');
  if (traitBarContent) setSafeHTML(traitBarContent, traitHtml);
  if (traitBarSub) traitBarSub.textContent = q.tipeName + ' — ' + traits.length + ' karakteristik';

  // Tipe & Karakteristik
  var tipe = quizTypes.find(function(t){ return t.id === tipeId; }) || quizTypes[1];
  var karHtml = '<div style="background:' + tipe.bg + ';border-radius:14px;padding:16px;margin-bottom:14px;">';
  karHtml += '<div style="font-size:24px;margin-bottom:8px;">' + tipe.emoji + '</div>';
  karHtml += '<div style="font-size:16px;font-weight:800;color:' + tipe.textColor + ';margin-bottom:4px;">' + tipe.name + '</div>';
  karHtml += '<div style="font-size:12px;color:' + tipe.textColor + ';opacity:0.85;line-height:1.6;">' + tipe.tagline + '</div>';
  karHtml += '</div>';
  karHtml += '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Karakteristik Utama</div>';
  tipe.tips.forEach(function(tip) {
    karHtml += '<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;">';
    karHtml += '<div style="color:var(--green);font-size:12px;margin-top:2px;">✓</div>';
    karHtml += '<div style="font-size:12px;color:var(--text3);line-height:1.6;">' + tip + '</div>';
    karHtml += '</div>';
  });
  karHtml += '<div style="margin-top:12px;display:flex;flex-direction:column;gap:6px;">';
  karHtml += '<div style="background:#FEE2E2;border-radius:8px;padding:8px 12px;font-size:12px;color:#991B1B;"><strong>Hindari:</strong> ' + tipe.hindari + '</div>';
  karHtml += '<div style="background:#DCFCE7;border-radius:8px;padding:8px 12px;font-size:12px;color:#065F46;"><strong>Anjurkan:</strong> ' + tipe.anjuran + '</div>';
  karHtml += '</div>';
  
  var tipeKarakterContent = document.getElementById('tipeKarakterContent');
  var tipeKarakterSub = document.getElementById('tipeKarakterSub');
  if (tipeKarakterContent) setSafeHTML(tipeKarakterContent, karHtml);
  if (tipeKarakterSub) tipeKarakterSub.textContent = tipe.name;

  // Skor
  var skor = q.skor || 72;
  var scorePct = document.getElementById('scorePct');
  var scoreDesc = document.getElementById('scoreDesc');
  if (scorePct) scorePct.textContent = skor + '%';
  if (scoreDesc) scoreDesc.textContent = 'Program KEMOENIK dengan metode ' + (q.metodeName || q.metode) + ' memiliki kesesuaian ' + skor + '% dengan profil metabolismemu. Semakin konsisten, semakin tinggi efektivitasnya!';

  // Auto-expand accordion
  ['acc-trait', 'acc-karakter', 'acc-skor'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el && !el.classList.contains('on')) el.classList.add('on');
  });
  
  setTimeout(animScore, 100);
}

function animScore() {
  var q = appState.quiz;
  var skor = q ? (q.skor || 72) : 72;
  var circumference = 326;
  var offset = circumference - (skor / 100 * circumference);
  var srFill = document.getElementById('srFill');
  if (srFill) srFill.style.strokeDashoffset = offset;
}

// RENDER JADWAL OLAHRAGA
function renderJadwalOlahraga() {
  var metode = appState.quiz ? appState.quiz.metode : 'standar';
  var data = targetOlahragaData[metode] || targetOlahragaData.standar;
  var html = '';
  data.forEach(function(d) {
    var isRest = d.aktivitas.indexOf('Istirahat') !== -1 || d.aktivitas.indexOf('recovery') !== -1;
    html += '<div class="jadwal-item">';
    html += '<div class="jadwal-time" style="color:' + (isRest ? 'var(--text3)' : 'var(--green)') + ';">' + d.hari + '</div>';
    html += '<div class="jadwal-content"><div class="jadwal-title" style="color:' + (isRest ? 'var(--text3)' : 'var(--text)') + ';">' + d.aktivitas + '</div></div>';
    if (!isRest) html += '<div style="font-size:16px;">💪</div>';
    html += '</div>';
  });
  
  var jadwalNormalList = document.getElementById('jadwalNormalList');
  if (jadwalNormalList) setSafeHTML(jadwalNormalList, html);
}

// RENDER HOME JADWAL
function renderHomeJadwal() {
  var el = document.getElementById('homeJadwalContent');
  if (!el) { 
    console.warn('homeJadwalContent not found'); 
    return; 
  }
  if (!targetOlahragaData || !targetOlahragaData.standar) {
    setTimeout(renderHomeJadwal, 200);
    return;
  }
  
  try {
    var metode = (appState.quiz && appState.quiz.metode) ? appState.quiz.metode : 'standar';
    var jadwal = targetOlahragaData[metode] || targetOlahragaData['standar'];
    var hariIdx = new Date().getDay();
    var hariMap = [6, 0, 1, 2, 3, 4, 5];
    var todayData = jadwal[hariMap[hariIdx]] || jadwal[0];
    var hariNames = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    var hariName = hariNames[hariIdx];
    var akt = todayData.aktivitas || '';
    var isRest = akt.indexOf('Istirahat') !== -1 || akt.indexOf('recovery') !== -1;
    var metodeName = 'Metode ' + metode.charAt(0).toUpperCase() + metode.slice(1);

    var html = '<div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--shadow-sm);">';
    html += '<div style="display:flex;align-items:center;gap:12px;padding:16px 16px 12px;">';
    html += '<div style="width:48px;height:48px;border-radius:14px;background:' + (isRest ? 'var(--card2)' : 'linear-gradient(135deg,var(--green),var(--green3))') + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;">';
    if (isRest) {
      html += '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round"><path d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>';
    } else {
      html += '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v8"/><path d="M8 12l4 3 4-3"/><path d="M8 19l-2 3M16 19l2 3"/></svg>';
    }
    html += '</div>';
    html += '<div>';
    html += '<div style="font-size:15px;font-weight:800;color:var(--text);">' + hariName + ' — ' + (isRest ? 'Hari Istirahat' : 'Olahraga Hari Ini') + '</div>';
    html += '<div style="font-size:12px;color:var(--text3);margin-top:2px;">' + metodeName + '</div>';
    html += '</div></div>';
    html += '<div style="margin:0 16px 14px;background:var(--offwhite);border-radius:12px;padding:14px 16px;">';
    html += '<div style="font-size:14px;font-weight:' + (isRest ? '500' : '700') + ';color:' + (isRest ? 'var(--text2)' : 'var(--text)') + ';margin-bottom:' + (isRest ? '8px' : '0') + ';">' + akt + '</div>';
    if (isRest) {
      html += '<div style="font-size:12px;color:var(--text3);line-height:1.6;">Istirahat optimal untuk pemulihan. Cukup lymphatic drainage ringan malam ini.</div>';
    }
    html += '</div>';
    html += '<div style="padding:0 16px 16px;">';
    html += `<button onclick="openPanel('panelJadwalOlahraga')" style="width:100%;padding:13px;background:var(--green);color:white;border:none;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;">`;
    html += '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
    html += 'Jadwal Lengkap Seminggu</button>';
    html += '</div></div>';

    setSafeHTML(el, html);
  } catch(err) {
    console.log('renderHomeJadwal err:', err);
    el.textContent = 'Ketuk untuk lihat jadwal olahraga minggu ini';
  }
}

// TOGGLE OLAHRAGA MODE
function toggleOlahraga(mode) {
  var isIF = mode === 'if';
  var jadwalNormalWrap = document.getElementById('jadwalNormalWrap');
  var jadwalIFWrap = document.getElementById('jadwalIFWrap');
  var olahragaNormalBtn = document.getElementById('olahragaNormalBtn');
  var olahragaIFBtn = document.getElementById('olahragaIFBtn');
  var rekBox = document.getElementById('rekomendasiBox');
  var rekText = document.getElementById('rekomendasiText');
  
  if (jadwalNormalWrap) jadwalNormalWrap.style.display = isIF ? 'none' : 'block';
  if (jadwalIFWrap) jadwalIFWrap.style.display = isIF ? 'block' : 'none';
  
  if (olahragaNormalBtn) {
    olahragaNormalBtn.style.background = isIF ? 'var(--white)' : 'var(--green)';
    olahragaNormalBtn.style.color = isIF ? 'var(--text3)' : '#FFF';
    olahragaNormalBtn.style.border = isIF ? '2px solid var(--border)' : '2px solid var(--green)';
  }
  if (olahragaIFBtn) {
    olahragaIFBtn.style.background = isIF ? '#F5F3FF' : 'var(--white)';
    olahragaIFBtn.style.color = isIF ? '#7C3AED' : 'var(--text3)';
    olahragaIFBtn.style.border = isIF ? '2px solid #DDD6FE' : '2px solid var(--border)';
  }
  
  if (rekBox && rekText) {
    if (isIF) {
      rekBox.style.background = '#F5F3FF'; 
      rekBox.style.borderColor = '#DDD6FE'; 
      rekBox.style.color = '#4C1D95';
      rekText.innerHTML = 'Kamu memilih <strong>IF 16:8</strong> — kombinasi puasa + defisit kalori akan mempercepat hasil. Pastikan tubuh sudah siap!';
    } else {
      rekBox.style.background = '#F0FDF4'; 
      rekBox.style.borderColor = '#86EFAC'; 
      rekBox.style.color = '#065F46';
      rekText.innerHTML = 'Sistem merekomendasikan: <strong>Normal</strong> — defisit kalori + olahraga rutin sudah cukup efektif tanpa perlu puasa.';
    }
  }
}

// RENDER MENU HARIAN
function renderMenuHarian() {
  var k = appState.kalkulator;
  var totalCal = k ? Math.round(k.dietCal) : 1450;
  var mealTargetDisplay = document.getElementById('mealTargetDisplay');
  if (mealTargetDisplay) mealTargetDisplay.textContent = totalCal;

  var html = '';
  menuHarianData.forEach(function(m) {
    html += '<div class="meal-card">';
    html += '<div class="meal-time-box"><div class="meal-time-label">WIB</div><div class="meal-time-value">' + m.time + '</div></div>';
    html += '<div class="meal-content">';
    html += '<div class="meal-title">' + m.icon + ' ' + m.label + '</div>';
    html += '<div class="meal-desc">' + m.menu + '</div>';
    html += '</div>';
    html += '<div class="meal-cal">~' + m.cal + ' kkal</div>';
    html += '</div>';
  });
  
  var menuHariIni = document.getElementById('menuHariIni');
  if (menuHariIni) setSafeHTML(menuHariIni, html);
}

// SWITCH MENU TAB
function switchMenuTab(tab, btn) {
  ['ekonomis','standar','premium','custom'].forEach(function(t){
    var el = document.getElementById('tabMenu' + t.charAt(0).toUpperCase() + t.slice(1));
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('.menu-tab-btn').forEach(function(b){ b.classList.remove('on'); });
  if (btn) btn.classList.add('on');

  if (tab === 'custom') renderCmFoodGrid();
}

// CUSTOM MENU FUNCTIONS
var cmSelectedItems = [];
var cmTargetCalories = 1450;
var cmCurrentCategory = 'all';

function cmSetTarget(val) {
  cmTargetCalories = parseInt(val) || 1450;
  var cmCurrentTarget = document.getElementById('cmCurrentTarget');
  var cmDisplayTarget = document.getElementById('cmDisplayTarget');
  if (cmCurrentTarget) cmCurrentTarget.textContent = cmTargetCalories + ' kcal';
  if (cmDisplayTarget) cmDisplayTarget.textContent = cmTargetCalories;
  cmUpdateSummary();
}

function cmFilterCat(cat, btn) {
  cmCurrentCategory = cat;
  document.querySelectorAll('#cmCatFilter button').forEach(function(b){
    b.style.background = 'var(--white)'; 
    b.style.color = 'var(--text3)'; 
    b.style.border = '1px solid var(--border)';
  });
  if (btn) { 
    btn.style.background = 'var(--green)'; 
    btn.style.color = '#FFF'; 
    btn.style.border = '1px solid var(--green)'; 
  }
  renderCmFoodGrid();
}

function renderCmFoodGrid() {
  var k = appState.kalkulator;
  if (k && k.dietCal) { 
    cmTargetCalories = Math.round(k.dietCal); 
    var cmTargetCal = document.getElementById('cmTargetCal');
    var cmCurrentTarget = document.getElementById('cmCurrentTarget');
    var cmDisplayTarget = document.getElementById('cmDisplayTarget');
    if (cmTargetCal) cmTargetCal.value = cmTargetCalories;
    if (cmCurrentTarget) cmCurrentTarget.textContent = cmTargetCalories + ' kcal';
    if (cmDisplayTarget) cmDisplayTarget.textContent = cmTargetCalories;
  }
  
  var foods = cmCurrentCategory === 'all' ? cmFoodDatabase : 
    cmFoodDatabase.filter(function(f){ return f.category === cmCurrentCategory; });
  var html = '';
  foods.forEach(function(f) {
    var isSel = cmSelectedItems.find(function(s){ return s.id === f.id; });
    html += `<div class="cm-food-item${isSel ? ' cm-selected' : ''}" onclick="cmToggleFood(${f.id})">`;
    html += '<div class="cm-check">✓</div>';
    html += '<div class="cm-name">' + f.name + '</div>';
    html += '<div class="cm-cal">' + f.baseCal + ' kkal/' + f.baseAmount + ' ' + f.unit + '</div>';
    html += '</div>';
  });
  
  var cmFoodGrid = document.getElementById('cmFoodGrid');
  if (cmFoodGrid) setSafeHTML(cmFoodGrid, html);
}

function cmToggleFood(id) {
  var food = cmFoodDatabase.find(function(f){ return f.id === id; });
  var idx = cmSelectedItems.findIndex(function(s){ return s.id === id; });
  if (idx >= 0) { 
    cmSelectedItems.splice(idx, 1); 
  } else { 
    cmSelectedItems.push({ 
      id: food.id, 
      name: food.name, 
      cal: food.baseCal, 
      amount: food.baseAmount, 
      unit: food.unit, 
      baseCal: food.baseCal, 
      baseAmount: food.baseAmount 
    }); 
  }
  renderCmFoodGrid();
  cmUpdateSummary();
}

function cmUpdateSummary() {
  var total = cmSelectedItems.reduce(function(sum, item){ 
    return sum + (item.baseAmount > 0 ? Math.round(item.cal * item.amount / item.baseAmount) : 0); 
  }, 0);
  var pct = cmTargetCalories > 0 ? Math.min(100, Math.round(total / cmTargetCalories * 100)) : 0;
  var remaining = cmTargetCalories - total;
  
  var cmDisplayUsed = document.getElementById('cmDisplayUsed');
  var cmProgressBar = document.getElementById('cmProgressBar');
  var cmStatus = document.getElementById('cmStatus');
  
  if (cmDisplayUsed) cmDisplayUsed.textContent = total;
  if (cmProgressBar) cmProgressBar.style.width = pct + '%';
  
  if (cmStatus) {
    if (total > cmTargetCalories * 1.05) { 
      cmStatus.textContent = '⚠️ Melebihi target! Kurangi porsi'; 
      cmStatus.style.background = 'rgba(239,68,68,0.3)'; 
    } else if (total >= cmTargetCalories * 0.9) { 
      cmStatus.textContent = '✅ Kalori pas! Diet terjaga'; 
      cmStatus.style.background = 'rgba(46,204,113,0.3)'; 
    } else { 
      cmStatus.textContent = '📊 Sisa ' + remaining + ' kkal lagi'; 
      cmStatus.style.background = 'rgba(255,255,255,0.2)'; 
    }
  }
}

function cmReset() {
  cmSelectedItems = [];
  renderCmFoodGrid();
  cmUpdateSummary();
}

// KALKULATOR FUNCTIONS
function hitungKalkulator() {
  var inputNama = document.getElementById('inputNama');
  var inputGender = document.getElementById('inputGender');
  var inputUsia = document.getElementById('inputUsia');
  var inputBerat = document.getElementById('inputBerat');
  var inputTinggi = document.getElementById('inputTinggi');
  var inputAktivitas = document.getElementById('inputAktivitas');
  var inputTarget = document.getElementById('inputTarget');
  var inputMetode = document.getElementById('inputMetode');

  var nama = inputNama ? inputNama.value.trim() : '';
  var gender = inputGender ? inputGender.value : 'perempuan';
  var usia = parseFloat(inputUsia ? inputUsia.value : 0) || 0;
  var berat = parseFloat(inputBerat ? inputBerat.value : 0) || 0;
  var tinggi = parseFloat(inputTinggi ? inputTinggi.value : 0) || 0;
  var aktivitas = parseFloat(inputAktivitas ? inputAktivitas.value : 0) || 0;
  var target = parseFloat(inputTarget ? inputTarget.value : 0) || 0;
  var metode = inputMetode ? inputMetode.value : 'standar';

  if (!nama || usia < 10 || berat < 30 || tinggi < 100 || target < 30 || !aktivitas) {
    showToast('Lengkapi semua data ya kak! Pastikan level aktivitas sudah dipilih 😊');
    return;
  }
  if (target >= berat) {
    showToast('Target BB harus lebih kecil dari berat badan saat ini ya kak!');
    return;
  }

  // Hitung BMR (Mifflin-St Jeor)
  var bmr;
  if (gender === 'laki') {
    bmr = 10 * berat + 6.25 * tinggi - 5 * usia + 5;
  } else {
    bmr = 10 * berat + 6.25 * tinggi - 5 * usia - 161;
  }
  var tdee = Math.round(bmr * aktivitas);

  // Defisit berdasarkan metode
  var defisit = metode === 'ringan' ? 300 : metode === 'agresif' ? 700 : 500;
  var dietCal = Math.round(tdee - defisit);
  var penurunanPerMinggu = metode === 'ringan' ? 0.3 : metode === 'agresif' ? 0.7 : 0.5;
  var selisihBB = berat - target;
  var targetMinggu = (penurunanPerMinggu > 0 && selisihBB > 0) ? Math.ceil(selisihBB / penurunanPerMinggu) : 4;

  // Estimasi tanggal
  var today = new Date();
  var estDate = new Date(today.getTime() + targetMinggu * 7 * 24 * 60 * 60 * 1000);
  var estTanggal = estDate.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'});

  // Estimasi lingkar perut
  var bmi = (tinggi > 0 && berat > 0) ? berat / ((tinggi/100) * (tinggi/100)) : 0;
  var estLingkar;
  if (gender === 'laki') {
    estLingkar = tinggi > 0 ? Math.round(0.722 * bmi + 0.525 * (tinggi/100) * 100 - 48.3 - (selisihBB * 0.8)) : 0;
  } else {
    estLingkar = tinggi > 0 ? Math.round(0.735 * bmi + 0.625 * (tinggi/100) * 100 - 40.2 - (selisihBB * 0.8)) : 0;
  }
  estLingkar = Math.max(60, estLingkar);

  // Tampilkan hasil
  var hasilKkal = document.getElementById('hasilKkal');
  var hasilMinggu = document.getElementById('hasilMinggu');
  var hasilTanggal = document.getElementById('hasilTanggal');
  var hasilLingkar = document.getElementById('hasilLingkar');
  var hasilBMR = document.getElementById('hasilBMR');
  var hasilTDEE = document.getElementById('hasilTDEE');
  var hasilDefisit = document.getElementById('hasilDefisit');
  
  if (hasilKkal) hasilKkal.textContent = dietCal.toLocaleString('id');
  if (hasilMinggu) hasilMinggu.textContent = targetMinggu + ' minggu';
  if (hasilTanggal) hasilTanggal.textContent = estTanggal;
  if (hasilLingkar) hasilLingkar.textContent = estLingkar + ' cm';
  if (hasilBMR) hasilBMR.textContent = Math.round(bmr).toLocaleString('id');
  if (hasilTDEE) hasilTDEE.textContent = tdee.toLocaleString('id');
  if (hasilDefisit) hasilDefisit.textContent = defisit;

  var hasilKalkulator = document.getElementById('hasilKalkulator');
  var kalkulatorForm = document.getElementById('kalkulatorForm');
  if (hasilKalkulator) hasilKalkulator.style.display = 'block';
  if (kalkulatorForm) kalkulatorForm.style.display = 'none';

  var startDateISO = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');
  var startDateDisplay = today.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'});

  window._tempKalData = {
    nama: nama.replace(/[<>"'&]/g, ''), 
    gender: gender, 
    usia: usia, 
    berat: berat, 
    tinggi: tinggi, 
    aktivitas: parseFloat(aktivitas), 
    target: target, 
    metode: metode,
    dietCal: dietCal, 
    targetMinggu: targetMinggu, 
    estTanggal: estTanggal, 
    estLingkar: estLingkar, 
    bmr: Math.round(bmr), 
    tdee: tdee, 
    defisit: defisit,
    startDate: startDateISO,
    startDateISO: startDateISO,
    startDateDisplay: startDateDisplay
  };
}

function simpanKalkulator(btnEl) {
  var data = window._tempKalData;
  if (!data) {
    showToast('Klik "Generate Program" terlebih dahulu ya kak!');
    return;
  }

  if (!btnEl) btnEl = document.getElementById('btnSimpanKal');
  var origHtml = btnEl ? btnEl.innerHTML : '';
  if (btnEl) { 
    btnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...'; 
    btnEl.disabled = true; 
  }

  try {
    var wa = appState.user.wa || localStorage.getItem('kemoenik_wa');

    if (wa && lsLoad(wa, 'kalkulator') && lsLoad(wa, 'kalkulator').dietCal > 0) {
      showToast('Kalkulator sudah pernah diisi. Gunakan tombol Reset untuk mengulang.');
      if (btnEl) { 
        btnEl.innerHTML = origHtml; 
        btnEl.disabled = false; 
      }
      return;
    }

    state.set('kalkulator', data);
    state.set('user.nama', data.nama);

    if (wa) lsSave(wa, 'kalkulator', data);
    try { 
      localStorage.setItem('kemoenik_kal_data', JSON.stringify(data)); 
    } catch(e) {}

    window._tempKalData = null;

    if (btnEl) {
      btnEl.innerHTML = '<i class="fas fa-check"></i> Tersimpan!';
      setTimeout(function() { 
        btnEl.innerHTML = origHtml; 
        btnEl.disabled = false; 
      }, 1500);
    }

    updateResetButtonVisibility();
    closePanel('panelKalkulator');
    go('home');
    setTimeout(function() {
      renderAll();
      renderHomeStats();
      loadMisiChecked();
      showToast('✅ Program tersimpan! Semangat ' + data.nama.split(' ')[0] + '! 💪');
    }, 80);

  } catch(e) {
    console.error('simpanKalkulator error:', e);
    showToast('Gagal menyimpan, coba lagi');
    if (btnEl) { 
      btnEl.innerHTML = origHtml; 
      btnEl.disabled = false; 
    }
  }
}

function updateResetButtonVisibility() {
  var hasData = appState.kalkulator && appState.kalkulator.dietCal > 0;
  var btnReset = document.getElementById('btnResetKal');
  if (btnReset) {
    btnReset.style.display = hasData ? 'block' : 'none';
  }
}

function resetKalkulator() {
  if (!confirm('Yakin reset kalkulator? Data akan dihapus dan bisa isi ulang.')) return;

  var wa = appState.user.wa || localStorage.getItem('kemoenik_wa');

  try {
    if (wa) lsRemove(wa, 'kalkulator');
    localStorage.removeItem('kemoenik_kal_data');
    state.set('kalkulator', null);

    var hasilKalkulator = document.getElementById('hasilKalkulator');
    var kalkulatorForm = document.getElementById('kalkulatorForm');
    var inputNama = document.getElementById('inputNama');
    var inputUsia = document.getElementById('inputUsia');
    var inputBerat = document.getElementById('inputBerat');
    var inputTinggi = document.getElementById('inputTinggi');
    var inputTarget = document.getElementById('inputTarget');

    if (hasilKalkulator) hasilKalkulator.style.display = 'none';
    if (kalkulatorForm) kalkulatorForm.style.display = 'block';
    if (inputNama) inputNama.value = '';
    if (inputUsia) inputUsia.value = '';
    if (inputBerat) inputBerat.value = '';
    if (inputTinggi) inputTinggi.value = '';
    if (inputTarget) inputTarget.value = '';

    showToast('✅ Kalkulator direset. Silakan isi ulang.');
    updateResetButtonVisibility();
  } catch(e) {
    console.error('resetKalkulator error:', e);
    showToast('Gagal reset, coba lagi');
  }
}

function loadKalkulatorForm() {
  var k = appState.kalkulator;
  var q = appState.quiz;
  
  var inputNama = document.getElementById('inputNama');
  var inputGender = document.getElementById('inputGender');
  var inputUsia = document.getElementById('inputUsia');
  var inputBerat = document.getElementById('inputBerat');
  var inputTinggi = document.getElementById('inputTinggi');
  var inputAktivitas = document.getElementById('inputAktivitas');
  var inputTarget = document.getElementById('inputTarget');
  var inputMetode = document.getElementById('inputMetode');

  if (k) {
    if (inputNama) inputNama.value = k.nama || '';
    if (inputGender) inputGender.value = k.gender || 'perempuan';
    if (inputUsia) inputUsia.value = k.usia || '';
    if (inputBerat) inputBerat.value = k.berat || '';
    if (inputTinggi) inputTinggi.value = k.tinggi || '';
    if (inputAktivitas) inputAktivitas.value = k.aktivitas || 1.375;
    if (inputTarget) inputTarget.value = k.target || '';
    if (inputMetode) inputMetode.value = k.metode || 'standar';
  } else if (q) {
    if (inputMetode) {
      inputMetode.value = q.metode || 'standar';
      inputMetode.style.borderColor = 'var(--green)';
      inputMetode.title = 'Otomatis dari hasil kuis: ' + q.metodeName;
    }
  }
  updateResetButtonVisibility();
  updateQuizResetButtonVisibility();
}

// EVALUASI FUNCTIONS
var editingEvalIdx = -1;
var condChecked = {};

function toggleCond(el, key) {
  if (!el) return;
  el.classList.toggle('checked');
  condChecked[key] = el.classList.contains('checked');
}

function calcWeeklyLoss() {
  var weekStartWeight = document.getElementById('weekStartWeight');
  var weekEndWeight = document.getElementById('weekEndWeight');
  var weeklyLossResult = document.getElementById('weeklyLossResult');
  var weeklyLossValue = document.getElementById('weeklyLossValue');
  
  var start = parseFloat(weekStartWeight ? weekStartWeight.value : 0) || 0;
  var end = parseFloat(weekEndWeight ? weekEndWeight.value : 0) || 0;
  
  if (start > 0 && end > 0 && start > end) {
    var loss = (start - end).toFixed(1);
    if (weeklyLossValue) weeklyLossValue.textContent = loss + ' kg';
    if (weeklyLossResult) weeklyLossResult.style.display = 'block';
  } else {
    if (weeklyLossResult) weeklyLossResult.style.display = 'none';
  }
}

function saveWeeklyEval() {
  var weekStartWeight = document.getElementById('weekStartWeight');
  var weekEndWeight = document.getElementById('weekEndWeight');
  var weeklyObstacle = document.getElementById('weeklyObstacle');
  
  var start = parseFloat(weekStartWeight ? weekStartWeight.value : 0) || 0;
  var end = parseFloat(weekEndWeight ? weekEndWeight.value : 0) || 0;
  var obstacle = weeklyObstacle ? weeklyObstacle.value : '';

  if (!start || !end) { 
    showToast('Isi berat awal dan akhir minggu ya kak!'); 
    return; 
  }

  try {
    var turun = Math.max(0, parseFloat((start - end).toFixed(1)));
    var tanggal = new Date().toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'});

    var minggu;
    if (editingEvalIdx >= 0) {
      minggu = appState.evaluasi[editingEvalIdx].minggu;
    } else {
      minggu = appState.evaluasi.length + 1;
    }

    var evalData = {
      minggu: minggu, 
      beratAwal: start, 
      beratAkhir: end, 
      turun: turun,
      obstacle: obstacle || '',
      kondisi: Object.keys(condChecked).filter(function(k){ return condChecked[k]; }).join(','),
      tanggal: tanggal, 
      savedAt: new Date().toISOString()
    };

    if (editingEvalIdx >= 0) {
      appState.evaluasi[editingEvalIdx] = evalData;
      editingEvalIdx = -1;
      var editModeIndicator = document.getElementById('editModeIndicator');
      var btnCancelEdit = document.getElementById('btnCancelEdit');
      if (editModeIndicator) editModeIndicator.style.display = 'none';
      if (btnCancelEdit) btnCancelEdit.style.display = 'none';
    } else {
      appState.evaluasi.push(evalData);
    }
    state._persist();

    var wa = appState.user.wa || localStorage.getItem('kemoenik_wa');
    if (wa) lsSave(wa, 'evaluasi', appState.evaluasi);

    if (weekStartWeight) weekStartWeight.value = '';
    if (weekEndWeight) weekEndWeight.value = '';
    if (weeklyObstacle) weeklyObstacle.value = '';
    var weeklyLossResult = document.getElementById('weeklyLossResult');
    if (weeklyLossResult) weeklyLossResult.style.display = 'none';
    condChecked = {};
    document.querySelectorAll('.cond-item').forEach(function(el){ el.classList.remove('checked'); });

    renderEvalHome();
    renderEvalHistory();
    renderHomeStats();

    var evalWeekDisplay = document.getElementById('evalWeekDisplay');
    var piSubEval = document.getElementById('piSubEval');
    if (evalWeekDisplay) evalWeekDisplay.textContent = 'Minggu ke-' + minggu;
    if (piSubEval) piSubEval.textContent = 'Terakhir: Minggu ' + minggu + ' | -' + turun + ' kg';

    showToast('✅ Evaluasi Minggu ke-' + minggu + ' berhasil disimpan! -' + turun + ' kg 💪');
  } catch(e) {
    console.error('saveWeeklyEval error:', e);
    showToast('Gagal menyimpan evaluasi, coba lagi');
  }
}

function cancelEdit() {
  editingEvalIdx = -1;
  var editModeIndicator = document.getElementById('editModeIndicator');
  var btnCancelEdit = document.getElementById('btnCancelEdit');
  var weekStartWeight = document.getElementById('weekStartWeight');
  var weekEndWeight = document.getElementById('weekEndWeight');
  var weeklyObstacle = document.getElementById('weeklyObstacle');
  var weeklyLossResult = document.getElementById('weeklyLossResult');
  
  if (editModeIndicator) editModeIndicator.style.display = 'none';
  if (btnCancelEdit) btnCancelEdit.style.display = 'none';
  if (weekStartWeight) weekStartWeight.value = '';
  if (weekEndWeight) weekEndWeight.value = '';
  if (weeklyObstacle) weeklyObstacle.value = '';
  if (weeklyLossResult) weeklyLossResult.style.display = 'none';
}

function renderEvalHistory() {
  var container = document.getElementById('weeklyHistoryList');
  if (!container) return;
  
  if (!appState.evaluasi.length) {
    container.innerHTML = '<div class="ph">Belum ada riwayat evaluasi</div>';
    return;
  }
  
  var html = '';
  appState.evaluasi.slice().reverse().forEach(function(e, revIdx) {
    var realIdx = appState.evaluasi.length - 1 - revIdx;
    html += '<div class="hist-card">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
    html += '<div><div class="hist-week">Minggu ke-' + escHtml(String(e.minggu||'')) + '</div><div class="hist-date">' + escHtml(String(e.tanggal||'')) + '</div></div>';
    html += '<div style="display:flex;gap:6px;">';
    html += '<button onclick="editEval(' + realIdx + ')" style="padding:5px 10px;background:var(--offwhite);border:1px solid var(--border);border-radius:6px;font-size:11px;cursor:pointer;font-family:inherit;">Edit</button>';
    html += '</div></div>';
    html += '<div class="hist-vals">';
    html += '<div><div class="hv-label">Berat Awal</div><div class="hv-val">' + e.beratAwal + ' kg</div></div>';
    html += '<div><div class="hv-label">Berat Akhir</div><div class="hv-val">' + e.beratAkhir + ' kg</div></div>';
    html += '<div><div class="hv-label">Turun</div><div class="hv-val" style="color:var(--green);">-' + e.turun + ' kg</div></div>';
    html += '</div>';
    if (e.kondisi) html += '<div style="font-size:11px;color:var(--text3);">Kondisi: ' + escHtml(String(e.kondisi).replace(/,/g, ' · ')) + '</div>';
    if (e.obstacle) html += '<div style="font-size:11px;color:var(--text3);margin-top:2px;">Catatan: ' + escHtml(String(e.obstacle)) + '</div>';
    html += '</div>';
  });
  setSafeHTML(container, html);
}

function editEval(idx) {
  var e = appState.evaluasi[idx];
  var weekStartWeight = document.getElementById('weekStartWeight');
  var weekEndWeight = document.getElementById('weekEndWeight');
  var weeklyObstacle = document.getElementById('weeklyObstacle');
  var editWeekNumber = document.getElementById('editWeekNumber');
  var editModeIndicator = document.getElementById('editModeIndicator');
  var btnCancelEdit = document.getElementById('btnCancelEdit');
  
  if (weekStartWeight) weekStartWeight.value = e.beratAwal;
  if (weekEndWeight) weekEndWeight.value = e.beratAkhir;
  if (weeklyObstacle) weeklyObstacle.value = e.obstacle || '';
  if (editWeekNumber) editWeekNumber.textContent = e.minggu;
  if (editModeIndicator) editModeIndicator.style.display = 'block';
  if (btnCancelEdit) btnCancelEdit.style.display = 'block';
  
  editingEvalIdx = idx;
  calcWeeklyLoss();
}

// QUIZ FUNCTIONS
var currentQ = 0;
var selectedAnswers = new Array(15).fill(null);
var finalResult = null;

function startQuiz() {
  currentQ = 0;
  selectedAnswers = new Array(15).fill(null);
  finalResult = null;
  
  var quizIntro = document.getElementById('quizIntro');
  var quizRunning = document.getElementById('quizRunning');
  var quizResult = document.getElementById('quizResult');
  
  if (quizIntro) quizIntro.style.display = 'none';
  if (quizRunning) quizRunning.style.display = 'block';
  if (quizResult) quizResult.style.display = 'none';
  
  renderQuestion();
}

function renderQuestion() {
  var q = quizQuestions[currentQ];
  var pct = Math.round((currentQ / 15) * 100);
  
  var qCurrent = document.getElementById('qCurrent');
  var qPct = document.getElementById('qPct');
  var qFill = document.getElementById('qFill');
  var qNum = document.getElementById('qNum');
  var qText = document.getElementById('qText');
  
  if (qCurrent) qCurrent.textContent = currentQ + 1;
  if (qPct) qPct.textContent = pct + '%';
  if (qFill) qFill.style.width = pct + '%';
  if (qNum) qNum.textContent = 'PERTANYAAN ' + String(currentQ+1).padStart(2,'0');
  if (qText) qText.textContent = q.text;

  var html = '';
  q.options.forEach(function(opt, idx){
    var sel = selectedAnswers[currentQ] === idx;
    html += '<div class="quiz-option' + (sel ? ' selected' : '') + '" onclick="selectAnswer(' + idx + ')">';
    html += '<div class="quiz-opt-emoji">' + opt.emoji + '</div>';
    html += '<div class="quiz-opt-text">' + opt.text + '</div>';
    html += '<div class="quiz-opt-radio">' + (sel ? '<div style="width:8px;height:8px;border-radius:50%;background:#FFF;"></div>' : '') + '</div>';
    html += '</div>';
  });
  
  var qOptions = document.getElementById('qOptions');
  if (qOptions) setSafeHTML(qOptions, html);

  var btnBack = document.getElementById('btnBack');
  var btnNext = document.getElementById('btnNext');
  
  if (btnBack) btnBack.style.display = currentQ > 0 ? 'flex' : 'none';
  if (btnNext) {
    btnNext.disabled = selectedAnswers[currentQ] === null;
    btnNext.innerHTML = currentQ === 14 ? 
      '<i class="fas fa-chart-bar"></i> Lihat Hasil' : 
      'Lanjut <i class="fas fa-arrow-right"></i>';
  }
}

function selectAnswer(idx) {
  selectedAnswers[currentQ] = idx;
  renderQuestion();
}

function goNext() {
  if (selectedAnswers[currentQ] === null) return;
  if (currentQ < 14) { 
    currentQ++; 
    renderQuestion(); 
  } else {
    showResult();
  }
}

function goBack() {
  if (currentQ > 0) { 
    currentQ--; 
    renderQuestion(); 
  }
}

function calculateResult() {
  var scores = [0,0,0,0,0,0,0];
  selectedAnswers.forEach(function(ansIdx, qIdx){
    if (ansIdx === null) return;
    quizQuestions[qIdx].options[ansIdx].scores.forEach(function(val, tIdx){ 
      scores[tIdx] += val; 
    });
  });
  var maxIdx = scores.indexOf(Math.max.apply(null, scores));
  return quizTypes[maxIdx];
}

function showResult() {
  try {
    finalResult = calculateResult();
    
    var quizRunning = document.getElementById('quizRunning');
    var quizResult = document.getElementById('quizResult');
    
    if (quizRunning) quizRunning.style.display = 'none';
    if (quizResult) quizResult.style.display = 'block';

    var qrTypeName = document.getElementById('qrTypeName');
    var qrTagline = document.getElementById('qrTagline');
    var qrMetodeName = document.getElementById('qrMetodeName');
    var qrScore = document.getElementById('qrScore');
    var qrGaugeBar = document.getElementById('qrGaugeBar');
    
    if (qrTypeName) qrTypeName.innerHTML = 'Tipe <em>' + escHtml(finalResult.name.replace('Tipe ','')) + '</em>';
    if (qrTagline) qrTagline.textContent = finalResult.tagline;
    if (qrMetodeName) qrMetodeName.textContent = finalResult.metodeName;
    if (qrScore) qrScore.textContent = finalResult.skor;
    
    setTimeout(function(){ 
      if (qrGaugeBar) qrGaugeBar.style.width = finalResult.skor + '%'; 
    }, 400);

    var traits = traitDataByType[finalResult.id] || traitDataByType[2];
    var tHtml = '';
    traits.forEach(function(t) {
      tHtml += '<div class="trait-card"><div class="trait-top"><div class="trait-name">' + t.name + '</div><div class="trait-badge ' + t.badgeClass + '">' + t.badge + '</div></div>';
      tHtml += `<div class="trait-bar-bg"><div class="trait-bar-marker" style="left:${t.pct}%"></div></div>`;
      tHtml += '<div class="trait-labels">' + t.labels.map(function(l){ return '<span>' + l + '</span>'; }).join('') + '</div>';
      tHtml += '<div class="trait-desc">' + t.desc + '</div></div>';
    });
    
    var quizTraitCards = document.getElementById('quizTraitCards');
    if (quizTraitCards) setSafeHTML(quizTraitCards, tHtml);

    var tipsHtml = '<div style="background:' + finalResult.bg + ';border-radius:14px;padding:14px;margin-bottom:14px;">';
    tipsHtml += '<div style="font-size:12px;font-weight:700;color:' + finalResult.textColor + ';margin-bottom:8px;">🎯 Metode Kamu: ' + finalResult.metodeName + '</div>';
    tipsHtml += '</div>';
    finalResult.tips.forEach(function(tip) {
      tipsHtml += '<div style="display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border);">';
      tipsHtml += '<div style="color:var(--green);font-size:14px;margin-top:1px;">✓</div>';
      tipsHtml += '<div style="font-size:13px;color:var(--text3);line-height:1.6;">' + tip + '</div></div>';
    });
    
    var quizTipsContent = document.getElementById('quizTipsContent');
    if (quizTipsContent) setSafeHTML(quizTipsContent, tipsHtml);

    var metodeKey = finalResult.metode;
    var jadwal = targetOlahragaData[metodeKey] || targetOlahragaData.standar;
    var progHtml = '<div style="font-size:12px;font-weight:700;color:var(--green);margin-bottom:12px;">📅 Jadwal Olahraga Mingguan</div>';
    progHtml += '<div style="background:var(--offwhite);border-radius:12px;padding:14px;margin-bottom:14px;">';
    jadwal.forEach(function(d) {
      var isRest = d.aktivitas.indexOf('Istirahat') !== -1;
      progHtml += '<div style="display:flex;gap:10px;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);">';
      progHtml += '<div style="font-size:11px;font-weight:700;color:' + (isRest ? 'var(--text3)' : 'var(--green)') + ';width:28px;">' + d.hari + '</div>';
      progHtml += '<div style="flex:1;font-size:12px;color:' + (isRest ? 'var(--text3)' : 'var(--text)') + ';">' + d.aktivitas + '</div>';
      if (!isRest) progHtml += '<div>💪</div>';
      progHtml += '</div>';
    });
    progHtml += '</div>';
    
    var quizProgramContent = document.getElementById('quizProgramContent');
    if (quizProgramContent) setSafeHTML(quizProgramContent, progHtml);

    var qData = {
      tipe: finalResult.id, 
      tipeName: finalResult.name, 
      metode: finalResult.metode,
      metodeName: finalResult.metodeName, 
      tagline: finalResult.tagline,
      skor: finalResult.skor, 
      tipe_emoji: finalResult.emoji
    };
    state.set('quiz', qData);

    var waForQuiz = appState.user.wa || localStorage.getItem('kemoenik_wa');
    if (waForQuiz) lsSave(waForQuiz, 'quiz', qData);
    try { 
      localStorage    .setItem('kemoenik_quiz', JSON.stringify(qData)); 
    } catch(e) {}

    renderAll();
  } catch(e) {
    console.error('showResult error:', e);
    showToast('Gagal menampilkan hasil kuis');
  }
}

function selesaiQuiz() {
  try {
    if (!finalResult) {
      showToast('Error: Hasil kuis tidak ditemukan');
      return;
    }

    var wa = appState.user.wa || localStorage.getItem('kemoenik_wa');

    var qData = {
      tipe: finalResult.id,
      tipeName: finalResult.name,
      metode: finalResult.metode,
      metodeName: finalResult.metodeName,
      tagline: finalResult.tagline,
      skor: finalResult.skor,
      tipe_emoji: finalResult.emoji
    };

    if (wa && lsLoad(wa, 'quiz') && lsLoad(wa, 'quiz').tipe) {
      showToast('Kuis sudah pernah diisi. Gunakan tombol Reset Quiz untuk mengulang.');
      return;
    }

    if (wa) lsSave(wa, 'quiz', qData);
    state.set('quiz', qData);
    try { 
      localStorage.setItem('kemoenik_quiz', JSON.stringify(qData)); 
    } catch(e) {}
    state._persist();

    updateQuizResetButtonVisibility();

    setTimeout(function() {
      go('profil');
      setTimeout(function() {
        renderAll();
        renderProfilPage();
        ['acc-trait','acc-karakter','acc-skor'].forEach(function(id) {
          var el = document.getElementById(id);
          if (el) el.classList.add('on');
        });
        showToast('✅ Profil metabolisme tersimpan!');
      }, 150);
    }, 100);

  } catch(e) {
    console.error('selesaiQuiz error:', e);
    showToast('Gagal menyimpan hasil kuis');
  }
}

function updateQuizResetButtonVisibility() {
  var hasData = appState.quiz && appState.quiz.tipe;
  var btnReset = document.getElementById('btnResetQuiz');
  if (btnReset) {
    btnReset.style.display = hasData ? 'block' : 'none';
  }
}

function resetQuizData() {
  if (!confirm('Yakin reset hasil kuis? Data akan dihapus dan bisa isi ulang.')) return;

  var wa = appState.user.wa || localStorage.getItem('kemoenik_wa');

  try {
    if (wa) lsRemove(wa, 'quiz');
    localStorage.removeItem('kemoenik_quiz');
    state.set('quiz', null);

    showToast('✅ Quiz direset. Silakan isi ulang.');

    var quizIntro = document.getElementById('quizIntro');
    var quizRunning = document.getElementById('quizRunning');
    var quizResult = document.getElementById('quizResult');
    
    if (quizIntro) quizIntro.style.display = 'block';
    if (quizRunning) quizRunning.style.display = 'none';
    if (quizResult) quizResult.style.display = 'none';

    updateQuizResetButtonVisibility();
  } catch(e) {
    console.error('resetQuizData error:', e);
    showToast('Gagal reset quiz');
  }
}

function ulangQuiz() {
  currentQ = 0;
  selectedAnswers = new Array(15).fill(null);
  finalResult = null;
  
  var quizIntro = document.getElementById('quizIntro');
  var quizRunning = document.getElementById('quizRunning');
  var quizResult = document.getElementById('quizResult');
  
  if (quizIntro) quizIntro.style.display = 'block';
  if (quizRunning) quizRunning.style.display = 'none';
  if (quizResult) quizResult.style.display = 'none';
}

function showResultTab(name, btn) {
  document.querySelectorAll('.result-tab-panel').forEach(function(p){ p.classList.remove('on'); });
  document.querySelectorAll('.rt-btn').forEach(function(b){ b.classList.remove('on'); });
  
  var rtPanel = document.getElementById('rt' + name.charAt(0).toUpperCase() + name.slice(1));
  if (rtPanel) rtPanel.classList.add('on');
  if (btn) btn.classList.add('on');
}
      
