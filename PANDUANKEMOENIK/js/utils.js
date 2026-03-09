/*
 * utils.js — KEMOENIK
 * Access Control, Voucher, initApp, Navigation, Panels, Toast, Utilities
 * Depends on: data.js
 */

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
    var voucher = getQueryParam('voucher') || localStorage.getItem('kemoenik_voucher') || '';
    var mode = getQueryParam('mode') || 'continue';

    if (!wa) wa = localStorage.getItem('kemoenik_temp_wa') || '';
    if (!voucher) voucher = localStorage.getItem('kemoenik_temp_voucher') || '';

    if (!wa || !voucher) {
      document.getElementById('accessScreen').style.display = 'flex';
      return;
    }

    var normalizedWA = normalizeWA(wa);

    localStorage.setItem('kemoenik_wa', normalizedWA);
    localStorage.setItem('kemoenik_voucher', voucher);
    localStorage.setItem('kemoenik_mode', mode);

    document.getElementById('accessScreen').style.display = 'none';
    document.getElementById('loadingScreen').style.display = 'flex';

    // Load data dari localStorage (berdasarkan nomor WA)
    var userData = DataService.loadUserData(normalizedWA);

    // Handle mode "new" — reset program, keep profile
    if (mode === 'new' && userData) {
      DataService.resetProgram(normalizedWA);
      userData = { profile: userData.profile };
    }

    // Sync ke appState dari data tersimpan
    if (userData) {
      if (userData.kalkulator) {
        state.set('kalkulator', {
          dietCal: userData.kalkulator.dietCal,
          targetMinggu: userData.kalkulator.targetMinggu,
          target: userData.kalkulator.target,
          estTanggal: userData.kalkulator.estTanggal,
          estLingkar: userData.kalkulator.estLingkar,
          nama: userData.kalkulator.nama || (userData.profile ? userData.profile.nama : '') || '',
          bmr: userData.kalkulator.bmr,
          tdee: userData.kalkulator.tdee,
          defisit: userData.kalkulator.defisit,
          metode: userData.kalkulator.metode,
          startDate: userData.kalkulator.startDate,
          startDateISO: userData.kalkulator.startDateISO
        });
      }

      if (userData.quiz) {
        state.set('quiz', {
          tipe: userData.quiz.tipe,
          tipeName: userData.quiz.tipeName,
          metode: userData.quiz.metode,
          metodeName: userData.quiz.metodeName,
          skor: userData.quiz.skor,
          tagline: userData.quiz.tagline,
          tipe_emoji: userData.quiz.tipe_emoji
        });
      }

      if (userData.evaluasi && Array.isArray(userData.evaluasi)) {
        state.set('evaluasi', userData.evaluasi);
      }

      if (userData.profile) {
        state.set('user.nama', userData.profile.nama);
        state.set('user.wa', normalizedWA);
      }
    }

    // Set WA di state
    state.set('user.wa', normalizedWA);

    if (appState.kalkulator && appState.kalkulator.nama) {
      state.set('user.nama', appState.kalkulator.nama);
      appState.user.nama = appState.kalkulator.nama;
    }

    state._persist();

    // Simpan/update profile ke localStorage
    DataService.saveProfile(normalizedWA, {
      nama: appState.user.nama || 'User',
      wa: normalizedWA,
      voucherAktif: voucher,
      lastActive: new Date().toISOString()
    });

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

  // Pill nav (4 pills: home, profil, tips, program)
  var pills = document.querySelectorAll('.pill');
  var pillMap = {home:0, profil:1, tips:2, program:3};
  if (pillMap[page] !== undefined && pills[pillMap[page]]) pills[pillMap[page]].classList.add('on');

  // Bottom nav
  var bn = document.getElementById('bn-' + page);
  if (bn) bn.classList.add('on');

  // Drawer
  var di = document.getElementById('di-' + page);
  if (di) di.classList.add('on');

  // Re-render profil setiap kali dibuka agar selalu fresh
  if (page === 'profil') renderProfilPage();

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
