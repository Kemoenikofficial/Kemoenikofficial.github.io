/* ============================================================
   KEMOENIK APP v2.0
   ============================================================ */

/* app.js: APP_URL, access control, initApp, navigation, all render/UI functions, kalkulator, evaluasi */

/*
 * KEMOENIK APP v2.0
 * Local Storage Implementation — data disimpan per nomor WA
 */

var APP_URL = 'https://kemoenikofficial.github.io/aktivitas/';

// ============================================================

// ACCESS CONTROL
// ============================================================
function goToAktivitas() {
  window.location.href = APP_URL;
}

function getQueryParam(key) {
  var params = new URLSearchParams(window.location.search);
  return params.get(key) || '';
}

// ============================================================
// INIT — DOMContentLoaded untuk pastikan DOM siap sebelum akses element
// ============================================================
function normalizeWA(wa) {
  wa = wa.replace(/\D/g, '');
  if (wa.startsWith('08')) return '62' + wa.substring(1);
  if (wa.startsWith('+62')) return wa.substring(1);
  if (wa.startsWith('62')) return wa;
  if (wa.startsWith('0')) return '62' + wa.substring(1);
  return wa;
}

async function checkVoucherValid(wa, voucher) {
  try {
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEzIIntNL_LO2imvYtXzULGeX_KTyDlnZlAzE4PkjAIOiuwbkTsTQEIUr8k_8qIFm2/exec';
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

function showVoucherExpiredBlock(message) {
  document.getElementById('loadingScreen').style.display = 'none';
  var blockHTML = `
    <div style="position:fixed;inset:0;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;z-index:9999;text-align:center;">
      <div style="font-size:64px;margin-bottom:20px;">🔒</div>
      <div style="font-family:var(--font-display);font-size:24px;font-weight:700;color:var(--green2);margin-bottom:12px;">Voucher Expired</div>
      <div style="font-size:14px;color:var(--text3);line-height:1.7;max-width:320px;margin-bottom:30px;">
        ${message}<br><br>
        Silakan verifikasi voucher baru di halaman aktivitas untuk melanjutkan program diet Anda.
      </div>
      <button onclick="goToAktivitas()" style="padding:16px 32px;background:linear-gradient(135deg,var(--green),var(--green2));color:#FFF;border:none;border-radius:var(--r-lg);font-family:var(--font-body);font-size:15px;font-weight:700;cursor:pointer;">
        Verifikasi Voucher Baru
      </button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', blockHTML);
}

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

    document.getElementById('accessScreen').style.display = 'none';
    document.getElementById('loadingScreen').style.display = 'none';

    // Load data dari localStorage (per WA)
    var userData = normalizedWA ? lsLoadAll(normalizedWA) : null;

    // Handle mode "new" — hapus data diet, keep profile
    if (mode === 'new' && userData && normalizedWA) {
      lsRemove(normalizedWA, 'kalkulator');
      lsRemove(normalizedWA, 'quiz');
      lsRemove(normalizedWA, 'evaluasi');
      userData = { profile: userData.profile };
    }

    // Sync ke appState dari localStorage WA
    if (userData) {
      if (userData.kalkulator) state.set('kalkulator', userData.kalkulator);
      if (userData.quiz)       state.set('quiz', userData.quiz);
      if (userData.evaluasi && userData.evaluasi.length) state.set('evaluasi', userData.evaluasi);
      if (userData.profile)    state.set('user.nama', userData.profile.nama);
      if (normalizedWA)        state.set('user.wa', normalizedWA);
    }

    // Fallback: coba key lama (backward compat)
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

    // Simpan profile ke localStorage
    if (normalizedWA) {
      lsSave(normalizedWA, 'profile', {
        nama: appState.user.nama || 'User',
        wa: normalizedWA,
        lastActive: new Date().toISOString()
      });
    }

    state._persist();

    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';

    renderAll();
    setTimeout(renderHomeJadwal, 150);

    if (localStorage.getItem('kemoenik_just_finished_quiz') === 'true') {
      localStorage.removeItem('kemoenik_just_finished_quiz');
      setTimeout(function() {
        renderProfilPage();
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

// Gunakan DOMContentLoaded agar elemen HTML sudah ada saat init berjalan
document.addEventListener('DOMContentLoaded', function() { initApp(); });
// Fallback: jika DOMContentLoaded sudah lewat (misal script di bawah body)
if (document.readyState === 'interactive' || document.readyState === 'complete') { initApp(); }


// ============================================================
// NAVIGATION
// ============================================================
function go(page) {
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('on'); });
  document.querySelectorAll('.pill').forEach(function(p){ p.classList.remove('on'); });
  document.querySelectorAll('.bn').forEach(function(b){ b.classList.remove('on'); });
  document.querySelectorAll('.d-item').forEach(function(d){ d.classList.remove('on'); });

  var pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('on');

  // Bottom nav
  var bn = document.getElementById('bn-' + page);
  if (bn) bn.classList.add('on');

  // Drawer
  var di = document.getElementById('di-' + page);
  if (di) di.classList.add('on');

  // Re-render per halaman
  if (page === 'profil') renderProfilPage();
  if (page === 'progress') { renderEvalHome(); renderEvalHistory(); renderProgress(); }

  // Scroll top
  var content = document.getElementById('content');
  if (content) content.scrollTo({top: 0, behavior:'smooth'});

  gtag('event', 'page_view', { page_title: page });
}

function openDrawer() {
  document.getElementById('drawer').classList.add('on');
  document.getElementById('overlay').classList.add('on');
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('on');
  document.getElementById('overlay').classList.remove('on');
}

function openPanel(id) {
  // Panel-specific pre-hooks
  if (id === 'panelKalkulator') {
    // Tampilkan notif kuis jika belum mengisi kuis
    var kalNotif = document.getElementById('kalNotifKuis');
    if (kalNotif) kalNotif.style.display = appState.quiz ? 'none' : 'block';

    // Hanya load form jika belum ada _tempKalData yang pending (user sedang lihat hasil)
    var hasilVisible = document.getElementById('hasilKalkulator') && document.getElementById('hasilKalkulator').style.display !== 'none';
    if (!hasilVisible) {
      // Reset state hasil dulu
      window._tempKalData = null;
      document.getElementById('hasilKalkulator').style.display = 'none';
      document.getElementById('kalkulatorForm').style.display = 'block';
      loadKalkulatorForm();
    }
  }
  if (id === 'panelEvaluasi') {
    var n = appState.evaluasi.length + 1;
    var weekLabel = editingEvalIdx >= 0 ? 'Edit Minggu ke-' + appState.evaluasi[editingEvalIdx].minggu : 'Evaluasi Minggu ke-' + n;
    document.getElementById('evalWeekDisplay').textContent = weekLabel;
    renderEvalHistory();
  }
  if (id === 'panelMenu') renderMenuHarian();
  if (id === 'panelJadwalOlahraga') renderJadwalOlahraga();
  if (id === 'panelPanduanLengkap') {
    if (document.getElementById('targetKcalLengkap')) {
      document.getElementById('targetKcalLengkap').textContent = appState.kalkulator ? Math.round(appState.kalkulator.dietCal) : '—';
    }
  }
  document.getElementById(id).classList.add('on');
  document.body.style.overflow = 'hidden';
  gtag('event', 'open_panel', { panel: id });
}
function closePanel(id) {
  document.getElementById(id).classList.remove('on');
  document.body.style.overflow = '';
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

// ── UTILITY: escape HTML untuk cegah XSS ────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// setSafeHTML: bersihkan innerHTML via DOM API (untuk konten dinamis kompleks)
function setSafeHTML(el, html) {
  if (!el) return;
  el.innerHTML = '';
  var tmp = document.createElement('div');
  tmp.innerHTML = html;
  while (tmp.firstChild) el.appendChild(tmp.firstChild);
}
function openBeli() { openPanel('modalBeli'); }
function openFaq() { go('home'); setTimeout(function(){ document.getElementById('faqHomeSection').scrollIntoView({behavior:'smooth'}); }, 200); }

// Close panel on backdrop click
document.querySelectorAll('.modal-panel').forEach(function(panel){
  panel.addEventListener('click', function(e){ if(e.target === panel) closePanel(panel.id); });
});

// ============================================================
// ACCORDION
// ============================================================
function tog(id) {
  var el = document.getElementById(id);
  el.classList.toggle('on');
}

function togFaq(id) {
  var el = document.getElementById(id);
  el.classList.toggle('on');
}

// ============================================================
// RENDER ALL
// ============================================================
function renderAll() {
  console.log('[renderAll] kalkulator:', appState.kalkulator ? '✓ '+appState.kalkulator.dietCal+'kkal' : 'null');
  console.log('[renderAll] quiz:', appState.quiz ? '✓ '+appState.quiz.tipeName : 'null');
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
  renderMetScoreCard();
  syncProgressPage();

  // Tampilkan notif "isi kuis dulu" di Program page jika kuis belum dikerjakan
  var kuisNotif = document.getElementById('kuisFirstNotif');
  if (kuisNotif) kuisNotif.style.display = appState.quiz ? 'none' : 'flex';
}

// ============================================================
// HOME STATS (dari kalkulator + quiz)
// ============================================================
function renderHomeStats() {
  var k = appState.kalkulator;
  var q = appState.quiz;

  // Hero name & type
  var nama = k ? (k.nama || '—') : (q ? (q.nama || '—') : '—');
  document.getElementById('userName').textContent = nama.split(' ')[0] || '—';
  document.getElementById('dName').textContent = nama || '—';

  if (q) {
    document.getElementById('heroName').innerHTML = escHtml(q.tipeName) + ' <span>' + escHtml(q.tipe_emoji) + '</span>';
    document.getElementById('heroTypeName').textContent = '';
    document.getElementById('heroBadge').textContent = q.metode === 'agresif' ? '🔥 Agresif' : q.metode === 'ringan' ? '🐢 Ringan' : '⚖️ Standar';
    document.getElementById('statMetode').textContent = q.metode || '—';
  }

  if (k) {
    document.getElementById('statKkal').textContent = k.dietCal ? Math.round(k.dietCal).toLocaleString('id') : '—';
    document.getElementById('statMinggu').textContent = k.targetMinggu ? k.targetMinggu + 'mg' : '—';

    // Estimasi panel
    document.getElementById('estMinggu').textContent = k.targetMinggu ? k.targetMinggu + ' minggu' : '—';
    document.getElementById('estTanggal').textContent = k.estTanggal || '—';
    document.getElementById('estLingkar').textContent = k.estLingkar ? k.estLingkar + ' cm' : '—';

    // Program banner
    // Generate startDateDisplay dari ISO string kalau tidak ada
    var startDisplay = k.startDateDisplay || k.startDate || '';
    if (!k.startDateDisplay && k.startDateISO) {
      try {
        var sd = new Date(k.startDateISO);
        if (!isNaN(sd)) startDisplay = sd.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'});
      } catch(e) {}
    }

    document.getElementById('statKkal').textContent = k.dietCal ? Math.round(k.dietCal).toLocaleString('id') : '—';
    document.getElementById('statMinggu').textContent = k.targetMinggu ? k.targetMinggu + 'mg' : '—';
    document.getElementById('progNama').textContent = (nama || '—') + (q ? ' — ' + q.tipeName : '');
    document.getElementById('progDesc').textContent = 'Mulai: ' + (startDisplay || '—') + ' | Target: ' + (k.target || '—') + ' kg';
    document.getElementById('piSubKalori').textContent = k.dietCal ? Math.round(k.dietCal) + ' kkal/hari • ' + k.targetMinggu + ' minggu' : 'Hitung kebutuhan kalori & target mingguanmu';
    document.getElementById('piSubTimeline').textContent = k.startDate ? 'Mulai ' + (startDisplay || k.startDate) + ' → ' + k.estTanggal : 'Fase & jadwal program dietmu';
    document.getElementById('progNotif').style.display = 'flex';
  }

  // Eval target
  document.getElementById('evalTarget').textContent = k ? (k.target || '—') + ' kg' : '—';

  // Meal target
  if (document.getElementById('mealTargetDisplay')) document.getElementById('mealTargetDisplay').textContent = k ? Math.round(k.dietCal) : '—';
  if (document.getElementById('targetKcalLengkap')) document.getElementById('targetKcalLengkap').textContent = k ? Math.round(k.dietCal) : '—';
}

// ============================================================
// HOME GREETING
// ============================================================
function renderHomeGreeting() {
  var q = appState.quiz;
  var k = appState.kalkulator;
  var nama = k ? k.nama : (q ? q.nama : '');
  var firstName = nama ? nama.split(' ')[0] : '—';
  document.getElementById('userName').textContent = firstName;

  var desc = 'Selamat datang di panduan diet<br><strong>KEMOENIK</strong> — hari ini kita jaga komitmenmu 💪';
  if (q) {
    desc = 'Tipe: <strong>' + escHtml(q.tipeName) + '</strong> | Metode: <strong>' + escHtml(q.metodeName) + '</strong><br>Tetap konsisten dengan program KEMOENIK kamu! 💪';
  }
  var greetEl = document.getElementById('greetingDesc');
  if (greetEl) setSafeHTML(greetEl, desc);

  // Tips harian rotate
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
  document.getElementById('dailyTipText').textContent = tips[dayIdx];
}

// ============================================================
// METABOLISM SCORE CARD (Beranda)
// ============================================================
function renderMetScoreCard() {
  var q = appState.quiz;
  var card = document.getElementById('metScoreCard');
  if (!card) return;
  if (!q || !q.tipe) { card.style.display = 'none'; return; }

  card.style.display = 'block';
  document.getElementById('metScoreTipe').textContent = (q.tipe_emoji || '') + ' ' + (q.tipeName || q.tipe);
  document.getElementById('metScoreTagline').textContent = q.tagline || '';
  document.getElementById('metScoreMetodeBadge').textContent = q.metodeName || q.metode || '';
  document.getElementById('metScoreEmoji').textContent = '';

  var skor = parseInt(q.skor) || 0;
  document.getElementById('metScorePct').textContent = skor + '%';

  // Animate lingkaran
  var circumference = 238.76;
  var offset = circumference - (skor / 100) * circumference;
  setTimeout(function() {
    var ring = document.getElementById('metScoreRing');
    if (ring) ring.style.strokeDashoffset = offset;
  }, 100);
}

// SYNC PROGRESS PAGE (duplikat data ke halaman Progress)
// ============================================================
function syncProgressPage() {
  var k = appState.kalkulator;
  var evals = appState.evaluasi || [];

  // Progress bar
  if (k && k.startDate) {
    var isoStr = k.startDateISO || k.startDate;
    var startDate = new Date(isoStr);
    var today = new Date();
    if (isNaN(startDate)) startDate = today;
    var totalHari = (k.targetMinggu || 4) * 7;
    var hariKe = Math.max(1, Math.min(Math.floor((today - startDate) / 86400000) + 1, totalHari));
    var pct = Math.round((hariKe / totalHari) * 100);
    var el = function(id) { return document.getElementById(id); };
    if (el('progHari2')) el('progHari2').textContent = hariKe;
    if (el('progTotal2')) el('progTotal2').textContent = totalHari;
    if (el('progTotalLabel2')) el('progTotalLabel2').textContent = totalHari;
    if (el('progPct2')) el('progPct2').textContent = pct + '%';
    setTimeout(function() {
      if (el('progFill2')) el('progFill2').style.width = pct + '%';
      if (el('progThumb2')) el('progThumb2').style.left = pct + '%';
    }, 100);
  }

  // Eval stats
  if (el2('evalTarget2') && k) el2('evalTarget2').textContent = (k.target || '—') + ' kg';
  if (evals.length > 0) {
    var last = evals[evals.length - 1];
    var total = evals.reduce(function(s, e) { return s + (e.turun || 0); }, 0);
    if (el2('evalMingguLabel2')) el2('evalMingguLabel2').textContent = 'Minggu ' + evals.length;
    if (el2('evalPenurunan2')) el2('evalPenurunan2').textContent = '-' + total.toFixed(1) + ' kg';
    if (el2('evalBerat2')) el2('evalBerat2').textContent = (last.beratAkhir || '—') + ' kg';
  }

  // Eval history untuk halaman Progress
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

function el2(id) { return document.getElementById(id); }

// ============================================================
// PROGRESS BAR
// ============================================================
function renderProgress() {
  var k = appState.kalkulator;
  if (!k || (!k.startDate && !k.startDateISO)) {
    document.getElementById('progHari').textContent = '—';
    document.getElementById('progTotal').textContent = '—';
    document.getElementById('progPct').textContent = '—%';
    document.getElementById('progTotalLabel').textContent = '—';
    return;
  }

  // ── Parse tanggal dengan multi-format fallback ────────────
  var start = null;

  // Prioritas 1: ISO format YYYY-MM-DD (paling reliable)
  var isoStr = k.startDateISO || k.startDate || '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoStr)) {
    // Append T00:00:00 agar tidak bergeser timezone
    start = new Date(isoStr + 'T00:00:00');
  }

  // Prioritas 2: format lokal Indonesia "12 Jan 2025" / "12 Januari 2025"
  if (!start || isNaN(start.getTime())) {
    var dateStr = k.startDate || '';
    var parts = dateStr.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
    if (parts) {
      var monthMap = {
        jan:0, feb:1, mar:2, apr:3, mei:4, jun:5,
        jul:6, agu:7, sep:8, okt:9, nov:10, des:11,
        januari:0, februari:1, maret:2, april:3, juni:5,
        juli:6, agustus:7, september:8, oktober:9, november:10, desember:11,
        // English fallback
        may:4, aug:7, oct:9, dec:11
      };
      var mKey = parts[2].toLowerCase();
      if (monthMap[mKey] !== undefined) {
        start = new Date(parseInt(parts[3]), monthMap[mKey], parseInt(parts[1]));
      }
    }
  }

  // Prioritas 3: native Date parse (handles ISO with time, RFC2822, etc.)
  if (!start || isNaN(start.getTime())) {
    start = new Date(k.startDate || k.startDateISO || '');
  }

  // Fallback: jika semua gagal → anggap mulai hari ini (hari ke-1)
  if (!start || isNaN(start.getTime())) {
    console.warn('renderProgress: invalid startDate:', k.startDate, '— using today');
    start = new Date();
  }

  // ── Hitung selisih hari (murni tanggal, abaikan jam) ─────
  var today = new Date();
  var startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  var todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  var totalHari = (k.targetMinggu || 4) * 7;
  var hariKe = Math.max(1, Math.floor((todayDay - startDay) / (1000*60*60*24)) + 1);
  hariKe = Math.min(hariKe, totalHari);
  var pct = totalHari > 0 ? Math.round((hariKe / totalHari) * 100) : 0;

  document.getElementById('progHari').textContent = hariKe;
  document.getElementById('progTotal').textContent = totalHari;
  document.getElementById('progPct').textContent = pct + '%';
  document.getElementById('progTotalLabel').textContent = totalHari;

  // ── Animasi progress bar ──────────────────────────────────
  var fill = document.getElementById('progFill');
  var thumb = document.getElementById('progThumb');
  if (fill && thumb) {
    // Reset ke 0 dulu untuk trigger CSS transition ulang
    fill.style.transition = 'none';
    thumb.style.transition = 'none';
    fill.style.width = '0%';
    thumb.style.left = '0%';
    // Force reflow
    void fill.offsetWidth;
    // Restore transition lalu animate
    fill.style.transition = '';
    thumb.style.transition = '';
    setTimeout(function() {
      fill.style.width = pct + '%';
      thumb.style.left = pct + '%';
    }, 50);
  }

  // ── Timeline dates ────────────────────────────────────────
  var displayStart = k.startDateDisplay || k.startDate || '—';
  if (!k.startDateDisplay && k.startDateISO) {
    try {
      var sdT = new Date(k.startDateISO);
      if (!isNaN(sdT)) displayStart = sdT.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'});
    } catch(e) {}
  }
  if (document.getElementById('timelineStartDate')) {
    document.getElementById('timelineStartDate').textContent = displayStart;
    document.getElementById('timelineEndDate').textContent = k.estTanggal || '—';
  }

  console.log('Timeline: hari', hariKe, '/', totalHari, '(' + pct + '%), startDate:', isoStr);
}

// ============================================================
// EVAL HOME
// ============================================================
function renderEvalHome() {
  var evals = appState.evaluasi;
  if (!evals || !evals.length) {
    document.getElementById('evalMingguLabel').textContent = '—';
    document.getElementById('evalPenurunan').textContent = '— kg';
    document.getElementById('evalBerat').textContent = '— kg';
    return;
  }

  // Hitung akumulasi
  var totalTurun = 0;
  evals.forEach(function(e){ totalTurun += (e.turun || 0); });
  var last = evals[evals.length - 1];

  document.getElementById('evalMingguLabel').textContent = 'Minggu ' + (evals.length);
  document.getElementById('evalPenurunan').textContent = '-' + totalTurun.toFixed(1) + ' kg';
  document.getElementById('evalBerat').textContent = last.beratAkhir ? last.beratAkhir + ' kg' : '— kg';

  // History display
  renderEvalHistory();
}

// ============================================================
// MISSION MODE
// ============================================================
function setMissionMode(mode) {
  document.querySelectorAll('.mission-set').forEach(function(s){ s.classList.remove('show'); });
  document.querySelectorAll('.mm-btn').forEach(function(b){ b.classList.remove('on'); });
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
  var item = document.getElementById(itemId);
  var check = document.getElementById(checkId);
  var isDone = item.classList.toggle('done');
  if (isDone) { check.classList.add('checked'); check.textContent = '✓'; }
  else { check.classList.remove('checked'); check.textContent = ''; }

  // Simpan
  var saved = JSON.parse(localStorage.getItem('kemoenik_misi_' + getTodayStr()) || '{}');
  saved[itemId] = isDone;
  localStorage.setItem('kemoenik_misi_' + getTodayStr(), JSON.stringify(saved));
}

function getTodayStr() { return new Date().toISOString().split('T')[0]; }

function loadMisiChecked() {
  var saved = JSON.parse(localStorage.getItem('kemoenik_misi_' + getTodayStr()) || '{}');
  Object.keys(saved).forEach(function(id){
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

// ============================================================

// ============================================================
// PROFIL PAGE — dari Quiz
// ============================================================
var traitDataByType = {
  1: [ // Nasi Warrior
    { name:'Respons terhadap Karbohidrat', badge:'Sensitif Tinggi', badgeClass:'badge-tinggi', pct:85, labels:['Rendah','Normal','Tinggi'], desc:'Tubuhmu bereaksi kuat terhadap asupan karbohidrat. Batasi karbohidrat sederhana & ganti dengan yang kompleks.' },
    { name:'Kemampuan Bakar Lemak', badge:'Normal', badgeClass:'badge-optimal', pct:50, labels:['Rendah','Normal','Tinggi'], desc:'Kemampuan bakar lemak dalam batas normal. Defisit kalori konsisten akan memberikan hasil optimal.' },
    { name:'Efisiensi Metabolisme Basal', badge:'Di Atas Rata-rata', badgeClass:'badge-optimal', pct:65, labels:['Rendah','Normal','Tinggi'], desc:'Metabolisme basalmu cukup efisien. Ini membantumu membakar kalori lebih banyak saat istirahat.' },
    { name:'Toleransi Puasa', badge:'Rendah', badgeClass:'badge-perlu', pct:30, labels:['Rendah','Normal','Tinggi'], desc:'Kamu cenderung kurang toleran terhadap puasa panjang. IF tidak direkomendasikan untuk tipe ini.' },
    { name:'Sensitivitas Stres vs BB', badge:'Sedang', badgeClass:'badge-perlu', pct:50, labels:['Rendah','Sedang','Tinggi'], desc:'Stres cukup berpengaruh terhadap berat badanmu. Kelola stres dengan olahraga ringan & tidur cukup.' }
  ],
  2: [ // Lemak Fighter
    { name:'Kemampuan Bakar Lemak', badge:'Perlu Perhatian', badgeClass:'badge-perlu', pct:72, labels:['Rendah','Normal','Tinggi'], desc:'Tubuhmu cenderung lebih lambat membakar lemak. Atasi dengan defisit kalori konsisten + IF 16:8.' },
    { name:'Respons terhadap Karbohidrat', badge:'Normal', badgeClass:'badge-optimal', pct:45, labels:['Sensitif','Normal','Toleran'], desc:'Respons gula darahmu terhadap karbohidrat masih normal. Tetap batasi karbohidrat sederhana.' },
    { name:'Efisiensi Metabolisme Basal', badge:'Di Bawah Rata-rata', badgeClass:'badge-perlu', pct:30, labels:['Rendah','Normal','Tinggi'], desc:'Metabolisme basalmu lebih hemat energi — membakar lebih sedikit kalori saat istirahat.' },
    { name:'Respons terhadap Kardio', badge:'Kurang Optimal', badgeClass:'badge-tinggi', pct:78, labels:['Kurang','Cukup','Baik'], desc:'Kardio saja tidak cukup efektif. Kombinasikan dengan latihan kekuatan untuk hasil lebih optimal.' },
    { name:'Toleransi Puasa', badge:'Baik', badgeClass:'badge-optimal', pct:25, labels:['Rendah','Normal','Tinggi'], desc:'Tubuhmu cukup toleran terhadap puasa. IF 16:8 sangat cocok dan efektif untukmu!' }
  ],
  3: [ // Otot Aktif
    { name:'Kemampuan Bakar Lemak', badge:'Baik', badgeClass:'badge-optimal', pct:60, labels:['Rendah','Normal','Tinggi'], desc:'Kemampuan membakar lemakmu cukup baik, terutama saat dikombinasikan dengan latihan kekuatan.' },
    { name:'Metabolisme Protein', badge:'Tinggi', badgeClass:'badge-optimal', pct:80, labels:['Rendah','Normal','Tinggi'], desc:'Tubuhmu efisien menggunakan protein untuk membangun & mempertahankan otot.' },
    { name:'Respons terhadap Olahraga', badge:'Sangat Baik', badgeClass:'badge-optimal', pct:20, labels:['Kurang','Cukup','Baik'], desc:'Tubuhmu merespons sangat baik terhadap latihan fisik — ini keunggulan besar!' },
    { name:'Toleransi Kalori Rendah', badge:'Perlu Perhatian', badgeClass:'badge-perlu', pct:65, labels:['Toleran','Sedang','Sensitif'], desc:'Diet terlalu rendah kalori bisa merusak ototmu. Jangan potong kalori terlalu drastis.' },
    { name:'Efisiensi Metabolisme Basal', badge:'Tinggi', badgeClass:'badge-optimal', pct:25, labels:['Rendah','Normal','Tinggi'], desc:'Metabolisme basalmu efisien dan tinggi — kamu membakar lebih banyak kalori bahkan saat istirahat.' }
  ],
  4: [ // Hemat Energi
    { name:'Kecepatan Metabolisme', badge:'Lambat', badgeClass:'badge-tinggi', pct:80, labels:['Cepat','Normal','Lambat'], desc:'Metabolismemu bekerja lebih pelan. Jangan potong kalori drastis — defisit kecil lebih efektif.' },
    { name:'Kemampuan Bakar Lemak', badge:'Rendah', badgeClass:'badge-perlu', pct:70, labels:['Rendah','Normal','Tinggi'], desc:'Pembakaran lemak butuh lebih banyak waktu. Konsistensi jangka panjang adalah kuncinya.' },
    { name:'Toleransi Aktivitas Fisik', badge:'Sedang', badgeClass:'badge-perlu', pct:55, labels:['Rendah','Sedang','Tinggi'], desc:'Tingkatkan aktivitas fisik secara bertahap — jalan kaki, naik tangga, hindari lift.' },
    { name:'Respons terhadap Perubahan', badge:'Butuh Waktu', badgeClass:'badge-perlu', pct:72, labels:['Cepat','Sedang','Lambat'], desc:'Tubuhmu butuh lebih banyak waktu untuk beradaptasi. Sabar dan tetap konsisten!' },
    { name:'Sensitivitas Stres vs BB', badge:'Sedang', badgeClass:'badge-perlu', pct:55, labels:['Rendah','Sedang','Tinggi'], desc:'Stres cukup berpengaruh. Prioritaskan tidur 7–8 jam dan kelola stres dengan baik.' }
  ],
  5: [ // Mood & Lifestyle
    { name:'Pengaruh Stres terhadap BB', badge:'Tinggi', badgeClass:'badge-tinggi', pct:82, labels:['Rendah','Sedang','Tinggi'], desc:'Stres sangat mempengaruhi berat badanmu. Prioritaskan manajemen stres & tidur berkualitas.' },
    { name:'Pola Tidur', badge:'Perlu Perhatian', badgeClass:'badge-perlu', pct:70, labels:['Baik','Sedang','Buruk'], desc:'Kurang tidur meningkatkan hormon lapar & menurunkan metabolisme. Targetkan 7–8 jam/malam.' },
    { name:'Makan Emosional', badge:'Perlu Diwaspadai', badgeClass:'badge-perlu', pct:75, labels:['Rendah','Sedang','Tinggi'], desc:'Kamu cenderung makan saat emosi. Kenali triggernya dan cari alternatif — olahraga, meditasi.' },
    { name:'Konsistensi Rutinitas', badge:'Perlu Ditingkatkan', badgeClass:'badge-tinggi', pct:65, labels:['Konsisten','Sedang','Tidak Konsisten'], desc:'Rutinitas yang tidak konsisten menghambat program diet. Buat jadwal makan & minum KEMOENIK tetap.' },
    { name:'Kemampuan Bakar Lemak', badge:'Normal', badgeClass:'badge-optimal', pct:45, labels:['Rendah','Normal','Tinggi'], desc:'Kemampuan bakar lemakmu normal. Dengan perbaikan gaya hidup, hasilnya akan meningkat signifikan.' }
  ],
  6: [ // Perut Sensitif
    { name:'Kesehatan Pencernaan', badge:'Perlu Perhatian', badgeClass:'badge-tinggi', pct:75, labels:['Baik','Sedang','Sensitif'], desc:'Sistem pencernaanmu sensitif. Hindari makanan pemicu: susu, gluten, gorengan, makanan pedas.' },
    { name:'Kemampuan Bakar Lemak', badge:'Normal', badgeClass:'badge-optimal', pct:50, labels:['Rendah','Normal','Tinggi'], desc:'Kemampuan bakar lemak normal, namun masalah pencernaan sering menghambat proses diet.' },
    { name:'Respons terhadap Lemak', badge:'Sensitif', badgeClass:'badge-perlu', pct:70, labels:['Toleran','Normal','Sensitif'], desc:'Makanan berlemak tinggi memicu ketidaknyamanan pencernaan. Fokus pada lemak sehat & porsi kecil.' },
    { name:'Keberagaman Bakteri Usus', badge:'Perlu Ditingkatkan', badgeClass:'badge-perlu', pct:60, labels:['Baik','Sedang','Kurang'], desc:'Tambahkan probiotik: yogurt, tempe, kimchi untuk kesehatan usus yang lebih baik.' },
    { name:'Toleransi Puasa', badge:'Rendah', badgeClass:'badge-tinggi', pct:75, labels:['Tinggi','Sedang','Rendah'], desc:'IF tidak direkomendasikan untuk tipe perutmu yang sensitif. Makan teratur lebih disarankan.' }
  ],
  7: [ // Seimbang
    { name:'Kemampuan Bakar Lemak', badge:'Baik', badgeClass:'badge-optimal', pct:35, labels:['Rendah','Normal','Tinggi'], desc:'Kemampuan bakar lemakmu baik. Pertahankan dengan defisit kalori konsisten.' },
    { name:'Respons terhadap Karbohidrat', badge:'Normal', badgeClass:'badge-optimal', pct:50, labels:['Sensitif','Normal','Toleran'], desc:'Respons karbohidratmu seimbang. Tetap variasikan antara karbohidrat kompleks dan sederhana.' },
    { name:'Efisiensi Metabolisme Basal', badge:'Normal', badgeClass:'badge-optimal', pct:50, labels:['Rendah','Normal','Tinggi'], desc:'Metabolisme basalmu dalam kondisi optimal. Pertahankan pola makan sehat & olahraga rutin.' },
    { name:'Toleransi Olahraga', badge:'Baik', badgeClass:'badge-optimal', pct:25, labels:['Rendah','Sedang','Tinggi'], desc:'Tubuhmu merespons baik terhadap berbagai jenis olahraga. Variasikan kardio + latihan kekuatan.' },
    { name:'Konsistensi', badge:'Kunci Utama', badgeClass:'badge-optimal', pct:50, labels:['Rendah','Sedang','Tinggi'], desc:'Metabolismemu sudah baik — kunci keberhasilanmu adalah KONSISTENSI dalam menjalankan program.' }
  ]
};

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
    traitHtml += '<div class="trait-bar-bg"><div class="trait-bar-marker" style="left:' + t.pct + '%"></div></div>';
    traitHtml += '<div class="trait-labels">' + t.labels.map(function(l){ return '<span>' + l + '</span>'; }).join('') + '</div>';
    traitHtml += '<div class="trait-desc">' + t.desc + '</div>';
    traitHtml += '</div>';
  });
  setSafeHTML(document.getElementById('traitBarContent'), traitHtml);
  document.getElementById('traitBarSub').textContent = q.tipeName + ' — ' + traits.length + ' karakteristik';

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
  setSafeHTML(document.getElementById('tipeKarakterContent'), karHtml);
  document.getElementById('tipeKarakterSub').textContent = tipe.name;

  // Skor
  var skor = q.skor || 72;
  document.getElementById('scorePct').textContent = skor + '%';
  document.getElementById('scoreDesc').textContent = 'Program KEMOENIK dengan metode ' + (q.metodeName || q.metode) + ' memiliki kesesuaian ' + skor + '% dengan profil metabolismemu. Semakin konsisten, semakin tinggi efektivitasnya!';

  // Auto-expand semua accordion profil (jangan biarkan user nebak harus klik)
  var profilAccs = ['acc-trait', 'acc-karakter', 'acc-skor'];
  profilAccs.forEach(function(id) {
    var el = document.getElementById(id);
    if (el && !el.classList.contains('on')) el.classList.add('on');
  });
  // Animate skor ring
  setTimeout(animScore, 100);
}

function animScore() {
  var q = appState.quiz;
  var skor = q ? (q.skor || 72) : 72;
  var circumference = 326;
  var offset = circumference - (skor / 100 * circumference);
  document.getElementById('srFill').style.strokeDashoffset = offset;
}

// ============================================================
// TIPS NOTIF
// ============================================================
function renderTipsNotif() {
  var q = appState.quiz;
  if (q) {
    document.getElementById('tipsNotifBanner').style.display = 'flex';
  }
}

// ============================================================
// KALKULATOR
// ============================================================
function hitungKalkulator() {
  var nama = document.getElementById('inputNama').value.trim();
  var gender = document.getElementById('inputGender').value;
  var usia = parseFloat(document.getElementById('inputUsia').value) || 0;
  var berat = parseFloat(document.getElementById('inputBerat').value) || 0;
  var tinggi = parseFloat(document.getElementById('inputTinggi').value) || 0;
  var aktivitas = parseFloat(document.getElementById('inputAktivitas').value) || 0;
  var target = parseFloat(document.getElementById('inputTarget').value) || 0;
  var metode = document.getElementById('inputMetode').value;

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
  var defisit = metode === 'ringan' ? 300 : metode === 'agresif' ? 700 : 500; // sesuai panduan_1
  var dietCal = Math.round(tdee - defisit);
  var penurunanPerMinggu = metode === 'ringan' ? 0.3 : metode === 'agresif' ? 0.7 : 0.5;
  var selisihBB = berat - target;
  var targetMinggu = (penurunanPerMinggu > 0 && selisihBB > 0) ? Math.ceil(selisihBB / penurunanPerMinggu) : 4;

  // Estimasi tanggal
  var today = new Date();
  var estDate = new Date(today.getTime() + targetMinggu * 7 * 24 * 60 * 60 * 1000);
  var estTanggal = estDate.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'});

  // Estimasi lingkar perut (rumus dari BMI)
  var bmi = (tinggi > 0 && berat > 0) ? berat / ((tinggi/100) * (tinggi/100)) : 0;
  var estLingkar;
  if (gender === 'laki') {
    estLingkar = tinggi > 0 ? Math.round(0.722 * bmi + 0.525 * (tinggi/100) * 100 - 48.3 - (selisihBB * 0.8)) : 0;
  } else {
    estLingkar = tinggi > 0 ? Math.round(0.735 * bmi + 0.625 * (tinggi/100) * 100 - 40.2 - (selisihBB * 0.8)) : 0;
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

  // Simpan ke state sementara
  // startDateISO: format YYYY-MM-DD untuk parsing reliable
  // startDate: tetap simpan format display sebagai backward compat
  var startDateISO = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');
  var startDateDisplay = today.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'});

  window._tempKalData = {
    nama: nama.replace(/[<>"'&]/g, ''), gender, usia, berat, tinggi, aktivitas: parseFloat(aktivitas), target, metode,
    dietCal, targetMinggu, estTanggal, estLingkar, bmr: Math.round(bmr), tdee, defisit,
    startDate:    startDateISO,      // ISO format — primary untuk kalkulasi
    startDateISO: startDateISO,      // explicit ISO copy
    startDateDisplay: startDateDisplay  // untuk tampilan
  };
}

async function simpanKalkulator(btnEl) {
  var data = window._tempKalData;
  if (!data) {
    showToast('Klik "Generate Program" terlebih dahulu ya kak!');
    return;
  }

  if (!btnEl) btnEl = document.getElementById('btnSimpanKal');
  var origHtml = btnEl ? btnEl.innerHTML : '';
  if (btnEl) { btnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...'; btnEl.disabled = true; }

  try {
    var wa = appState.user.wa || localStorage.getItem('kemoenik_wa');

    // Cek sudah ada kalkulator?
    if (wa && lsLoad(wa, 'kalkulator') && lsLoad(wa, 'kalkulator').dietCal > 0) {
      showToast('Kalkulator sudah pernah diisi. Gunakan tombol Reset untuk mengulang.');
      if (btnEl) { btnEl.innerHTML = origHtml; btnEl.disabled = false; }
      return;
    }

    state.set('kalkulator', data);
    state.set('user.nama', data.nama);

    if (wa) lsSave(wa, 'kalkulator', data);
    try { localStorage.setItem('kemoenik_kal_data', JSON.stringify(data)); } catch(e) {}

    window._tempKalData = null;

    if (btnEl) {
      btnEl.innerHTML = '<i class="fas fa-check"></i> Tersimpan!';
      setTimeout(() => { btnEl.innerHTML = origHtml; btnEl.disabled = false; }, 1500);
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
    gtag('event', 'kalkulator_saved', { nama: data.nama });

  } catch(e) {
    console.error('simpanKalkulator error:', e);
    showToast('Gagal menyimpan, coba lagi');
    if (btnEl) { btnEl.innerHTML = origHtml; btnEl.disabled = false; }
  }
}

function updateResetButtonVisibility() {
  var hasData = appState.kalkulator && appState.kalkulator.dietCal > 0;
  var btnReset = document.getElementById('btnResetKal');
  if (btnReset) {
    btnReset.style.display = hasData ? 'block' : 'none';
  }
}

async function resetKalkulator() {
  if (!confirm('Yakin reset kalkulator? Data akan dihapus dan bisa isi ulang.')) return;

  var wa = appState.user.wa || localStorage.getItem('kemoenik_wa');

  try {
    if (wa) lsRemove(wa, 'kalkulator');
    localStorage.removeItem('kemoenik_kal_data');
    state.set('kalkulator', null);

    document.getElementById('hasilKalkulator').style.display = 'none';
    document.getElementById('kalkulatorForm').style.display = 'block';
    document.getElementById('inputNama').value = '';
    document.getElementById('inputUsia').value = '';
    document.getElementById('inputBerat').value = '';
    document.getElementById('inputTinggi').value = '';
    document.getElementById('inputTarget').value = '';

    showToast('✅ Kalkulator direset. Silakan isi ulang.');
    updateResetButtonVisibility();
  } catch(e) {
    console.error('resetKalkulator error:', e);
    showToast('Gagal reset, coba lagi');
  }
}

// Load form if data exists
function loadKalkulatorForm() {
  var k = appState.kalkulator;
  var q = appState.quiz;
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
    // Auto-set metode dari hasil kuis jika belum pernah generate kalkulator
    document.getElementById('inputMetode').value = q.metode || 'standar';
    // Tampilkan hint
    var metodeEl = document.getElementById('inputMetode');
    if (metodeEl) {
      metodeEl.style.borderColor = 'var(--green)';
      metodeEl.title = 'Otomatis dari hasil kuis: ' + q.metodeName;
    }
  }
  updateResetButtonVisibility();
  updateQuizResetButtonVisibility();
}

// ============================================================
// EVALUASI MINGGUAN
// ============================================================
var editingEvalIdx = -1;
var condChecked = {};

function toggleCond(el, key) {
  el.classList.toggle('checked');
  condChecked[key] = el.classList.contains('checked');
}

function calcWeeklyLoss() {
  var start = parseFloat(document.getElementById('weekStartWeight').value) || 0;
  var end = parseFloat(document.getElementById('weekEndWeight').value) || 0;
  if (start > 0 && end > 0 && start > end) {
    var loss = (start - end).toFixed(1);
    document.getElementById('weeklyLossValue').textContent = loss + ' kg';
    document.getElementById('weeklyLossResult').style.display = 'block';
  } else {
    document.getElementById('weeklyLossResult').style.display = 'none';
  }
}

async function saveWeeklyEval() {
  var start = parseFloat(document.getElementById('weekStartWeight').value) || 0;
  var end = parseFloat(document.getElementById('weekEndWeight').value) || 0;
  var obstacle = document.getElementById('weeklyObstacle').value;

  if (!start || !end) { showToast('Isi berat awal dan akhir minggu ya kak!'); return; }

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
      minggu: minggu, beratAwal: start, beratAkhir: end, turun: turun,
      obstacle: obstacle || '',
      kondisi: Object.keys(condChecked).filter(function(k){ return condChecked[k]; }).join(','),
      tanggal: tanggal, savedAt: new Date().toISOString()
    };

    if (editingEvalIdx >= 0) {
      appState.evaluasi[editingEvalIdx] = evalData;
      editingEvalIdx = -1;
      document.getElementById('editModeIndicator').style.display = 'none';
      document.getElementById('btnCancelEdit').style.display = 'none';
    } else {
      appState.evaluasi.push(evalData);
    }
    state._persist(); // sync state after mutation

    // Simpan ke localStorage
    var wa = appState.user.wa || localStorage.getItem('kemoenik_wa');
    if (wa) lsSave(wa, 'evaluasi', appState.evaluasi);

    // Reset form
    document.getElementById('weekStartWeight').value = '';
    document.getElementById('weekEndWeight').value = '';
    document.getElementById('weeklyObstacle').value = '';
    document.getElementById('weeklyLossResult').style.display = 'none';
    condChecked = {};
    document.querySelectorAll('.cond-item').forEach(function(el){ el.classList.remove('checked'); });

    renderEvalHome();
    renderEvalHistory();
    renderHomeStats();

    var lbl = 'Minggu ke-' + minggu;
    document.getElementById('evalWeekDisplay').textContent = lbl;
    document.getElementById('piSubEval').textContent = 'Terakhir: ' + lbl + ' | -' + turun + ' kg';

    showToast('✅ Evaluasi Minggu ke-' + minggu + ' berhasil disimpan! -' + turun + ' kg 💪');
  } catch(e) {
    console.error('saveWeeklyEval error:', e);
    showToast('Gagal menyimpan evaluasi, coba lagi');
  }
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

function renderEvalHistory() {
  var container = document.getElementById('weeklyHistoryList');
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
  document.getElementById('weekStartWeight').value = e.beratAwal;
  document.getElementById('weekEndWeight').value = e.beratAkhir;
  document.getElementById('weeklyObstacle').value = e.obstacle || '';
  document.getElementById('editWeekNumber').textContent = e.minggu;
  document.getElementById('editModeIndicator').style.display = 'block';
  document.getElementById('btnCancelEdit').style.display = 'block';
  editingEvalIdx = idx;
  calcWeeklyLoss();
}

