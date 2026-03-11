
// ============================================================
// LOGIKA UTAMA APLIKASI
// ============================================================

// ========== INISIALISASI INSTANT (NO LOADING) ==========
function initApp() {
    try {
        // 0. Load state dari kemoenik_state_v2 DULU (agar appState terisi sebelum render)
        state.loadFromStorage();

        // 1. Ambil dari localStorage (SYNC - instant)
        var wa = localStorage.getItem('kemoenik_wa') || '';
        var voucher = localStorage.getItem('kemoenik_voucher') || '';
        var expiry = localStorage.getItem('kemoenik_expiry') || '';
        var mode = localStorage.getItem('kemoenik_mode') || 'continue';

        // 2. Fallback: cek URL params (untuk first load dari aktivitas)
        if (!wa || !voucher) {
            wa = getQueryParam('wa') || '';
            voucher = getQueryParam('voucher') || '';
            mode = getQueryParam('mode') || 'continue';
 
            // Jika dari URL, simpan ke localStorage
            if (wa && voucher) {
                localStorage.setItem('kemoenik_wa', wa);
                localStorage.setItem('kemoenik_voucher', voucher);
                localStorage.setItem('kemoenik_mode', mode);
                localStorage.setItem('kemoenik_expiry', String(Date.now() + 7 * 24 * 60 * 60 * 1000));
            }
        }

        // 3. Validasi - jika tidak ada session
        if (!wa || !voucher) {
            document.getElementById('accessScreen').style.display = 'flex';
            document.getElementById('app').style.display = 'none';
            return;
        }

        // 4. Cek expiry
        if (expiry && Date.now() > parseInt(expiry)) {
            // Session expired
            localStorage.removeItem('kemoenik_wa');
            localStorage.removeItem('kemoenik_voucher');
            localStorage.removeItem('kemoenik_expiry');
            document.getElementById('accessScreen').style.display = 'flex';
            document.getElementById('app').style.display = 'none';
            showToast('Sesi habis. Silakan verifikasi ulang.');
            return;
        }

        // 5. ✅ TAMPILKAN APP INSTANTLY (tidak tunggu verifikasi server)
        document.getElementById('accessScreen').style.display = 'none';
        document.getElementById('app').style.display = 'flex';

        // 6. Load data dari localStorage (SYNC)
        var normalizedWA = normalizeWA(wa);
        var userData = DataService.loadUserData(normalizedWA);

        // 6b. Migrasi: jika data tidak ditemukan dengan normalized key,
        // coba load dengan raw WA, lalu pindahkan ke normalized key
        if (!userData && wa !== normalizedWA) {
            var oldData = DataService.loadUserData(wa);
            if (oldData) {
                userData = oldData;
                DataService.saveUserData(normalizedWA, oldData); // migrasi ke key baru
                console.log('Migrasi data dari key lama ke normalized key berhasil');
            }
        }

        // 7. Handle mode "new" — reset program
        if (mode === 'new' && userData) {
            DataService.resetProgram(normalizedWA);
            userData = { profile: userData.profile };
        }

        // 8. Sync ke appState
        // SELALU set user.wa ke normalizedWA agar save/load key konsisten
        state.set('user.wa', normalizedWA);
        if (userData) {
            if (userData.kalkulator) state.set('kalkulator', userData.kalkulator);
            if (userData.quiz) state.set('quiz', userData.quiz);
            if (userData.evaluasi) state.set('evaluasi', userData.evaluasi);
            if (userData.misiChecked) state.set('misiChecked', userData.misiChecked);
            if (userData.profile && userData.profile.nama) {
                state.set('user.nama', userData.profile.nama);
            }
        }

        // 9. Fallback localStorage lama (untuk backward compatibility)
        if (!appState.kalkulator) {
            try {
                var raw = localStorage.getItem('kemoenik_kal_data');
                if (raw) {
                    var p = JSON.parse(raw);
                    if (p && (p.dietCal || p.kaloriHarian)) {
                        if (!p.dietCal && p.kaloriHarian) p.dietCal = p.kaloriHarian;
                        state.set('kalkulator', p);
                    }
                }
            } catch(e) {}
        }
        if (!appState.quiz) {
            try {
                var rawQ = localStorage.getItem('kemoenik_quiz');
                if (rawQ) {
                    var pq = JSON.parse(rawQ);
                    if (pq && pq.tipe) state.set('quiz', pq);
                }
            } catch(e) {}
        }
        // 9b. Fallback tambahan: cek langsung dari kemoenik_state_v2 jika userData kosong
        if (!appState.kalkulator || !appState.quiz) {
            try {
                var sv2 = localStorage.getItem('kemoenik_state_v2');
                if (sv2) {
                    var sv2p = JSON.parse(sv2);
                    if (!appState.kalkulator && sv2p.kalkulator) state.set('kalkulator', sv2p.kalkulator);
                    if (!appState.quiz && sv2p.quiz) state.set('quiz', sv2p.quiz);
                    if (!appState.evaluasi || appState.evaluasi.length === 0) {
                        if (sv2p.evaluasi && sv2p.evaluasi.length > 0) state.set('evaluasi', sv2p.evaluasi);
                    }
                    if (sv2p.misiChecked) state.set('misiChecked', Object.assign({}, appState.misiChecked, sv2p.misiChecked));
                }
            } catch(e) {}
        }

        if (appState.kalkulator && appState.kalkulator.nama) {
            state.set('user.nama', appState.kalkulator.nama);
        }

        state._persist();

        // 10. Simpan profile
        DataService.saveProfile(normalizedWA, {
            nama: appState.user.nama || 'User',
            wa: normalizedWA,
            voucherAktif: voucher,
            lastActive: new Date().toISOString()
        });

        // 11. ✅ RENDER LANGSUNG (NO setTimeout delay)
        renderAll();
        renderHomeJadwal(); // Langsung, tanpa setTimeout 150ms

        // 12. Background verification (opsional, tidak block UI)
        setTimeout(function() {
            backgroundVerify(normalizedWA, voucher);
        }, 3000); // Delay 3 detik, setelah UI stabil

        // 13. Handle quiz just finished
        if (localStorage.getItem('kemoenik_just_finished_quiz') === 'true') {
            localStorage.removeItem('kemoenik_just_finished_quiz');
            setTimeout(function() {
                renderProfilPage();
                ['acc-trait','acc-karakter','acc-skor'].forEach(function(id) {
                    var el = document.getElementById(id);
                    if (el) el.classList.add('on');
                });
            }, 100); // Reduced from 200ms
        }

    } catch(e) {
        console.error('initApp error:', e);
        showToast('Gagal memuat aplikasi. Coba refresh halaman.');
    }
}

// ✅ TAMBAHAN: Background verification (tidak block UI)
async function backgroundVerify(wa, voucher) {
    try {
        var result = await checkVoucherValid(wa, voucher);
        if (!result.valid && !result.fallback) {
            // Hanya show toast, tidak block UI
            showToast('Info: ' + result.message);
            // Optional: bisa redirect ke aktivitas setelah beberapa saat
            // setTimeout(function() { goToAktivitas(); }, 5000);
        }
    } catch(e) {
        console.log('Background verify error (offline mode):', e);
    }
}

// ========== NAVIGASI ==========
function go(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.bn').forEach(b => b.classList.remove('on'));
  document.querySelectorAll('.d-item').forEach(d => d.classList.remove('on'));

  var pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('on');

  var pills = document.querySelectorAll('.pill');
  var pillMap = {home:0, profil:1, tips:2, program:3};
  if (pillMap[page] !== undefined && pills[pillMap[page]]) pills[pillMap[page]].classList.add('on');

  var bn = document.getElementById('bn-' + page);
  if (bn) bn.classList.add('on');

  var di = document.getElementById('di-' + page);
  if (di) di.classList.add('on');

  if (page === 'profil') renderProfilPage();

  var content = document.getElementById('content');
  if (content) content.scrollTo({top: 0, behavior:'smooth'});

  gtag('event', 'page_view', { page_title: page });
}

// ========== RENDER ALL ==========
function renderAll() {
  renderHomeStats();
  renderHomeGreeting();
  renderProgress();
  renderEvalHome();
  renderFAQ();
  renderProfilPage();
  renderTipsNotif();
  renderTipsKonten();
  renderJadwalOlahraga();
  renderMenuHarian();
  renderDrawer();
  renderHomeJadwal();
  renderStartStopBtn();
  renderStatusIndikator();
  renderMakroShortcut();
  renderMisiByProgram();

  var kuisNotif = document.getElementById('kuisFirstNotif');
  if (kuisNotif) kuisNotif.style.display = appState.quiz ? 'none' : 'flex';
}

function renderDrawer() {
  var k = appState.kalkulator;
  var nama = k ? k.nama : (appState.user.nama || '—');
  document.getElementById('dName').textContent = nama || '—';
  var dSub = appState.quiz ? appState.quiz.tipeName : 'Program Diet KEMOENIK';
  document.getElementById('dSub').textContent = dSub;
}

// ========== HOME STATS ==========
function renderHomeStats() {
  var k = appState.kalkulator;
  var q = appState.quiz;

  var nama = k ? (k.nama || '—') : (q ? (q.nama || '—') : '—');
  document.getElementById('userName').textContent = nama.split(' ')[0] || '—';
  document.getElementById('dName').textContent = nama || '—';

  if (q) {
    document.getElementById('heroName').innerHTML = escHtml(q.tipeName) + ' <span>' + escHtml(q.tipe_emoji) + '</span>';
    document.getElementById('heroTypeName').textContent = '';
    document.getElementById('heroBadge').textContent = q.metode === 'agresif' ? '🔥 Agresif' : q.metode === 'ringan' ? '🐢 Ringan' : '⚖️ Standar';
    // No. 2: Isi METODE dari hasil kuis - tampilkan label lengkap
    var metodeDisplayMap = { 'standar': 'Standar', 'agresif': 'Agresif', 'ringan': 'Ringan', 'if': 'IF 16:8' };
    var metodeText = metodeDisplayMap[q.metode] || q.metodeName || q.metode || '—';
    document.getElementById('statMetode').textContent = metodeText;
    // No. 1: Isi SKOR & AKURASI dari hasil kuis metabolisme
    var skorEl = document.getElementById('statSkor');
    if (skorEl) {
      var skorVal = q.skor || q.akurasi || q.score || null;
      skorEl.textContent = skorVal ? (String(skorVal).replace('%','') + '%') : '—';
    }
  } else {
    // Jika belum ada quiz, tampilkan dash
    var sEl = document.getElementById('statSkor');
    var mEl = document.getElementById('statMetode');
    if (sEl) sEl.textContent = '—';
    if (mEl) mEl.textContent = '—';
  }

  if (k) {
    document.getElementById('statKkal').textContent = k.dietCal ? Math.round(k.dietCal).toLocaleString('id') : '—';
    // statMinggu sudah diganti statSkor di header (tidak perlu set)
    document.getElementById('estMinggu').textContent = k.targetMinggu ? k.targetMinggu + ' minggu' : '—';
    document.getElementById('estTanggal').textContent = k.estTanggal || '—';
    // estLingkar simpan sebagai estimasi hasil akhir, tampilkan selisih dari berat awal
    var selisihKg = k.berat && k.target ? (parseFloat(k.berat) - parseFloat(k.target)) : 0;
    var penguranganLingkar = selisihKg > 0 ? (selisihKg * 1.5).toFixed(1) : 0;
    document.getElementById('estLingkar').textContent = penguranganLingkar > 0 ? '-' + penguranganLingkar + ' cm' : (k.estLingkar ? k.estLingkar + ' cm' : '—');

    var startDisplay = k.startDateDisplay || k.startDate || '';
    if (!k.startDateDisplay && k.startDateISO) {
      try {
        var sd = new Date(k.startDateISO);
        if (!isNaN(sd)) startDisplay = sd.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'});
      } catch(e) {}
    }

    document.getElementById('progNama').textContent = (nama || '—') + (q ? ' — ' + q.tipeName : '');
    document.getElementById('progDesc').textContent = 'Mulai: ' + (startDisplay || '—') + ' | Target: ' + (k.target || '—') + ' kg';
    document.getElementById('piSubKalori').textContent = k.dietCal ? Math.round(k.dietCal) + ' kkal/hari • ' + k.targetMinggu + ' minggu' : 'Hitung kebutuhan kalori & target mingguanmu';
    document.getElementById('piSubTimeline').textContent = k.startDate ? 'Mulai ' + (startDisplay || k.startDate) + ' → ' + k.estTanggal : 'Fase & jadwal program dietmu';
    document.getElementById('progNotif').style.display = 'flex';
  }

  var evalTargetEl = document.getElementById('evalTarget');
  if (evalTargetEl) evalTargetEl.textContent = k && k.target ? k.target + ' kg' : '—';
  if (document.getElementById('mealTargetDisplay')) document.getElementById('mealTargetDisplay').textContent = k ? Math.round(k.dietCal) : '—';
  if (document.getElementById('targetKcalLengkap')) document.getElementById('targetKcalLengkap').textContent = k ? Math.round(k.dietCal) : '—';

  // ---- Program Banner (halaman Program) ----
  if (k && q) {
    var metodeMap = { 'standar': 'Standar', 'agresif': 'Agresif + IF 16:8', 'ringan': 'Ringan' };
    var defisitLabel = k.defisit ? k.defisit + ' kkal/hari' : '500 kkal/hari';
    document.getElementById('progNama').textContent = q.tipe_emoji + ' ' + q.tipeName;
    document.getElementById('progDesc').textContent = 'Metode: ' + (metodeMap[q.metode] || q.metodeName) + '  •  Defisit: ' + defisitLabel;
  } else if (q) {
    document.getElementById('progNama').textContent = q.tipe_emoji + ' ' + q.tipeName;
    document.getElementById('progDesc').textContent = 'Isi kalkulator untuk aktivasi program lengkap';
  } else if (k) {
    document.getElementById('progNama').textContent = k.nama || '—';
    document.getElementById('progDesc').textContent = 'Isi kuis untuk mendapat rekomendasi metode diet';
  }

  // ---- Makronutrisi shortcut ----
  renderMakroShortcut();

  // ---- Status indikator ----
  renderStatusIndikator();
}

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

function renderProgress() {
  var k = appState.kalkulator;
  if (!k || (!k.startDate && !k.startDateISO)) {
    document.getElementById('progHari').textContent = '—';
    document.getElementById('progTotal').textContent = '—';
    document.getElementById('progPct').textContent = '—%';
    document.getElementById('progTotalLabel').textContent = '—';
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
      var monthMap = { jan:0, feb:1, mar:2, apr:3, mei:4, jun:5, jul:6, agu:7, sep:8, okt:9, nov:10, des:11,
        januari:0, februari:1, maret:2, april:3, juni:5, juli:6, agustus:7, september:8, oktober:9, november:10, desember:11 };
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
    console.warn('renderProgress: invalid startDate, using today');
    start = new Date();
  }

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
  if (document.getElementById('timelineStartDate')) {
    document.getElementById('timelineStartDate').textContent = displayStart;
    document.getElementById('timelineEndDate').textContent = k.estTanggal || '—';
  }
}

function renderEvalHome() {
  var evals = appState.evaluasi;
  if (!evals || !evals.length) {
    document.getElementById('evalMingguLabel').textContent = '—';
    document.getElementById('evalPenurunan').textContent = '— kg';
    document.getElementById('evalBerat').textContent = '— kg';
    return;
  }

  var totalTurun = 0;
  evals.forEach(e => totalTurun += (e.turun || 0));
  var last = evals[evals.length - 1];

  document.getElementById('evalMingguLabel').textContent = 'Minggu ' + (evals.length);
  document.getElementById('evalPenurunan').textContent = '-' + totalTurun.toFixed(1) + ' kg';
  document.getElementById('evalBerat').textContent = last.beratAkhir ? last.beratAkhir + ' kg' : '— kg';
  renderEvalHistory();
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
    html += '<button onclick="editEval(' + realIdx + ')" style="padding:5px 10px;background:var(--offwhite);border:1px solid var(--border);border-radius:6px;font-size:11px;cursor:pointer;font-family:inherit;color:var(--green2);">✏ Edit</button>';
    html += '<button onclick="hapusEval(' + realIdx + ')" style="padding:5px 10px;background:#FEF2F2;border:1px solid #FECACA;border-radius:6px;font-size:11px;cursor:pointer;font-family:inherit;color:#DC2626;">🗑 Hapus</button>';
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

// ========== MISSION ==========
function setMissionMode(mode) {
  document.querySelectorAll('.mission-set').forEach(s => s.classList.remove('show'));
  document.querySelectorAll('.mm-btn, .prog-selector-btn').forEach(b => {
    b.classList.remove('on');
    b.classList.remove('active');
    b.classList.add('inactive');
  });
  if (mode === 'normal') {
    var misiNormal = document.getElementById('misiNormal');
    if (misiNormal) misiNormal.classList.add('show');
    var btnNormal = document.getElementById('modeNormal') || document.getElementById('btnProgNormal');
    if (btnNormal) { btnNormal.classList.add('on'); btnNormal.classList.add('active'); btnNormal.classList.remove('inactive'); }
    renderMisiNormal();
  } else {
    var misiIF = document.getElementById('misiIF');
    if (misiIF) misiIF.classList.add('show');
    var btnIF = document.getElementById('modeIF') || document.getElementById('btnProgIF');
    if (btnIF) { btnIF.classList.add('on'); btnIF.classList.add('active'); btnIF.classList.remove('inactive'); }
    renderMisiIF();
  }
  localStorage.setItem('kemoenik_mission_mode', mode);
}

function renderMisiNormal() {
  var hariIdx = new Date().getDay();
  var hariMap = [6,0,1,2,3,4,5];
  var metode = (appState.quiz && appState.quiz.metode) ? appState.quiz.metode : 'standar';
  var jadwal = targetOlahragaData[metode] || targetOlahragaData.standar;
  var todayOlahraga = jadwal[hariMap[hariIdx]];
  var isRest = todayOlahraga && (todayOlahraga.aktivitas.indexOf('Istirahat') !== -1 || todayOlahraga.aktivitas.indexOf('recovery') !== -1);
  var todayKey = new Date().toDateString();
  var wa = localStorage.getItem('kemoenik_wa') || '';

  var misiList = [
    { icon:'💊', text:'Minum KEMOENIK pagi (3 kapsul sesudah sarapan)' },
    { icon:'💊', text:'Minum KEMOENIK sore (3 kapsul sesudah makan sore)' },
    { icon:'💧', text:'Minum air putih minimal 2 liter hari ini' },
    { icon: isRest ? '😴' : '💪', text: isRest ? 'Hari istirahat — lakukan Lymphatic ringan malam ini' : (todayOlahraga ? todayOlahraga.aktivitas : 'Olahraga sesuai jadwal program') },
    { icon:'🍽️', text:'Makan sesuai panduan menu & target kalori harian' },
    { icon:'🌙', text:'Tidur cukup 7–8 jam malam ini' }
  ];

  var html = '';
  misiList.forEach(function(m, i) {
    var misiKey = 'normal_' + i + '_' + todayKey;
    var checked = appState.misiChecked && appState.misiChecked[misiKey];
    html += "<div class=\"mission-item\" onclick=\"toggleMisi('" + misiKey + "', this)\">";
    html += '<div class="mission-check' + (checked ? ' checked' : '') + '">';
    if (checked) html += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
    html += '</div>';
    html += '<div class="mission-text' + (checked ? ' done' : '') + '">' + m.icon + ' ' + m.text + '</div>';
    html += '</div>';
  });

  var el = document.getElementById('misiNormalList');
  if (el) setSafeHTML(el, html);
}

function renderMisiIF() {
  var hariIdx = new Date().getDay();
  var hariMap = [6,0,1,2,3,4,5];
  var jadwal = targetOlahragaData['if'] || targetOlahragaData.standar;
  var todayOlahraga = jadwal[hariMap[hariIdx]];
  var isRest = todayOlahraga && (todayOlahraga.aktivitas.indexOf('Istirahat') !== -1 || todayOlahraga.aktivitas.indexOf('recovery') !== -1);
  var todayKey = new Date().toDateString();

  var misiList = [
    { icon:'⏰', text:'Buka puasa jam 10:00 — minum KEMOENIK 3 kapsul + makan bergizi' },
    { icon:'🌙', text:'Tutup jendela makan jam 18:00 (puasa 16 jam)' },
    { icon:'💧', text:'Minum air putih minimal 2 liter selama jendela makan' },
    { icon: isRest ? '😴' : '💪', text: isRest ? 'Hari istirahat — lakukan Lymphatic ringan malam ini' : (todayOlahraga ? todayOlahraga.aktivitas : 'Olahraga dalam jendela makan') },
    { icon:'🍽️', text:'Makan bergizi & sesuai target kalori dalam jendela 8 jam' },
    { icon:'💊', text:'Minum KEMOENIK 3 kapsul sore (sesudah makan sore)' },
    { icon:'🌙', text:'Tidur cukup 7–8 jam malam ini' }
  ];

  var html = '';
  misiList.forEach(function(m, i) {
    var misiKey = 'if_' + i + '_' + todayKey;
    var checked = appState.misiChecked && appState.misiChecked[misiKey];
    html += "<div class=\"mission-item\" onclick=\"toggleMisi('" + misiKey + "', this)\">";
    html += '<div class="mission-check' + (checked ? ' checked' : '') + '">';
    if (checked) html += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
    html += '</div>';
    html += '<div class="mission-text' + (checked ? ' done' : '') + '">' + m.icon + ' ' + m.text + '</div>';
    html += '</div>';
  });

  var el = document.getElementById('misiIFList');
  if (el) setSafeHTML(el, html);
}

function toggleMission(itemId, checkId) {
  var item = document.getElementById(itemId);
  var check = document.getElementById(checkId);
  var isDone = item.classList.toggle('done');
  if (isDone) { check.classList.add('checked'); check.textContent = '✓'; }
  else { check.classList.remove('checked'); check.textContent = ''; }

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

// ========== FAQ ==========
function renderFAQ() {
  var container = document.getElementById('faqContainer');
  var html = '';
  faqData.forEach(function(cat, catIdx) {
    html += '<div class="faq-item" id="faqCat' + catIdx + '">';
    html += '<div class="faq-hd" onclick="togFaq(\'faqCat' + catIdx + '\')">' + cat.cat + '<span class="faq-arr">›</span></div>';
    html += '<div class="faq-bd">';
    cat.items.forEach(function(item) {
      html += '<div class="faq-q">❓ ' + item.q + '</div>';
      html += '<div class="faq-a">' + item.a + '</div>';
    });
    html += '</div></div>';
  });
  container.innerHTML = html;
}

function togFaq(id) {
  document.getElementById(id).classList.toggle('on');
}

// ========== PROFIL ==========
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

  var traitHtml = '';
  traits.forEach(function(t) {
    traitHtml += '<div class="trait-card">';
    traitHtml += '<div class="trait-top"><div class="trait-name">' + t.name + '</div><div class="trait-badge ' + t.badgeClass + '">' + t.badge + '</div></div>';
    traitHtml += '<div class="trait-bar-bg"><div class="trait-bar-marker" style="left:' + t.pct + '%"></div></div>';
    traitHtml += '<div class="trait-labels">' + t.labels.map(l => '<span>' + l + '</span>').join('') + '</div>';
    traitHtml += '<div class="trait-desc">' + t.desc + '</div>';
    traitHtml += '</div>';
  });
  setSafeHTML(document.getElementById('traitBarContent'), traitHtml);
  document.getElementById('traitBarSub').textContent = q.tipeName + ' — ' + traits.length + ' karakteristik';

  var tipe = quizTypes.find(t => t.id === tipeId) || quizTypes[1];
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

  var skor = q.skor || 72;
  document.getElementById('scorePct').textContent = skor + '%';
  document.getElementById('scoreDesc').textContent = 'Program KEMOENIK dengan metode ' + (q.metodeName || q.metode) + ' memiliki kesesuaian ' + skor + '% dengan profil metabolismemu. Semakin konsisten, semakin tinggi efektivitasnya!';

  var profilAccs = ['acc-trait', 'acc-karakter', 'acc-skor'];
  profilAccs.forEach(function(id) {
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
  document.getElementById('srFill').style.strokeDashoffset = offset;
}

function renderTipsNotif() {
  var q = appState.quiz;
  if (q) {
    document.getElementById('tipsNotifBanner').style.display = 'flex';
  }
}

// ========== KALKULATOR ==========
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

  var bmr = gender === 'laki'
    ? 10 * berat + 6.25 * tinggi - 5 * usia + 5
    : 10 * berat + 6.25 * tinggi - 5 * usia - 161;
  var tdee = Math.round(bmr * aktivitas);
  var defisit = metode === 'ringan' ? 300 : metode === 'agresif' ? 700 : 500;
  var dietCal = Math.round(tdee - defisit);
  var penurunanPerMinggu = metode === 'ringan' ? 0.3 : metode === 'agresif' ? 0.7 : 0.5;
  var selisihBB = berat - target;
  var targetMinggu = (penurunanPerMinggu > 0 && selisihBB > 0) ? Math.ceil(selisihBB / penurunanPerMinggu) : 4;

  var today = new Date();
  var estDate = new Date(today.getTime() + targetMinggu * 7 * 24 * 60 * 60 * 1000);
  var estTanggal = estDate.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'});

  var bmi = (tinggi > 0 && berat > 0) ? berat / ((tinggi/100) * (tinggi/100)) : 0;
  var estLingkar;
  if (gender === 'laki') {
    estLingkar = tinggi > 0 ? Math.round(0.722 * bmi + 0.525 * (tinggi/100) * 100 - 48.3 - (selisihBB * 0.8)) : 0;
  } else {
    estLingkar = tinggi > 0 ? Math.round(0.735 * bmi + 0.625 * (tinggi/100) * 100 - 40.2 - (selisihBB * 0.8)) : 0;
  }
  estLingkar = Math.max(60, estLingkar);

  document.getElementById('hasilKkal').textContent = dietCal.toLocaleString('id');
  document.getElementById('hasilMinggu').textContent = targetMinggu + ' minggu';
  document.getElementById('hasilTanggal').textContent = estTanggal;
  document.getElementById('hasilLingkar').textContent = estLingkar + ' cm';
  document.getElementById('hasilBMR').textContent = Math.round(bmr).toLocaleString('id');
  document.getElementById('hasilTDEE').textContent = tdee.toLocaleString('id');
  document.getElementById('hasilDefisit').textContent = defisit;

  document.getElementById('kalkulatorForm').style.display = 'none';
  document.getElementById('hasilKalkulator').style.display = 'block';

  var startDateISO = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');
  var startDateDisplay = today.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'});

  // Hitung Makronutrisi (formula CALFATLOSS)
  var proteinMult = metode === 'ringan' ? 1.8 : metode === 'agresif' ? 2.2 : 2.0;
  var lemakMult = metode === 'ringan' ? 0.9 : metode === 'agresif' ? 0.7 : 0.8;
  var macroProtein = Math.round(berat * proteinMult);
  var macroLemak = Math.round(berat * lemakMult);
  var macroKarbo = Math.max(0, Math.round((dietCal - (macroProtein * 4 + macroLemak * 9)) / 4));

  window._tempKalData = {
    nama: nama.replace(/[<>"'&]/g, ''), gender, usia, berat, tinggi, aktivitas: parseFloat(aktivitas), target, metode,
    dietCal, targetMinggu, estTanggal, estLingkar, bmr: Math.round(bmr), tdee, defisit,
    startDate: startDateISO, startDateISO, startDateDisplay,
    makro: { protein: macroProtein, lemak: macroLemak, karbo: macroKarbo }
  };

  // Tampilkan makro di hasil kalkulator
  var mkProteinEl = document.getElementById('hasilProtein');
  var mkLemakEl = document.getElementById('hasilLemak');
  var mkKarboEl = document.getElementById('hasilKarbo');
  if (mkProteinEl) mkProteinEl.textContent = macroProtein + 'g';
  if (mkLemakEl) mkLemakEl.textContent = macroLemak + 'g';
  if (mkKarboEl) mkKarboEl.textContent = macroKarbo + 'g';
}

async function simpanKalkulator(btnEl) {
  var data = window._tempKalData;
  if (!data) {
    showToast('Klik "Generate Program" terlebih dahulu ya kak!');
    return;
  }

  if (!btnEl) btnEl = document.getElementById('btnSimpanKal');
  var origHtml = btnEl ? btnEl.innerHTML : '';
  if (btnEl) { btnEl.innerHTML = '<i class="fas fa-spinner fa-spin"> Menyimpan...'; btnEl.disabled = true; }

  try {
    var wa = normalizeWA(appState.user.wa || localStorage.getItem('kemoenik_wa') || '');
    if (!wa) {
      showToast('Error: WA tidak ditemukan');
      if (btnEl) { btnEl.innerHTML = origHtml; btnEl.disabled = false; }
      return;
    }

    var check = await DataService.saveKalkulator(wa, data);
    if (!check.success) throw new Error("Save failed");

    state.set('kalkulator', data);
    state.set('user.nama', data.nama);
    try { localStorage.setItem('kemoenik_kal_data', JSON.stringify(data)); } catch(e) {}

    window._tempKalData = null;
    if (btnEl) {
      btnEl.innerHTML = '<i class="fas fa-check"> Tersimpan!';
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
  if (btnReset) btnReset.style.display = hasData ? 'block' : 'none';
}

async function resetKalkulator() {
  if (!confirm('Yakin reset kalkulator? Data akan dihapus dan bisa isi ulang.')) return;
  var wa = appState.user.wa || localStorage.getItem('kemoenik_wa');
  if (!wa) return;
  try {
    await DataService.saveKalkulator(wa, null); // hapus dengan menyimpan null
    state.set('kalkulator', null);
    localStorage.removeItem('kemoenik_kal_data');
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
    document.getElementById('inputMetode').value = q.metode || 'standar';
    var metodeEl = document.getElementById('inputMetode');
    if (metodeEl) {
      metodeEl.style.borderColor = 'var(--green)';
      metodeEl.title = 'Otomatis dari hasil kuis: ' + q.metodeName;
    }
  }
  updateResetButtonVisibility();
  updateQuizResetButtonVisibility();
}

// ========== EVALUASI ==========
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
      kondisi: Object.keys(condChecked).filter(k => condChecked[k]).join(','),
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
    state._persist();

    var wa = appState.user.wa || localStorage.getItem('kemoenik_wa');
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
  var f = document.getElementById('weekStartWeight');
  if (f) f.scrollIntoView({behavior: 'smooth', block: 'center'});
}

function hapusEval(idx) {
  var mg = appState.evaluasi[idx] ? appState.evaluasi[idx].minggu : (idx + 1);
  if (!confirm('Yakin hapus data evaluasi minggu ke-' + mg + '?')) return;
  appState.evaluasi.splice(idx, 1);
  appState.evaluasi.forEach(function(e, i) { e.minggu = i + 1; });
  state._persist();
  var wa = appState.user.wa || localStorage.getItem('kemoenik_wa');
  if (wa) {
    var nwa = normalizeWA(wa);
    var ud = DataService.loadUserData(nwa) || {};
    ud.evaluasi = appState.evaluasi;
    DataService.saveUserData(nwa, ud);
  }
  renderEvalHome();
  renderEvalHistory();
  renderHomeStats();
  showToast('✅ Data evaluasi berhasil dihapus');
}
window.hapusEval = hapusEval;

// ========== QUIZ ==========
var currentQ = 0;
var selectedAnswers = new Array(15).fill(null);
var finalResult = null;

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
  var q = quizQuestions[currentQ];
  var pct = Math.round((currentQ / 15) * 100);
  document.getElementById('qCurrent').textContent = currentQ + 1;
  document.getElementById('qPct').textContent = pct + '%';
  document.getElementById('qFill').style.width = pct + '%';
  document.getElementById('qNum').textContent = 'PERTANYAAN ' + String(currentQ+1).padStart(2,'0');
  document.getElementById('qText').textContent = q.text;

  var html = '';
  q.options.forEach((opt, idx) => {
    var sel = selectedAnswers[currentQ] === idx;
    html += '<div class="quiz-option' + (sel ? ' selected' : '') + '" onclick="selectAnswer(' + idx + ')">';
    html += '<div class="quiz-opt-emoji">' + opt.emoji + '</div>';
    html += '<div class="quiz-opt-text">' + opt.text + '</div>';
    html += '<div class="quiz-opt-radio">' + (sel ? '<div style="width:8px;height:8px;border-radius:50%;background:#FFF;"></div>' : '') + '</div>';
    html += '</div>';
  });
  setSafeHTML(document.getElementById('qOptions'), html);

  var btnBack = document.getElementById('btnBack');
  var btnNext = document.getElementById('btnNext');
  btnBack.style.display = currentQ > 0 ? 'flex' : 'none';
  btnNext.disabled = selectedAnswers[currentQ] === null;
  btnNext.innerHTML = currentQ === 14 ? '<i class="fas fa-chart-bar"> Lihat Hasil' : 'Lanjut <i class="fas fa-arrow-right">';
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
  var scores = [0,0,0,0,0,0,0];
  selectedAnswers.forEach((ansIdx, qIdx) => {
    if (ansIdx === null) return;
    quizQuestions[qIdx].options[ansIdx].scores.forEach((val, tIdx) => scores[tIdx] += val);
  });
  var maxIdx = scores.indexOf(Math.max.apply(null, scores));
  return quizTypes[maxIdx];
}

async function showResult() {
  try {
    finalResult = calculateResult();
    document.getElementById('quizRunning').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';

    document.getElementById('qrTypeName').innerHTML = 'Tipe <em>' + escHtml(finalResult.name.replace('Tipe ','')) + '</em>';
    document.getElementById('qrTagline').textContent = finalResult.tagline;
    document.getElementById('qrMetodeName').textContent = finalResult.metodeName;
    document.getElementById('qrScore').textContent = finalResult.skor;
    setTimeout(() => document.getElementById('qrGaugeBar').style.width = finalResult.skor + '%', 400);

    var traits = traitDataByType[finalResult.id] || traitDataByType[2];
    var tHtml = '';
    traits.forEach(t => {
      tHtml += '<div class="trait-card"><div class="trait-top"><div class="trait-name">' + t.name + '</div><div class="trait-badge ' + t.badgeClass + '">' + t.badge + '</div></div>';
      tHtml += '<div class="trait-bar-bg"><div class="trait-bar-marker" style="left:' + t.pct + '%"></div></div>';
      tHtml += '<div class="trait-labels">' + t.labels.map(l => '<span>' + l + '</span>').join('') + '</div>';
      tHtml += '<div class="trait-desc">' + t.desc + '</div></div>';
    });
    setSafeHTML(document.getElementById('quizTraitCards'), tHtml);

    var tipsHtml = '<div style="background:' + finalResult.bg + ';border-radius:14px;padding:14px;margin-bottom:14px;">';
    tipsHtml += '<div style="font-size:12px;font-weight:700;color:' + finalResult.textColor + ';margin-bottom:8px;">🎯 Metode Kamu: ' + finalResult.metodeName + '</div>';
    tipsHtml += '</div>';
    finalResult.tips.forEach(tip => {
      tipsHtml += '<div style="display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border);">';
      tipsHtml += '<div style="color:var(--green);font-size:14px;margin-top:1px;">✓</div>';
      tipsHtml += '<div style="font-size:13px;color:var(--text3);line-height:1.6;">' + tip + '</div></div>';
    });
    setSafeHTML(document.getElementById('quizTipsContent'), tipsHtml);

    var metodeKey = finalResult.metode;
    var jadwal = targetOlahragaData[metodeKey] || targetOlahragaData.standar;
    var progHtml = '<div style="font-size:12px;font-weight:700;color:var(--green);margin-bottom:12px;">📅 Jadwal Olahraga Mingguan</div>';
    progHtml += '<div style="background:var(--offwhite);border-radius:12px;padding:14px;margin-bottom:14px;">';
    jadwal.forEach(d => {
      var isRest = d.aktivitas.indexOf('Istirahat') !== -1;
      progHtml += '<div style="display:flex;gap:10px;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);">';
      progHtml += '<div style="font-size:11px;font-weight:700;color:' + (isRest ? 'var(--text3)' : 'var(--green)') + ';width:28px;">' + d.hari + '</div>';
      progHtml += '<div style="flex:1;font-size:12px;color:' + (isRest ? 'var(--text3)' : 'var(--text)') + ';">' + d.aktivitas + '</div>';
      if (!isRest) progHtml += '<div>💪</div>';
      progHtml += '</div>';
    });
    progHtml += '</div>';
    setSafeHTML(document.getElementById('quizProgramContent'), progHtml);

    var qData = {
      tipe: finalResult.id, tipeName: finalResult.name, metode: finalResult.metode,
      metodeName: finalResult.metodeName, tagline: finalResult.tagline,
      skor: finalResult.skor, tipe_emoji: finalResult.emoji
    };
    state.set('quiz', qData);
    try { localStorage.setItem('kemoenik_quiz', JSON.stringify(qData)); } catch(e) {}

    var waForQuiz = normalizeWA(appState.user.wa || localStorage.getItem('kemoenik_wa') || '');
    if (waForQuiz) await DataService.saveQuiz(waForQuiz, qData);

    renderAll();
    gtag('event', 'quiz_completed', { tipe: finalResult.name });
  } catch(e) {
    console.error('showResult error:', e);
    showToast('Gagal menampilkan hasil kuis');
  }
}

async function selesaiQuiz() {
  try {
    if (!finalResult) {
      showToast('Error: Hasil kuis tidak ditemukan');
      return;
    }
    var wa = normalizeWA(appState.user.wa || localStorage.getItem('kemoenik_wa') || '');
    if (!wa) {
      showToast('Error: WA tidak ditemukan');
      return;
    }
    var qData = {
      tipe: finalResult.id, tipeName: finalResult.name, metode: finalResult.metode,
      metodeName: finalResult.metodeName, tagline: finalResult.tagline,
      skor: finalResult.skor, tipe_emoji: finalResult.emoji
    };
    var check = await DataService.saveQuiz(wa, qData);
    if (!check.success) throw new Error("Save failed");

    state.set('quiz', qData);
    try { localStorage.setItem('kemoenik_quiz', JSON.stringify(qData)); } catch(e) {}
    state._persist();

    updateQuizResetButtonVisibility();

    await new Promise(r => setTimeout(r, 100));
    go('profil');
    setTimeout(function() {
      renderAll();
      renderProfilPage();
      ['acc-trait','acc-karakter','acc-skor'].forEach(id => {
        var el = document.getElementById(id);
        if (el) el.classList.add('on');
      });
      showToast('✅ Profil metabolisme tersimpan!');
    }, 150);

  } catch(e) {
    console.error('selesaiQuiz error:', e);
    showToast('Gagal menyimpan hasil kuis');
  }
}

function updateQuizResetButtonVisibility() {
  var hasData = appState.quiz && appState.quiz.tipe;
  var btnReset = document.getElementById('btnResetQuiz');
  if (btnReset) btnReset.style.display = hasData ? 'block' : 'none';
}

async function resetQuizData() {
  if (!confirm('Yakin reset hasil kuis? Data akan dihapus dan bisa isi ulang.')) return;
  var wa = appState.user.wa || localStorage.getItem('kemoenik_wa');
  if (!wa) return;
  try {
    await DataService.saveQuiz(wa, null);
    state.set('quiz', null);
    localStorage.removeItem('kemoenik_quiz');
    showToast('✅ Quiz direset. Silakan isi ulang.');
    document.getElementById('quizIntro').style.display = 'block';
    document.getElementById('quizRunning').style.display = 'none';
    document.getElementById('quizResult').style.display = 'none';
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

// ========== JADWAL OLAHRAGA ==========
function renderJadwalOlahraga() {
  var metode = appState.quiz ? appState.quiz.metode : 'standar';
  var data = targetOlahragaData[metode] || targetOlahragaData.standar;
  var html = '';
  data.forEach(d => {
    var isRest = d.aktivitas.indexOf('Istirahat') !== -1 || d.aktivitas.indexOf('recovery') !== -1;
    html += '<div class="jadwal-item">';
    html += '<div class="jadwal-time" style="color:' + (isRest ? 'var(--text3)' : 'var(--green)') + ';">' + d.hari + '</div>';
    html += '<div class="jadwal-content"><div class="jadwal-title" style="color:' + (isRest ? 'var(--text3)' : 'var(--text)') + ';">' + d.aktivitas + '</div></div>';
    if (!isRest) html += '<div style="font-size:16px;">💪</div>';
    html += '</div>';
  });
  setSafeHTML(document.getElementById('jadwalNormalList'), html);
}

// ========== ARRAY MOTIVASI OLAHRAGA ==========
var pesanMotivasiOlahraga = [
  'Mantap! Pembakaran lemak makin optimal! \uD83D\uDD25',
  'Bagus! Jaga konsistensi ya! \uD83D\uDCAA',
  'Setiap gerakan mendekatkan kamu ke target! \uD83C\uDFAF',
  'Keren! Metabolisme kamu makin aktif hari ini! \u26A1',
  'Istirahat juga bagian dari progress. Good job! \uD83D\uDE4C',
  'Tubuh kamu berterima kasih atas gerakan hari ini! \u2764\uFE0F',
  'Konsisten adalah kunci. Kamu luar biasa! \uD83C\uDF1F',
  'Progress bukan tentang cepat, tapi tentang tidak berhenti! \uD83D\uDE80',
  'Olahraga hari ini = investasi tubuh ideal esok hari! \uD83D\uDCC8',
  'Kamu sudah selangkah lebih dekat ke goal! Keep it up! \uD83C\uDFC6'
];

function getRandomMotivasi() {
  var idx = Math.floor(Math.random() * pesanMotivasiOlahraga.length);
  return pesanMotivasiOlahraga[idx];
}

// ========== HELPER: Hitung Streak ==========
function hitungStreak() {
  var streak = 0, today = new Date();
  for (var i = 0; i < 30; i++) {
    var d = new Date(today); d.setDate(d.getDate() - i);
    var key = 'olahraga_' + d.toDateString();
    var chk = appState.misiChecked && appState.misiChecked[key];
    if (chk) { streak++; } else if (i > 0) { break; }
  }
  return streak;
}
// ========== HELPER: Progress Minggu ==========
function hitungProgressMinggu() {
  var terpenuhi = 0, totalAktif = 0, today = new Date();
  var dow = today.getDay();
  var sw = new Date(today); sw.setDate(today.getDate() - ((dow===0)?6:dow-1));
  var pp = localStorage.getItem('kemoenik_program_pilihan') || 'normal';
  var met = pp==='if' ? 'if' : ((appState.quiz && appState.quiz.metode) ? appState.quiz.metode : 'standar');
  var jadwal = targetOlahragaData[met] || targetOlahragaData.standar;
  var hm = [6,0,1,2,3,4,5];
  for (var i = 0; i < 7; i++) {
    var d = new Date(sw); d.setDate(sw.getDate() + i);
    if (d > today) break;
    var j = jadwal[hm[d.getDay()]];
    var isR = j && (j.aktivitas.indexOf('Istirahat')!==-1 || j.aktivitas.indexOf('recovery')!==-1);
    if (!isR) {
      totalAktif++;
      if (appState.misiChecked && appState.misiChecked['olahraga_'+d.toDateString()]) terpenuhi++;
    }
  }
  return { terpenuhi:terpenuhi, total:totalAktif, persen:totalAktif>0?Math.round(terpenuhi/totalAktif*100):0 };
}
// ========== HELPER: Kalender Mini ==========
function generateKalenderMini(jadwal, hm) {
  var today = new Date(), dow = today.getDay();
  var sw = new Date(today); sw.setDate(today.getDate() - ((dow===0)?6:dow-1));
  var nm = ['Sn','Sl','Rb','Km','Jm','Sb','Mg'];
  var html = '';
  for (var i = 0; i < 7; i++) {
    var d = new Date(sw); d.setDate(sw.getDate() + i);
    var di = (d.getDay()===0)?6:d.getDay()-1;
    var isTdy = d.toDateString()===today.toDateString();
    var isFut = d > today;
    var j = jadwal[hm[d.getDay()]];
    var isR = j && (j.aktivitas.indexOf('Istirahat')!==-1||j.aktivitas.indexOf('recovery')!==-1);
    var isDone = !isFut && appState.misiChecked && appState.misiChecked['olahraga_'+d.toDateString()];
    var dc = isTdy?'kal-dot-today':isFut?'kal-dot-future':isDone?'kal-dot-done':isR?'kal-dot-rest':'kal-dot-future';
    html += '<div class="kal-day"><div class="kal-day-name">'+nm[di]+'</div><div class="kal-day-dot '+dc+'"></div></div>';
  }
  return html;
}

// ========== HANDLER: Tunda & Ganti Olahraga ==========
function tundaOlahraga() {
  showToast('\u23F0 Fitur Tunda sedang dalam pengembangan. Stay tuned!');
}
function gantiOlahraga() {
  showToast('\uD83D\uDD04 Fitur Ganti Olahraga sedang dalam pengembangan. Stay tuned!');
}
window.tundaOlahraga = tundaOlahraga;
window.gantiOlahraga = gantiOlahraga;

// ========== MAIN: Render Home Jadwal ==========
function renderHomeJadwal() {
  var el = document.getElementById('homeJadwalContent');
  if (!el) return;
  try {
    var pp = localStorage.getItem('kemoenik_program_pilihan') || 'normal';
    var metode = pp==='if' ? 'if' : ((appState.quiz && appState.quiz.metode) ? appState.quiz.metode : 'standar');
    var jadwal = targetOlahragaData[metode] || targetOlahragaData['standar'];
    var hariIdx = new Date().getDay();
    var hariMap = [6,0,1,2,3,4,5];
    var td = jadwal[hariMap[hariIdx]] || jadwal[0];
    var hNm = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    var hariName = hNm[hariIdx];
    var akt = td.aktivitas || '';
    var isRest = akt.indexOf('Istirahat')!==-1 || akt.indexOf('recovery')!==-1;
    var streak = hitungStreak();
    var prog = hitungProgressMinggu();
    var html = '';

    // ---- 1. STREAK COUNTER ----
    if (streak > 0) {
      var streakLabel = streak >= 7 ? '\uD83C\uDFC5 Luar Biasa!' : streak >= 3 ? '\uD83D\uDCAA Rajin' : '\uD83D\uDCAB Keep Going!';
      html += '<div class="olahraga-streak-badge">\uD83D\uDD25 ' + streak + ' hari berturut-turut! ' + streakLabel + '</div>';
    }

    // ---- 2. PROGRESS MINGGUAN ----
    html += '<div class="olahraga-progress-week">';
    html += '<div class="olahraga-progress-label">Minggu ini: ' + prog.terpenuhi + ' dari ' + prog.total + ' sesi olahraga</div>';
    html += '<div class="olahraga-progress-bar-bg"><div class="olahraga-progress-bar-fill" style="width:' + prog.persen + '%"></div></div>';
    html += '</div>';

    // ---- 3. KALENDER MINI 7 DOT ----
    html += '<div class="kalender-mini">' + generateKalenderMini(jadwal, hariMap) + '</div>';

    // ---- 4. HEADER HARI INI ----
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">';
    html += '<div style="width:40px;height:40px;border-radius:12px;background:' + (isRest ? '#F3F4F6' : 'linear-gradient(135deg,var(--green),var(--green3))') + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;">';
    if (isRest) {
      html += '<span style="font-size:18px;">&#128564;</span>';
    } else {
      html += '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v8"/><path d="M8 12l4 3 4-3"/><path d="M8 19l-2 3M16 19l2 3"/></svg>';
    }
    html += '</div><div style="flex:1;">';
    html += '<div style="font-size:13px;font-weight:700;color:var(--text);">' + hariName + (isRest ? ' &mdash; Istirahat Aktif' : ' &mdash; Jadwal Olahraga') + '</div>';
    var labelP = pp==='if' ? 'Program IF 16:8' : 'Metode ' + metode.charAt(0).toUpperCase() + metode.slice(1);
    html += '<div style="font-size:11px;color:var(--text3);margin-top:1px;">' + labelP + '</div>';
    html += '</div></div>';

    // ---- 5. CARD AKTIVITAS HARI INI ----
    html += '<div style="background:' + (isRest ? '#F9FAFB' : '#ECFDF5') + ';border-radius:12px;padding:12px 14px;margin-bottom:10px;">';
    html += '<div style="font-size:13px;color:' + (isRest ? '#6B7280' : '#065F46') + ';font-weight:' + (isRest ? '400' : '700') + ';line-height:1.7;">' + akt + '</div>';
    if (!isRest) {
      var dur = akt.indexOf('60')!==-1 ? '60 menit' : akt.indexOf('45')!==-1 ? '45 menit' : akt.indexOf('20')!==-1 ? '20 menit' : '30 menit';
      html += '<div style="display:flex;gap:8px;margin-top:10px;">';
      html += '<div style="background:white;border-radius:8px;padding:5px 10px;display:flex;align-items:center;gap:5px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span style="font-size:11px;color:var(--green);font-weight:700;">' + dur + '</span></div>';
      html += '<div style="background:white;border-radius:8px;padding:5px 10px;display:flex;align-items:center;gap:5px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E07B39" stroke-width="2.5" stroke-linecap="round"><path d="M12 2c-4 6-6 9-6 13a6 6 0 0012 0c0-4-2-7-6-13z"/></svg><span style="font-size:11px;color:#E07B39;font-weight:700;">~150 kkal</span></div>';
      html += '</div>';
    } else {
      html += '<div style="font-size:11px;color:#9CA3AF;margin-top:6px;">Istirahat optimal untuk pemulihan. Cukup lymphatic drainage ringan malam ini.</div>';
    }
    html += '</div>';

    // ---- 6. AFIRMASI / MOTIVASI DINAMIS ----
    html += '<div style="background:linear-gradient(135deg,#FFFBEB,#FEF3C7);border:1px solid #FDE68A;border-radius:12px;padding:10px 14px;margin-bottom:10px;display:flex;align-items:center;gap:10px;">';
    html += '<span style="font-size:18px;">&#128172;</span>';
    html += '<div id="motivasiOlahragaText" style="font-size:12px;color:#92400E;font-weight:600;line-height:1.5;flex:1;">' + getRandomMotivasi() + '</div>';
    html += '</div>';

    // ---- 7. TOMBOL AKSI: TUNDA & GANTI OLAHRAGA ----
    if (!isRest) {
      html += '<div style="display:flex;gap:8px;margin-bottom:10px;">';
      html += '<button onclick="tundaOlahraga()" style="flex:1;padding:9px;background:white;color:var(--text3);border:1.5px solid var(--border);border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">&#9201; Tunda</button>';
      html += '<button onclick="gantiOlahraga()" style="flex:1;padding:9px;background:white;color:var(--text3);border:1.5px solid var(--border);border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">&#128260; Ganti Olahraga</button>';
      html += '</div>';
    }

    // ---- 8. TOMBOL JADWAL LENGKAP ----
    html += '<button onclick="openPanel(\'panelJadwalOlahraga\')" style="width:100%;padding:10px;background:var(--green);color:white;border:none;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px;">';
    html += '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
    html += 'Jadwal Lengkap Seminggu</button>';

    setSafeHTML(el, html);
  } catch(err) {
    console.log('renderHomeJadwal err:', err);
    el.textContent = 'Ketuk untuk lihat jadwal olahraga minggu ini';
  }
}

function toggleOlahraga(mode) {
  var isIF = mode === 'if';
  document.getElementById('jadwalNormalWrap').style.display = isIF ? 'none' : 'block';
  document.getElementById('jadwalIFWrap').style.display = isIF ? 'block' : 'none';
  document.getElementById('olahragaNormalBtn').style.background = isIF ? 'var(--white)' : 'var(--green)';
  document.getElementById('olahragaNormalBtn').style.color = isIF ? 'var(--text3)' : '#FFF';
  document.getElementById('olahragaNormalBtn').style.border = isIF ? '2px solid var(--border)' : '2px solid var(--green)';
  document.getElementById('olahragaIFBtn').style.background = isIF ? '#F5F3FF' : 'var(--white)';
  document.getElementById('olahragaIFBtn').style.color = isIF ? '#7C3AED' : 'var(--text3)';
  document.getElementById('olahragaIFBtn').style.border = isIF ? '2px solid #DDD6FE' : '2px solid var(--border)';

  var rekBox = document.getElementById('rekomendasiBox');
  var rekText = document.getElementById('rekomendasiText');
  if (isIF) {
    rekBox.style.background = '#F5F3FF'; rekBox.style.borderColor = '#DDD6FE'; rekBox.style.color = '#4C1D95';
    rekText.innerHTML = 'Kamu memilih <strong>IF 16:8</strong> — kombinasi puasa + defisit kalori akan mempercepat hasil. Pastikan tubuh sudah siap!';
  } else {
    rekBox.style.background = '#F0FDF4'; rekBox.style.borderColor = '#86EFAC'; rekBox.style.color = '#065F46';
    rekText.innerHTML = 'Sistem merekomendasikan: <strong>Normal</strong> — defisit kalori + olahraga rutin sudah cukup efektif tanpa perlu puasa.';
  }
}

// ========== MENU HARIAN ==========
function renderMenuHarian() {
  var k = appState.kalkulator;
  var totalCal = k ? Math.round(k.dietCal) : 1450;
  if (document.getElementById('mealTargetDisplay')) document.getElementById('mealTargetDisplay').textContent = totalCal;

  var html = '';
  menuHarianData.forEach(m => {
    html += '<div class="meal-card">';
    html += '<div class="meal-time-box"><div class="meal-time-label">WIB</div><div class="meal-time-value">' + m.time + '</div></div>';
    html += '<div class="meal-content">';
    html += '<div class="meal-title">' + m.icon + ' ' + m.label + '</div>';
    html += '<div class="meal-desc">' + m.menu + '</div>';
    html += '</div>';
    html += '<div class="meal-cal">~' + m.cal + ' kkal</div>';
    html += '</div>';
  });
  setSafeHTML(document.getElementById('menuHariIni'), html);
}

function switchMenuTab(tab, btn) {
  ['ekonomis','standar','premium','custom'].forEach(t => {
    var el = document.getElementById('tabMenu' + t.charAt(0).toUpperCase() + t.slice(1));
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('.menu-tab-btn').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');

  if (tab === 'custom') renderCmFoodGrid();
}

// ========== CUSTOM MENU ==========
var cmSelectedItems = [];
var cmTargetCalories = 1450;
var cmCurrentCategory = 'all';

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
  var k = appState.kalkulator;
  if (k && k.dietCal) {
    cmTargetCalories = Math.round(k.dietCal);
    document.getElementById('cmTargetCal').value = cmTargetCalories;
    document.getElementById('cmCurrentTarget').textContent = cmTargetCalories + ' kcal';
    document.getElementById('cmDisplayTarget').textContent = cmTargetCalories;
  }
  var foods = cmCurrentCategory === 'all' ? cmFoodDatabase : cmFoodDatabase.filter(f => f.category === cmCurrentCategory);
  var html = '';
  foods.forEach(f => {
    var isSel = cmSelectedItems.find(s => s.id === f.id);
    html += '<div class="cm-food-item' + (isSel ? ' cm-selected' : '') + '" onclick="cmToggleFood(' + f.id + ')">';
    html += '<div class="cm-check">✓</div>';
    html += '<div class="cm-name">' + f.name + '</div>';
    html += '<div class="cm-cal">' + f.baseCal + ' kkal/' + f.baseAmount + ' ' + f.unit + '</div>';
    html += '</div>';
  });
  setSafeHTML(document.getElementById('cmFoodGrid'), html);
}

function cmToggleFood(id) {
  var food = cmFoodDatabase.find(f => f.id === id);
  var idx = cmSelectedItems.findIndex(s => s.id === id);
  if (idx >= 0) { cmSelectedItems.splice(idx, 1); }
  else { cmSelectedItems.push({ id: food.id, name: food.name, cal: food.baseCal, amount: food.baseAmount, unit: food.unit, baseCal: food.baseCal, baseAmount: food.baseAmount }); }
  renderCmFoodGrid();
  cmUpdateSummary();
}

function cmUpdateSummary() {
  var total = cmSelectedItems.reduce((sum, item) => sum + (item.baseAmount > 0 ? Math.round(item.cal * item.amount / item.baseAmount) : 0), 0);
  var pct = cmTargetCalories > 0 ? Math.min(100, Math.round(total / cmTargetCalories * 100)) : 0;
  var remaining = cmTargetCalories - total;
  document.getElementById('cmDisplayUsed').textContent = total;
  document.getElementById('cmProgressBar').style.width = pct + '%';
  var statusEl = document.getElementById('cmStatus');
  if (total > cmTargetCalories * 1.05) { statusEl.textContent = '⚠️ Melebihi target! Kurangi porsi'; statusEl.style.background = 'rgba(239,68,68,0.3)'; }
  else if (total >= cmTargetCalories * 0.9) { statusEl.textContent = '✅ Kalori pas! Diet terjaga'; statusEl.style.background = 'rgba(46,204,113,0.3)'; }
  else { statusEl.textContent = '📊 Sisa ' + remaining + ' kkal lagi'; statusEl.style.background = 'rgba(255,255,255,0.2)'; }
}

function cmReset() {
  cmSelectedItems = [];
  renderCmFoodGrid();
  cmUpdateSummary();
}

// ========== ACCORDION ==========
function tog(id) {
  document.getElementById(id).classList.toggle('on');
}

// ========== REMINDER ==========
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

function showInAppReminder(title, body) {
  const today = new Date().toDateString();
  const dismissed = localStorage.getItem('kemoenik_reminder_dismissed');
  if (dismissed === today) return;
  document.getElementById('reminderTitle').textContent = title;
  document.getElementById('reminderBody').textContent = body;
  document.getElementById('inAppReminder').style.display = 'block';
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', function() {
  initApp();
  renderFAQ();
  var mode = localStorage.getItem('kemoenik_mission_mode') || 'normal';
  setMissionMode(mode);
  // Set timer untuk reminder
  setInterval(checkAndShowReminder, 60000);
  setTimeout(checkAndShowReminder, 2000);
});

// Escape key untuk tutup modal
window.addEventListener('keydown', function(e){
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-panel.on').forEach(p => closePanel(p.id));
  }
});

// ============================================================
// FUNGSI BARU: Reset dan Edit Quiz
// ============================================================
function resetAndEditQuiz() {
  var wa = localStorage.getItem('kemoenik_wa') || '';
  if (wa) {
    var normalizedWA = normalizeWA(wa);
    var userData = DataService.loadUserData(normalizedWA) || {};
    userData.quiz = null;
    DataService.saveUserData(normalizedWA, userData);
  }
  state.set('quiz', null);
  appState.quiz = null;
  localStorage.removeItem('kemoenik_quiz');
  go('program');
  setTimeout(function() {
    var quizIntro = document.getElementById('quizIntro');
    var quizRunning = document.getElementById('quizRunning');
    var quizResult = document.getElementById('quizResult');
    if (quizIntro) quizIntro.style.display = 'block';
    if (quizRunning) quizRunning.style.display = 'none';
    if (quizResult) quizResult.style.display = 'none';
    renderHomeStats();
    renderAll();
  }, 200);
  showToast('Silakan isi quiz baru 📝');
}
window.resetAndEditQuiz = resetAndEditQuiz;

// ============================================================
// FUNGSI BARU: Render Konten Tips Diet
// ============================================================
function renderTipsKonten() {
  if (typeof tipsKontenData === 'undefined') return;

  // Mapping tips id ke accordion HTML yang sudah ada
  var accMap = {
    'defisit':      'acc-defisit',
    'pola-makan':   'acc-gula',
    'olahraga-tips':'acc-ola',
    'air-putih':    'acc-minum',
    'if-puasa':     'acc-if'
  };

  tipsKontenData.forEach(function(tips) {
    var accId = accMap[tips.id];
    if (!accId) return;
    var acc = document.getElementById(accId);
    if (!acc) return;

    // Update judul & sub di header accordion
    var titleEl = acc.querySelector('.acc-title');
    var subEl   = acc.querySelector('.acc-sub');
    if (titleEl) titleEl.textContent = tips.judul;
    if (subEl)   subEl.textContent   = tips.konten[0] ? tips.konten[0].substring(0, 55) + '...' : '';

    // Isi body accordion
    var bodyEl = acc.querySelector('.acc-body');
    if (!bodyEl) return;
    var html = '<div style="padding:4px 0 8px;">';
    tips.konten.forEach(function(poin) {
      html += '<div style="display:flex;gap:8px;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px;line-height:1.6;color:var(--text);">';
      html += '<span style="color:' + tips.warna + ';flex-shrink:0;font-weight:700;">•</span>';
      html += '<span>' + poin + '</span>';
      html += '</div>';
    });
    html += '</div>';
    setSafeHTML(bodyEl, html);
  });

  // Accordion tambahan (waktu-makan, lymphatic, tidur) — buat dinamis dan inject ke page-tips
  var extraContainer = document.getElementById('tipsExtraContainer');
  if (!extraContainer) return;
  var extraIds = ['waktu-makan', 'lymphatic', 'tidur'];
  var html = '';
  tipsKontenData.forEach(function(tips) {
    if (extraIds.indexOf(tips.id) === -1) return;
    var uid = 'acc-extra-' + tips.id;
    html += '<div class="acc" id="' + uid + '" style="margin-bottom:8px;">';
    html += '<div class="acc-hd" onclick="tog(\''  + uid + '\')">' ;
    html += '<div class="acc-icon" style="background:' + tips.bgWarna + ';font-size:16px;display:flex;align-items:center;justify-content:center;">' + tips.icon + '</div>';
    html += '<div class="acc-info"><div class="acc-title">' + tips.judul + '</div>';
    html += '<div class="acc-sub">' + (tips.konten[0] ? tips.konten[0].substring(0, 55) + '...' : '') + '</div></div>';
    html += '<div class="acc-toggle">+</div></div>';
    html += '<div class="acc-body"><div style="padding:4px 0 8px;">';
    tips.konten.forEach(function(poin) {
      html += '<div style="display:flex;gap:8px;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px;line-height:1.6;">';
      html += '<span style="color:' + tips.warna + ';flex-shrink:0;font-weight:700;">•</span><span>' + poin + '</span></div>';
    });
    html += '</div></div></div>';
  });
  setSafeHTML(extraContainer, html);

  // Sembunyikan tipsKontenContainer lama (panduan lengkap di bawah — dihapus tampilannya)
  var oldContainer = document.getElementById('tipsKontenContainer');
  if (oldContainer) {
    oldContainer.style.display = 'none';
    var secTitle = oldContainer.previousElementSibling;
    if (secTitle && secTitle.textContent && secTitle.textContent.indexOf('Panduan Lengkap') !== -1) {
      secTitle.style.display = 'none';
    }
  }
}


// ============================================================
// FUNGSI BARU: Start / Stop / Restart Program
// ============================================================
function renderStartStopBtn() {
  var container = document.getElementById('progStartStopContainer');
  if (!container) return;
  var k = appState.kalkulator;
  var isActive = k && k.startDateISO;
  if (isActive) {
    container.innerHTML =
      '<div class="prog-action-row">' +
      '<button class="prog-action-btn stop" onclick="stopProgram()">⏹ Berhenti</button>' +
      '<button class="prog-action-btn start" onclick="restartProgram()">🔄 Mulai Ulang</button>' +
      '</div>';
  } else {
    container.innerHTML =
      '<button class="prog-action-btn start" onclick="startProgram()">▶️ Mulai Program Sekarang</button>';
  }
}

function startProgram() {
  if (!appState.kalkulator) {
    showToast('Isi kalkulator dulu ya!');
    go('program');
    return;
  }
  var wa = localStorage.getItem('kemoenik_wa') || '';
  var normalizedWA = normalizeWA(wa);
  var now = new Date();
  var isoStr = now.toISOString().split('T')[0];
  var displayStr = now.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'});
  state.set('kalkulator.startDateISO', isoStr);
  state.set('kalkulator.startDate', displayStr);
  state.set('kalkulator.startDateDisplay', displayStr);
  var userData = DataService.loadUserData(normalizedWA) || {};
  if (userData.kalkulator) {
    userData.kalkulator.startDateISO = isoStr;
    userData.kalkulator.startDate = displayStr;
    userData.kalkulator.startDateDisplay = displayStr;
    DataService.saveUserData(normalizedWA, userData);
  }
  renderAll();
  showToast('✅ Program dimulai! Semangat!');
}

function stopProgram() {
  if (!confirm('Yakin ingin menghentikan program? Data progress tetap tersimpan.')) return;
  var wa = localStorage.getItem('kemoenik_wa') || '';
  var normalizedWA = normalizeWA(wa);
  state.set('kalkulator.startDateISO', null);
  state.set('kalkulator.startDate', null);
  var userData = DataService.loadUserData(normalizedWA) || {};
  if (userData.kalkulator) {
    userData.kalkulator.startDateISO = null;
    userData.kalkulator.startDate = null;
    DataService.saveUserData(normalizedWA, userData);
  }
  renderAll();
  showToast('Program dihentikan. Data tetap tersimpan.');
}

function restartProgram() {
  if (!confirm('Mulai ulang program dari awal? Timeline akan direset ke hari ini.')) return;
  startProgram();
}

window.startProgram = startProgram;
window.stopProgram = stopProgram;
window.restartProgram = restartProgram;

// ============================================================
// FUNGSI BARU: Pilih Program (Normal / IF) di Home
// ============================================================
function pilihProgramHome(pilihan) {
  localStorage.setItem('kemoenik_program_pilihan', pilihan);
  var wa = localStorage.getItem('kemoenik_wa') || '';
  if (wa) DataService.saveProgramPilihan(normalizeWA(wa), pilihan);

  var btnNormal = document.getElementById('btnProgNormal');
  var btnIF = document.getElementById('btnProgIF');
  if (btnNormal) {
    btnNormal.className = 'prog-selector-btn ' + (pilihan === 'normal' ? 'active' : 'inactive');
  }
  if (btnIF) {
    btnIF.className = 'prog-selector-btn ' + (pilihan === 'if' ? 'active' : 'inactive');
  }
  renderHomeJadwal();
  renderMisiByProgram();
  showToast(pilihan === 'if' ? '🌙 Program IF 16:8 dipilih!' : '💪 Program Normal dipilih!');
}
window.pilihProgramHome = pilihProgramHome;


// ============================================================
// FUNGSI BARU: Jadwal Olahraga dengan Ceklis (terpisah dari Misi)
// ============================================================
function renderJadwalCeklis() {
  var container = document.getElementById('jadwalCeklisContainer');
  if (!container) return;

  var programPilihan = localStorage.getItem('kemoenik_program_pilihan') || 'normal';
  var metode = programPilihan === 'if' ? 'if'
    : ((appState.quiz && appState.quiz.metode) ? appState.quiz.metode : 'standar');
  var jadwal = targetOlahragaData[metode] || targetOlahragaData.standar;

  var hariIdx = new Date().getDay(); // 0=Sun
  var hariMap = [6,0,1,2,3,4,5];    // Sun→index6, Mon→0, ...
  var todayJadwal = jadwal[hariMap[hariIdx]];
  var todayKey = new Date().toDateString();

  if (!todayJadwal) { container.innerHTML = ''; return; }

  var isRest = todayJadwal.aktivitas.indexOf('Istirahat') !== -1 || todayJadwal.aktivitas.indexOf('recovery') !== -1;
  var misiKey = 'olahraga_' + todayKey;
  var checked = appState.misiChecked && appState.misiChecked[misiKey];

  var warna = isRest ? '#9CA3AF' : '#2563EB';
  var bgWarna = isRest ? '#F9FAFB' : '#EFF6FF';
  var icon = isRest ? '😴' : '🏃';

  var html = '<div style="background:' + bgWarna + ';border:1.5px solid ' + (checked ? '#10B981' : warna) + ';border-radius:12px;padding:12px 14px;">';
  html += '<div style="font-size:11px;font-weight:700;color:' + warna + ';margin-bottom:6px;">' + icon + ' OLAHRAGA HARI INI</div>';
    html += "<div class=\"mission-item\" onclick=\"toggleMisi('" + misiKey + "', this)\" style=\"padding:0;border:none;\">";
  html += '<div class="mission-check' + (checked ? ' checked' : '') + '">';
  if (checked) html += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
  html += '</div>';
  html += '<div class="mission-text' + (checked ? ' done' : '') + '" style="font-size:13px;font-weight:600;">' + todayJadwal.aktivitas + '</div>';
  html += '</div></div>';

  setSafeHTML(container, html);
}
// ============================================================
// FUNGSI BARU: Render Misi berdasarkan program
// ============================================================
function renderMisiByProgram() {
  var programPilihan = localStorage.getItem('kemoenik_program_pilihan') || 'normal';
  var misiNormal = document.getElementById('misiNormal');
  var misiIF = document.getElementById('misiIF');
  if (misiNormal) misiNormal.classList.toggle('show', programPilihan !== 'if');
  if (misiIF) misiIF.classList.toggle('show', programPilihan === 'if');
  if (programPilihan === 'if') {
    renderMisiIF();
  } else {
    renderMisiNormal();
  }
}

// ============================================================
// FUNGSI BARU: Toggle Misi Harian
// ============================================================
function toggleMisi(misiKey, el) {
  var checkEl = el.querySelector('.mission-check');
  var textEl = el.querySelector('.mission-text');
  var isChecked = checkEl && checkEl.classList.contains('checked');
  var newVal = !isChecked;
  if (checkEl) {
    checkEl.classList.toggle('checked', newVal);
    checkEl.innerHTML = newVal
      ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'
      : '';
  }
  if (textEl) textEl.classList.toggle('done', newVal);
  state.set('misiChecked.' + misiKey, newVal);
  state._persist();
  var wa = localStorage.getItem('kemoenik_wa') || '';
  if (wa) DataService.saveMisiChecked(normalizeWA(wa), misiKey, newVal);
  if (newVal) showToast('✅ Misi tercatat! Keep going!');
  // Refresh motivasi text setelah centang
  var motEl = document.getElementById('motivasiOlahragaText');
  if (motEl) motEl.textContent = getRandomMotivasi();
}
window.toggleMisi = toggleMisi;


// ============================================================
// FUNGSI BARU: renderStatusIndikator — indikator aktif di topbar & bottom nav & profil
// ============================================================
function renderStatusIndikator() {
  var hasKalkulator = !!(appState.kalkulator && appState.kalkulator.dietCal);
  var hasQuiz       = !!(appState.quiz && appState.quiz.tipe);
  var isActive  = hasKalkulator && hasQuiz;
  var isPartial = hasKalkulator || hasQuiz;
  var warna = isActive ? '#10B981' : (isPartial ? '#F59E0B' : '#9CA3AF');

  // Badge kecil di bawah keranjang topbar
  var topEl = document.getElementById('topbarStatus');
  if (topEl) {
    if (isActive) {
      topEl.innerHTML = '<div style="width:8px;height:8px;border-radius:50%;background:#10B981;"></div>' +
        '<span style="font-size:9px;font-weight:700;color:#10B981;">Aktif</span>';
    } else if (isPartial) {
      topEl.innerHTML = '<div style="width:8px;height:8px;border-radius:50%;background:#F59E0B;"></div>' +
        '<span style="font-size:9px;font-weight:700;color:#F59E0B;">Sebagian</span>';
    } else {
      topEl.innerHTML = '<div style="width:8px;height:8px;border-radius:50%;background:#9CA3AF;"></div>' +
        '<span style="font-size:9px;font-weight:700;color:#9CA3AF;">Setup</span>';
    }
  }

  // Dot di ikon Kuis bottom nav
  var dot = document.getElementById('statusDot');
  if (dot) dot.style.background = warna;

  // Indikator di halaman Profil
  var profilStatus = document.getElementById('profilStatusIndicator');
  if (profilStatus) {
    if (isActive) {
      profilStatus.innerHTML = '<div style="width:8px;height:8px;border-radius:50%;background:#10B981;"></div><span>Aktif</span>';
    } else if (isPartial) {
      profilStatus.innerHTML = '<div style="width:8px;height:8px;border-radius:50%;background:#F59E0B;"></div><span>Sebagian</span>';
    } else {
      profilStatus.innerHTML = '<div style="width:8px;height:8px;border-radius:50%;background:#9CA3AF;"></div><span>Setup</span>';
    }
  }
}

// ============================================================
// FUNGSI BARU: renderMakroShortcut — tampilkan P/L/K di shortcut home (DIPERBAIKI)
// ============================================================
function renderMakroShortcut() {
    var container = document.getElementById('shortcutMakro');
    if (!container) return;
    var k = appState.kalkulator;
    if (!k || !k.dietCal || !k.berat) {
        container.innerHTML = '<div style="font-size:10px;color:var(--text3);text-align:center;line-height:1.5;">Isi<br>kalkulator</div>';
        return;
    }
    var proteinMult = k.metode === 'ringan' ? 1.8 : k.metode === 'agresif' ? 2.2 : 2.0;
    var lemakMult = k.metode === 'ringan' ? 0.9 : k.metode === 'agresif' ? 0.7 : 0.8;
    var protein = (k.makro && k.makro.protein) ? k.makro.protein : Math.round(k.berat * proteinMult);
    var lemak = (k.makro && k.makro.lemak) ? k.makro.lemak : Math.round(k.berat * lemakMult);
    var karbo = (k.makro && k.makro.karbo) ? k.makro.karbo : Math.max(0, Math.round((k.dietCal - (protein * 4 + lemak * 9)) / 4));
    var macros = [{l:'Protein (g)',v:protein,c:'#10B981'},{l:'Lemak (g)',v:lemak,c:'#D97706'},{l:'Karbohidrat (g)',v:karbo,c:'#3B82F6'}];
    var html = '';
    macros.forEach(function(m) {
        html += '<div style="font-size:10px;font-weight:700;color:' + m.c + ';margin-bottom:2px;line-height:1.4;">' + m.l + ' <span style="font-size:12px;font-weight:800;">' + m.v + 'g</span></div>';
    });
    container.innerHTML = html;
}
