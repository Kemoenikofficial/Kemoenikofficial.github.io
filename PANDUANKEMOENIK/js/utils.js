// ============================================================
// FUNGSI UTILITAS - KEMOENIK
// ============================================================

// ========== NORMALISASI NOMOR WA ==========
function normalizeWA(wa) {
    return wa.replace(/\D/g, '');
}

// ========== TOAST SEDERHANA ==========
function showToast(msg) {
    // Bisa diganti dengan notifikasi yang lebih baik
    alert(msg);
}

// ========== ESCAPE HTML ==========
function escHtml(str) {
    return String(str).replace(/[&<>"]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        if (m === '"') return '&quot;';
        return m;
    });
}

// ========== SET HTML AMAN ==========
function setSafeHTML(el, html) {
    if (el) el.innerHTML = html;
}

// ========== AMBIL PARAMETER URL ==========
function getQueryParam(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// ========== NAVIGASI KE HALAMAN AKTIVITAS ==========
function goToAktivitas() {
    // Ganti dengan URL aktivitas yang sebenarnya
    window.location.href = 'https://example.com/aktivitas';
}

// ========== BUKA LINK PEMBELIAN ==========
function openBeli() {
    // Bisa langsung buka link Shopee/Tokopedia
    window.open('https://s.shopee.co.id/4VXlRpSx3t', '_blank');
}

// ========== DRAWER ==========
function closeDrawer() {
    var drawer = document.getElementById('drawer');
    var overlay = document.getElementById('overlay');
    if (drawer) drawer.classList.remove('on');
    if (overlay) overlay.classList.remove('on');
}

function openDrawer() {
    var drawer = document.getElementById('drawer');
    var overlay = document.getElementById('overlay');
    if (drawer) drawer.classList.add('on');
    if (overlay) overlay.classList.add('on');
}

// ========== PANEL MODAL ==========
function openPanel(panelId) {
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add('on');
}

function closePanel(panelId) {
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.remove('on');
}

// ========== REMINDER ==========
function dismissReminder() {
    var rem = document.getElementById('inAppReminder');
    if (rem) rem.style.display = 'none';
    localStorage.setItem('kemoenik_reminder_dismissed', new Date().toDateString());
}

function markReminderDone() {
    dismissReminder();
    showToast('Terima kasih!');
}

function snoozeReminder() {
    dismissReminder();
    setTimeout(function() {
        var rem = document.getElementById('inAppReminder');
        if (rem) rem.style.display = 'block';
    }, 15 * 60 * 1000); // 15 menit
}

// ========== BUKA FAQ DI HOME ==========
function openFaq() {
    go('home');
    setTimeout(function() {
        var faqSection = document.getElementById('faqHomeSection');
        if (faqSection) faqSection.scrollIntoView({ behavior: 'smooth' });
    }, 200);
}

// ========== FUNGSI LAIN YANG MUNGKIN DIPERLUKAN ==========
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export ke global (dengan var)
window.normalizeWA = normalizeWA;
window.showToast = showToast;
window.escHtml = escHtml;
window.setSafeHTML = setSafeHTML;
window.getQueryParam = getQueryParam;
window.goToAktivitas = goToAktivitas;
window.openBeli = openBeli;
window.closeDrawer = closeDrawer;
window.openDrawer = openDrawer;
window.openPanel = openPanel;
window.closePanel = closePanel;
window.dismissReminder = dismissReminder;
window.markReminderDone = markReminderDone;
window.snoozeReminder = snoozeReminder;
window.openFaq = openFaq;