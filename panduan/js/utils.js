// utils.js – Fungsi utilitas untuk localStorage dan validasi

const STORAGE_KEYS = {
    USER: 'kemoenik_user',
    CHECKLIST: 'kemoenik_checklist',
    PROGRESS: 'kemoenik_progress'
};

// Menyimpan data user (nomor WA)
function saveUser(wa) {
    const user = { wa, loginDate: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
}

// Mengambil data user
function getUser() {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
}

// Menyimpan status checklist
function saveChecklist(checkedIds) {
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checkedIds));
}

// Mengambil status checklist
function getChecklist() {
    const data = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    return data ? JSON.parse(data) : [];
}

// Menyimpan progress (misal hari ke berapa)
function saveProgress(day) {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify({ day }));
}

// Mengambil progress
function getProgress() {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : { day: 1 };
}

// Memformat nomor WA menjadi standar internasional (opsional)
function formatWA(wa) {
    // Hanya angka
    let cleaned = wa.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.slice(1);
    } else if (cleaned.startsWith('8')) {
        cleaned = '62' + cleaned;
    }
    return cleaned;
}

// Validasi nomor WA sederhana (minimal 10 digit)
function isValidWA(wa) {
    const digits = wa.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
}

// Menghitung hari ke-berapa dari tanggal pertama login
function calculateCurrentDay(startDateISO) {
    const start = new Date(startDateISO);
    const today = new Date();
    start.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = today - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
}
