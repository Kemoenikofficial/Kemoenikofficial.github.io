// ============================================================
// KEMOENIK - UTILITY FUNCTIONS
// ============================================================

// Escape HTML untuk keamanan
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Set innerHTML dengan aman
function setSafeHTML(el, html) {
  if (!el) return;
  el.innerHTML = '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  while (tmp.firstChild) el.appendChild(tmp.firstChild);
}

// Normalisasi nomor WA ke format internasional (62)
function normalizeWA(wa) {
  wa = wa.replace(/\D/g, '');
  if (wa.startsWith('08')) return '62' + wa.substring(1);
  if (wa.startsWith('+62')) return wa.substring(1);
  if (wa.startsWith('62')) return wa;
  if (wa.startsWith('0')) return '62' + wa.substring(1);
  return wa;
}

// Toast notifikasi
function showToast(msg) {
  const existing = document.getElementById('appToast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'appToast';
  toast.textContent = msg;
  toast.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#1A3A1F;color:white;padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.3);max-width:85vw;text-align:center;animation:toastIn 0.3s ease;';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Panel modal
function openPanel(id) {
  const panel = document.getElementById(id);
  if (!panel) return;

  // Hook khusus panel
  if (id === 'panelKalkulator') {
    const kalNotif = document.getElementById('kalNotifKuis');
    if (kalNotif) kalNotif.style.display = appState.quiz ? 'none' : 'block';
    if (!window._tempKalData) {
      document.getElementById('hasilKalkulator').style.display = 'none';
      document.getElementById('kalkulatorForm').style.display = 'block';
      loadKalkulatorForm();
    }
  }
  if (id === 'panelEvaluasi') {
    const n = appState.evaluasi.length + 1;
    const weekLabel = editingEvalIdx >= 0 ? 'Edit Minggu ke-' + appState.evaluasi[editingEvalIdx].minggu : 'Evaluasi Minggu ke-' + n;
    document.getElementById('evalWeekDisplay').textContent = weekLabel;
    renderEvalHistory();
  }
  if (id === 'panelMenu') renderMenuHarian();
  if (id === 'panelJadwalOlahraga') renderJadwalOlahraga();
  if (id === 'panelPanduanLengkap') {
    const el = document.getElementById('targetKcalLengkap');
    if (el) el.textContent = appState.kalkulator ? Math.round(appState.kalkulator.dietCal) : '—';
  }

  panel.classList.add('on');
  document.body.style.overflow = 'hidden';
  gtag('event', 'open_panel', { panel: id });
}

function closePanel(id) {
  const panel = document.getElementById(id);
  if (panel) panel.classList.remove('on');
  document.body.style.overflow = '';
}

// Drawer
function openDrawer() {
  document.getElementById('drawer').classList.add('on');
  document.getElementById('overlay').classList.add('on');
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('on');
  document.getElementById('overlay').classList.remove('on');
}

// Beli modal
function openBeli() { openPanel('modalBeli'); }

// Navigasi
function goToAktivitas() {
  window.location.href = 'aktivitas.html';
}

// Get today's date string (YYYY-MM-DD)
function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

// In-app reminder
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
function showInAppReminder(title, body) {
  const today = new Date().toDateString();
  const dismissed = localStorage.getItem('kemoenik_reminder_dismissed');
  if (dismissed === today) return;
  document.getElementById('reminderTitle').textContent = title;
  document.getElementById('reminderBody').textContent = body;
  document.getElementById('inAppReminder').style.display = 'block';
}
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

// Format tanggal
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
