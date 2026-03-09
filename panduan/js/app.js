// app.js – Logika utama aplikasi

// Inisialisasi state
let currentUser = null;
let currentChecklist = [];
let currentDay = 1;
const totalDays = 30; // bisa disesuaikan

// Elemen DOM
const screens = {
    onboarding: document.getElementById('onboarding'),
    login: document.getElementById('login'),
    dashboard: document.getElementById('dashboard')
};

// Event Listeners
document.getElementById('startBtn').addEventListener('click', () => {
    showScreen('login');
});

document.getElementById('loginBtn').addEventListener('click', handleLogin);

// Navigasi materi
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.dataset.page;
        setActiveNav(page);
        renderContent(page);
    });
});

// Fungsi menampilkan screen
function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Login handler
function handleLogin() {
    const waInput = document.getElementById('waInput');
    const wa = waInput.value.trim();
    const errorEl = document.getElementById('loginError');

    if (!isValidWA(wa)) {
        errorEl.textContent = 'Nomor WhatsApp tidak valid. Masukkan minimal 10 digit.';
        return;
    }

    const formattedWA = formatWA(wa);
    const user = saveUser(formattedWA);
    currentUser = user;

    // Inisialisasi checklist kosong jika belum ada
    currentChecklist = getChecklist();
    if (currentChecklist.length === 0) {
        currentChecklist = [];
    }

    // Hitung hari ke-berapa (berdasarkan tanggal login)
    const startDate = user.loginDate;
    currentDay = calculateCurrentDay(startDate);
    saveProgress(currentDay);

    // Update UI
    document.getElementById('userName').textContent = `+${formattedWA.slice(0,4)}...`;
    document.getElementById('currentDay').textContent = currentDay;
    document.getElementById('totalDays').textContent = totalDays;
    updateProgressBar();

    renderChecklist();
    renderContent('tips'); // default halaman tips

    showScreen('dashboard');
}

// Render checklist
function renderChecklist() {
    const container = document.getElementById('checklistContainer');
    container.innerHTML = '';

    dailyActivities.forEach(act => {
        const isChecked = currentChecklist.includes(act.id);
        const item = document.createElement('div');
        item.className = `checklist-item ${isChecked ? 'checked' : ''}`;
        item.dataset.id = act.id;
        item.innerHTML = `
            <div class="checkbox">${isChecked ? '✓' : ''}</div>
            <div class="content">
                <div class="title">${act.title}</div>
                <div class="desc">${act.desc}</div>
            </div>
        `;
        item.addEventListener('click', () => toggleChecklist(act.id));
        container.appendChild(item);
    });
}

// Toggle checklist item
function toggleChecklist(id) {
    if (currentChecklist.includes(id)) {
        currentChecklist = currentChecklist.filter(i => i !== id);
    } else {
        currentChecklist.push(id);
    }
    saveChecklist(currentChecklist);
    renderChecklist();
    // Update progress bar mungkin berdasarkan jumlah checklist tercentang?
    // Bisa dihitung persentase checklist
    updateProgressBar();
}

// Update progress bar (contoh berdasarkan checklist)
function updateProgressBar() {
    const percent = (currentChecklist.length / dailyActivities.length) * 100;
    document.getElementById('progressFill').style.width = percent + '%';
}

// Render konten materi berdasarkan tab
function renderContent(page) {
    const area = document.getElementById('content-area');
    let html = '';

    if (page === 'tips') {
        materi.tips.forEach(tip => {
            html += `
                <div class="article-card">
                    <h3>${tip.judul}</h3>
                    <p>${tip.konten}</p>
                </div>
            `;
        });
    } else if (page === 'program') {
        materi.program.forEach(prog => {
            html += `<div class="article-card"><h3>${prog.judul}</h3>`;
            if (prog.fase) {
                html += '<ul>' + prog.fase.map(f => `<li>${f}</li>`).join('') + '</ul>';
            } else if (prog.items) {
                html += '<ul>' + prog.items.map(i => `<li>${i}</li>`).join('') + '</ul>';
            }
            html += '</div>';
        });
    } else if (page === 'faq') {
        materi.faq.forEach((faq, index) => {
            html += `
                <div class="faq-item" data-index="${index}">
                    <div class="faq-question">
                        ${faq.pertanyaan}
                        <span class="toggle">+</span>
                    </div>
                    <div class="faq-answer">${faq.jawaban}</div>
                </div>
            `;
        });
        // Tambahkan event listener untuk FAQ setelah dimasukkan ke DOM
        setTimeout(() => {
            document.querySelectorAll('.faq-question').forEach(q => {
                q.addEventListener('click', (e) => {
                    const item = e.currentTarget.closest('.faq-item');
                    item.classList.toggle('open');
                    const toggle = item.querySelector('.toggle');
                    toggle.textContent = item.classList.contains('open') ? '−' : '+';
                });
            });
        }, 0);
    }

    area.innerHTML = html;
}

// Set active nav
function setActiveNav(page) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });
}

// Cek apakah user sudah login sebelumnya
function checkExistingSession() {
    const user = getUser();
    if (user) {
        currentUser = user;
        currentChecklist = getChecklist();
        const savedProgress = getProgress();
        currentDay = savedProgress.day;

        document.getElementById('userName').textContent = `+${user.wa.slice(0,4)}...`;
        document.getElementById('currentDay').textContent = currentDay;
        document.getElementById('totalDays').textContent = totalDays;
        updateProgressBar();
        renderChecklist();
        renderContent('tips');
        showScreen('dashboard');
    } else {
        showScreen('onboarding');
    }
}

// Jalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', checkExistingSession);
