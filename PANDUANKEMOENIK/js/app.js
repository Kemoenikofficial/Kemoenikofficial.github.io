/*
 * app.js — KEMOENIK
 * Semua render functions: Home, Kalkulator, Quiz, Evaluasi, Profil, Menu, Notif, dll
 * Depends on: data.js, utils.js
 */

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
// FAQ DATA & RENDER
// ============================================================
var faqData = [
  {
    cat: 'Input & Evaluasi Progres',
    items: [
      { q: 'Kapan saya harus input berat badan terbaru?', a: 'Setiap minggu akhir setelah kapsul habis ya kak, lebih tepatnya pagi setelah bangun tidur & buang air kecil (jangan lupa untuk mengisi evaluasi mingguannya).' },
      { q: 'Kok berat badan saya belum turun di grafik?', a: 'Lemak turun bisa jadi massa otot naik, tetap konsisten menjalankan programnya, jangan lupa baca semua panduannya.' },
      { q: 'Saya salah masukkan angka timbangan, gimana cara ubahnya?', a: 'Semua data bisa di edit dan dapat dihapus melalui tombol edit di riwayat evaluasi. Semangat kak!' }
    ]
  },
  {
    cat: 'Konsumsi Kapsul & Reaksi Tubuh',
    items: [
      { q: 'Kok belum turun di hari ke-5–7?', a: 'Proses detoks tiap orang berbeda-beda ya kak, ada yang cepet ada yang lambat. Yang terpenting ikuti program ini supaya dapat hasil maksimal, semangat kak.' },
      { q: 'Kapan waktu terbaik minum kapsul KEMOENIK?', a: 'Waktu terbaik adalah sesudah makan ya kak.' },
      { q: 'Kenapa saya jadi sering buang air kecil?', a: 'Itu reaksi normal dari kandungan Tempuyung yang bersifat diuretik alami untuk membuang kelebihan cairan dan toksin. Pastikan minum air putih 2–3 liter sehari.' },
      { q: 'BAB jadi lebih lunak, apakah ini diare?', a: 'Bukan diare ya kak, itu efek peluruhan lemak dari kandungan Jati Belanda. Jangan khawatir, tetap semangat dan konsisten.' },
      { q: 'Lagi haid/menstruasi, boleh tetap minum?', a: 'Sarankan jeda di hari 1–3 ya kak.' }
    ]
  },
  {
    cat: 'Teknis Menu & Diet',
    items: [
      { q: 'Saya alergi/tidak suka menu hari ini, boleh diganti?', a: 'Boleh banget kak, asal defisit kalori ya. Sudah tersedia plan pengantinya di Custom Menu.' },
      { q: 'Bagaimana kalau ada acara makan (kondangan)?', a: 'Tidak apa kak untuk sekali-kali, asal dibarengi olahraga dan defisit kalori ya. Minum kapsul KEMOENIK sebelum makan pesta agar lemak tidak langsung terserap.' },
      { q: 'Kalau "cheating" sehari, apakah program gagal?', a: 'Jangan menyerah! Lanjutkan saja program di hari berikutnya. Kapsul KEMOENIK akan membantu, tapi jangan sering-sering ya Kak!' },
      { q: 'Kenapa disuruh minum air putih terus?', a: 'Untuk menghindari dehidrasi akibat efek detoksifikasi herbal KEMOENIK. Disarankan minum 2 liter/hari disesuaikan dengan aktivitas.' }
    ]
  },
  {
    cat: 'Aturan Pakai & Kondisi Khusus',
    items: [
      { q: 'Boleh minum lebih dari 6 kapsul/hari?', a: 'Tetap mengikuti anjuran 6 kapsul/hari ya kak sesuai panduan.' },
      { q: 'Boleh saat haid? Aman untuk Busui?', a: 'Untuk haid: jeda saat H1–H3 ya kak. Untuk Busui: kami anjurkan jangan dulu karena KEMOENIK ini peluntur lemak.' },
      { q: 'Boleh minum bersama obat dokter?', a: 'Boleh kak, sarankan memberi jeda sekitar 30 menit ya.' },
      { q: 'Apakah bikin ketergantungan atau jantung berdebar?', a: 'KEMOENIK 100% herbal tanpa BKO. Tidak membuat jantung berdebar karena fokus pada metabolisme alami, bukan stimulan kimia.' }
    ]
  },
  {
    cat: 'Data & Hasil',
    items: [
      { q: 'Berapa hari bisa kelihatan hasilnya?', a: 'Setiap metabolisme berbeda-beda, namun rata-rata pengguna mulai merasakan badan lebih ringan dan lingkar perut berkurang dalam 7–14 hari jika mengikuti program.' },
      { q: 'Apakah setelah berhenti minum BB akan naik (Yoyo Effect)?', a: 'Tidak, asalkan tetap menjaga pola makan sesuai edukasi menu. KEMOENIK membantu mengecilkan lambung secara alami sehingga nafsu makan lebih terkontrol.' },
      { q: 'Data saya aman tidak?', a: 'Data berat badan dan progres hanya digunakan untuk sistem kalkulator diet personal dan tidak akan disebarluaskan.' }
    ]
  }
];

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

function simpanKalkulator(btnEl) {
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
    if (!wa) {
      showToast('Error: WA tidak ditemukan');
      if (btnEl) { btnEl.innerHTML = origHtml; btnEl.disabled = false; }
      return;
    }

    var check = DataService.saveKalkulator(wa, data);

    if (!check.success && check.reason === 'exists') {
      showToast('Kalkulator sudah pernah diisi. Gunakan tombol Reset untuk mengulang.');
      if (btnEl) { btnEl.innerHTML = origHtml; btnEl.disabled = false; }
      return;
    }

    if (!check.success) {
      showToast('Gagal menyimpan, coba lagi');
      if (btnEl) { btnEl.innerHTML = origHtml; btnEl.disabled = false; }
      return;
    }

    state.set('kalkulator', data);
    state.set('user.nama', data.nama);

    window._tempKalData = null;

    if (btnEl) {
      btnEl.innerHTML = '<i class="fas fa-check"></i> Tersimpan!';
      setTimeout(function() { btnEl.innerHTML = origHtml; btnEl.disabled = false; }, 1500);
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

function resetKalkulator() {
  if (!confirm('Yakin reset kalkulator? Data akan dihapus dan bisa isi ulang.')) return;

  var wa = appState.user.wa || localStorage.getItem('kemoenik_wa');
  if (!wa) return;

  try {
    var userData = DataService.loadUserData(wa) || {};
    userData.kalkulator = null;
    userData.updatedAt = new Date().toISOString();
    DataService._save(wa, userData);

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

function saveWeeklyEval() {
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

    // Simpan ke localStorage via DataService
    var wa = appState.user.wa || localStorage.getItem('kemoenik_wa');
    if (wa) {
      DataService.saveEvaluasi(wa, evalData);
    }

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

// ============================================================
// QUIZ DATA & LOGIC
// ============================================================
var quizQuestions = [
  { text:"Ketika makan nasi dalam porsi besar (lebih dari 1 centong), apa yang biasanya kamu rasakan?", options:[{emoji:"😴",text:"Langsung mengantuk dan lemas",scores:[3,0,0,1,0,0,0]},{emoji:"😐",text:"Biasa saja, tidak ada efek khusus",scores:[0,0,0,0,0,0,3]},{emoji:"😤",text:"Perut kembung dan tidak nyaman",scores:[0,0,0,0,0,3,0]},{emoji:"⚡",text:"Justru merasa lebih berenergi",scores:[0,1,2,0,0,0,1]}]},
  { text:"Bagaimana kondisi berat badanmu dalam 6 bulan terakhir?", options:[{emoji:"📈",text:"Naik terus meski tidak makan banyak",scores:[2,2,0,1,1,0,0]},{emoji:"🔄",text:"Naik turun tidak stabil",scores:[1,1,0,0,2,0,1]},{emoji:"➡️",text:"Stagnan, susah turun meski sudah diet",scores:[1,2,0,2,0,0,0]},{emoji:"📉",text:"Bisa turun kalau konsisten diet",scores:[0,0,1,0,0,0,3]}]},
  { text:"Dimana lemak paling banyak menumpuk di tubuhmu?", options:[{emoji:"🍎",text:"Perut dan pinggang",scores:[2,2,0,1,0,0,0]},{emoji:"🍐",text:"Paha dan pinggul",scores:[1,1,0,1,1,0,0]},{emoji:"📏",text:"Merata di seluruh tubuh",scores:[0,1,0,2,0,0,1]},{emoji:"💪",text:"Lemak sedikit tapi susah berotot",scores:[0,0,3,0,0,0,0]}]},
  { text:"Bagaimana nafsu makanmu sehari-hari?", options:[{emoji:"🐘",text:"Selalu lapar, sulit kenyang",scores:[1,2,0,1,1,0,0]},{emoji:"⏰",text:"Lapar di jam tertentu saja",scores:[0,0,0,0,0,0,3]},{emoji:"😐",text:"Normal, tidak terlalu lapar",scores:[0,1,1,0,0,1,1]},{emoji:"😤",text:"Sering ngidam makanan manis/asin",scores:[2,0,0,0,2,0,0]}]},
  { text:"Apa yang terjadi setelah kamu makan makanan manis?", options:[{emoji:"📈",text:"Gula darah naik cepat, lalu drop dan lapar lagi",scores:[3,0,0,0,0,1,0]},{emoji:"😴",text:"Mengantuk dan ingin tidur",scores:[1,1,0,2,0,0,0]},{emoji:"⚡",text:"Merasa berenergi cukup lama",scores:[0,0,1,0,0,0,3]},{emoji:"🤢",text:"Tidak nyaman atau mual",scores:[0,0,0,0,0,3,0]}]},
  { text:"Bagaimana kualitas tidurmu?", options:[{emoji:"😴",text:"Sering susah tidur atau tidur tidak nyenyak",scores:[0,0,0,0,3,0,0]},{emoji:"🌙",text:"Tidur cukup dan berkualitas",scores:[0,0,0,0,0,0,3]},{emoji:"⏰",text:"Tidur mepet karena aktivitas padat",scores:[0,1,1,0,1,0,0]},{emoji:"💤",text:"Sering tidur berlebihan tapi tetap lelah",scores:[1,1,0,2,0,0,0]}]},
  { text:"Bagaimana kondisi perutmu sehari-hari?", options:[{emoji:"🎈",text:"Sering kembung walau tidak makan banyak",scores:[0,0,0,0,0,3,0]},{emoji:"😖",text:"Sering sembelit atau susah BAB",scores:[0,0,0,0,0,3,0]},{emoji:"✅",text:"Pencernaan lancar dan normal",scores:[0,0,0,0,0,0,3]},{emoji:"🔄",text:"Kadang bermasalah, kadang tidak",scores:[0,0,0,0,1,1,1]}]},
  { text:"Bagaimana tubuhmu merespons olahraga kardio?", options:[{emoji:"🔥",text:"Berkeringat banyak tapi BB tidak turun",scores:[1,3,0,0,0,0,0]},{emoji:"💪",text:"Berkeringat dan BB turun",scores:[0,0,0,0,0,0,3]},{emoji:"😓",text:"Cepat lelah, sulit kardio lama",scores:[0,0,0,3,0,0,0]},{emoji:"🏋️",text:"Lebih suka olahraga kekuatan/gym",scores:[0,0,3,0,0,0,0]}]},
  { text:"Bagaimana distribusi lemak di tubuhmu?", options:[{emoji:"🍎",text:"Banyak di perut (bentuk apel)",scores:[2,2,0,1,0,0,0]},{emoji:"🍐",text:"Banyak di pinggul/paha (bentuk pir)",scores:[1,1,0,1,1,0,0]},{emoji:"📏",text:"Merata di seluruh tubuh",scores:[0,1,0,2,0,0,1]},{emoji:"💪",text:"Lemak sedikit, tapi susah berotot",scores:[0,0,3,0,0,0,0]}]},
  { text:"Setelah makan makanan berlemak (gorengan, santan)?", options:[{emoji:"🤢",text:"Mual atau tidak nyaman di perut",scores:[0,0,0,0,0,3,0]},{emoji:"😴",text:"Langsung mengantuk dan lemas",scores:[1,2,0,1,0,0,0]},{emoji:"✅",text:"Tidak ada masalah",scores:[0,0,1,0,0,0,3]},{emoji:"⚡",text:"Justru merasa lebih berenergi",scores:[0,1,1,0,0,0,1]}]},
  { text:"Bagaimana kondisi kulitmu sehari-hari?", options:[{emoji:"🔴",text:"Mudah berjerawat atau kemerahan",scores:[1,0,0,0,1,2,0]},{emoji:"💧",text:"Kering dan kusam",scores:[0,1,0,2,0,1,0]},{emoji:"✨",text:"Normal dan sehat",scores:[0,0,0,0,0,0,3]},{emoji:"🌊",text:"Berminyak terutama di T-zone",scores:[1,0,0,0,2,1,0]}]},
  { text:"Apa yang terjadi saat kamu skip makan (puasa sebentar)?", options:[{emoji:"😡",text:"Langsung pusing, lemas, dan marah",scores:[2,0,1,0,1,0,0]},{emoji:"💪",text:"Tidak masalah, masih berenergi",scores:[0,2,0,0,0,0,2]},{emoji:"🎯",text:"Justru merasa lebih fokus",scores:[0,3,0,0,0,0,1]},{emoji:"😐",text:"Biasa saja, tidak terlalu terasa",scores:[0,1,0,1,0,0,2]}]},
  { text:"Bagaimana pola makan idealmu sehari-hari?", options:[{emoji:"🥩",text:"Lebih suka daging & protein, kurang suka karbo",scores:[0,0,3,0,0,0,0]},{emoji:"🥗",text:"Lebih suka sayur & buah, hindari lemak",scores:[0,0,0,0,0,2,1]},{emoji:"🍱",text:"Makan apa saja tapi porsi kecil",scores:[0,0,0,3,0,0,1]},{emoji:"⚖️",text:"Seimbang, semua dimakan secukupnya",scores:[0,0,0,0,0,0,3]}]},
  { text:"Bagaimana tingkat aktivitas fisikmu sehari-hari?", options:[{emoji:"🪑",text:"Sangat jarang gerak, kerja duduk",scores:[1,2,0,2,0,0,0]},{emoji:"🚶",text:"Kadang jalan kaki, tidak rutin olahraga",scores:[1,1,0,1,1,0,0]},{emoji:"🏃",text:"Olahraga ringan 2-3x seminggu",scores:[0,0,1,0,0,0,2]},{emoji:"💪",text:"Olahraga intens hampir setiap hari",scores:[0,0,3,0,0,0,1]}]},
  { text:"Apa pengalamanmu dengan program diet sebelumnya?", options:[{emoji:"😤",text:"Sudah coba banyak diet tapi tidak berhasil",scores:[1,2,0,1,1,0,0]},{emoji:"🔄",text:"Berhasil tapi berat balik lagi (yo-yo)",scores:[2,1,0,0,1,0,0]},{emoji:"📈",text:"Belum pernah coba diet serius",scores:[0,0,0,0,2,0,1]},{emoji:"✅",text:"Cukup berhasil kalau konsisten",scores:[0,0,0,0,0,0,3]}]}
];

var quizTypes = [
  {id:1,name:"Tipe Nasi Warrior",tagline:"Tubuhmu bereaksi kuat terhadap karbohidrat",emoji:"🍚",color:"#E07B39",bg:"#FEF0E6",textColor:"#7C2D12",metode:"standar",metodeName:"Standar + Kurangi Karbo",skor:78,tips:["Batasi nasi putih max 1 centong per makan","Ganti dengan nasi merah, ubi, atau kentang rebus","Makan karbo hanya di pagi & siang, hindari malam","Perbanyak protein & sayuran di setiap makan","KEMOENIK membantu menstabilkan respons gula darah"],hindari:"Nasi putih, roti putih, minuman manis",anjuran:"Nasi merah, ubi jalar, oatmeal"},
  {id:2,name:"Tipe Lemak Fighter",tagline:"Tubuhmu butuh dorongan ekstra untuk bakar lemak",emoji:"🔥",color:"#E53E3E",bg:"#FEF2F2",textColor:"#7F1D1D",metode:"agresif",metodeName:"Agresif + Intermittent Fasting 16:8",skor:72,tips:["Terapkan IF 16:8: makan dalam jendela 8 jam saja","Contoh: makan jam 10.00–18.00, puasa sisanya","Fokus pada makanan rendah lemak jenuh","Kardio minimal 30 menit setiap hari","KEMOENIK diminum saat buka puasa untuk efek maksimal"],hindari:"Gorengan, santan, makanan olahan berlemak",anjuran:"Dada ayam, ikan, tempe, sayuran hijau"},
  {id:3,name:"Tipe Otot Aktif",tagline:"Tubuhmu lebih optimal dengan asupan protein tinggi",emoji:"💪",color:"#3182CE",bg:"#EBF8FF",textColor:"#1E3A5F",metode:"standar",metodeName:"Standar + Tinggi Protein",skor:82,tips:["Target protein 1.8–2.2g per kg berat badan","Makan protein di setiap waktu makan utama","Kombinasikan kardio dengan latihan kekuatan","Konsumsi protein 30 menit setelah olahraga","KEMOENIK membantu pemulihan dan metabolisme optimal"],hindari:"Diet terlalu rendah kalori yang merusak otot",anjuran:"Telur, dada ayam, tempe, ikan, Greek yogurt"},
  {id:4,name:"Tipe Hemat Energi",tagline:"Metabolismemu bekerja lebih pelan dari rata-rata",emoji:"🐢",color:"#7C3AED",bg:"#F5F3FF",textColor:"#4C1D95",metode:"ringan",metodeName:"Ringan + Konsisten Jangka Panjang",skor:68,tips:["Jangan potong kalori drastis, kurangi perlahan","Defisit kecil (300 kcal) lebih efektif untuk tipe ini","Perbanyak aktivitas ringan: jalan kaki, naik tangga","Makan lebih sering dalam porsi kecil (5–6x sehari)","KEMOENIK membantu meningkatkan metabolisme secara alami"],hindari:"Diet ekstrem atau crash diet",anjuran:"Makanan tinggi serat, protein, dan air"},
  {id:5,name:"Tipe Mood & Lifestyle",tagline:"Gaya hidupmu sangat mempengaruhi berat badanmu",emoji:"🌙",color:"#D97706",bg:"#FFFBEB",textColor:"#78350F",metode:"ringan",metodeName:"Ringan + Kelola Stres & Tidur",skor:70,tips:["Prioritaskan tidur 7–8 jam per malam","Kelola stres dengan meditasi atau olahraga ringan","Hindari makan larut malam saat stres","Buat rutinitas makan yang teratur setiap hari","KEMOENIK membantu keseimbangan hormonal secara alami"],hindari:"Begadang, makan emosional, kafein berlebih",anjuran:"Pisang, dark chocolate, teh herbal"},
  {id:6,name:"Tipe Perut Sensitif",tagline:"Sistem pencernaanmu butuh perhatian ekstra",emoji:"🌿",color:"#059669",bg:"#ECFDF5",textColor:"#064E3B",metode:"standar",metodeName:"Standar + Anti Inflamasi",skor:75,tips:["Hindari makanan pemicu: susu, gluten, gorengan","Perbanyak probiotik: yogurt, tempe, kimchi","Makan perlahan dan kunyah hingga halus","Hindari makan terburu-buru atau sambil stres","KEMOENIK dengan herbal alami bantu sehatkan pencernaan"],hindari:"Susu, gorengan, makanan pedas berlebih, gluten",anjuran:"Yogurt, tempe, sayuran rebus, buah non-asam"},
  {id:7,name:"Tipe Seimbang",tagline:"Tubuhmu sudah baik, kuncinya konsistensi!",emoji:"⚖️",color:"#2D5A3D",bg:"#F0FDF4",textColor:"#14532D",metode:"standar",metodeName:"Standar + Konsistensi",skor:88,tips:["Tubuhmu merespons baik terhadap diet seimbang","Tetap pada defisit kalori yang konsisten setiap hari","Variasikan menu agar tidak bosan","Olahraga kombinasi kardio + kekuatan 3–4x seminggu","KEMOENIK sebagai pendamping untuk hasil lebih optimal"],hindari:"Inkonsistensi dan cheat meal berlebihan",anjuran:"Semua makanan bergizi dalam porsi seimbang"}
];


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
  setSafeHTML(document.getElementById('jadwalNormalList'), html);
}

function renderHomeJadwal() {
  var el = document.getElementById('homeJadwalContent');
  if (!el) { console.warn('homeJadwalContent not found'); return; }
  // Guard: targetOlahragaData harus sudah ada
  if (!targetOlahragaData || !targetOlahragaData.standar) {
    console.warn('targetOlahragaData belum ready, retry...');
    setTimeout(renderHomeJadwal, 200);
    return;
  }
  try {
    var metode = (appState.quiz && appState.quiz.metode) ? appState.quiz.metode : 'standar';
    var jadwal = targetOlahragaData[metode] || targetOlahragaData['standar'];
    var hariIdx = new Date().getDay(); // 0=Min, 1=Sen, ... 6=Sab
    var hariMap = [6, 0, 1, 2, 3, 4, 5]; // JS getDay() ke index array jadwal
    var todayData = jadwal[hariMap[hariIdx]] || jadwal[0];
    var hariNames = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    var hariName = hariNames[hariIdx];
    var akt = todayData.aktivitas || '';
    var isRest = akt.indexOf('Istirahat') !== -1 || akt.indexOf('recovery') !== -1;

    var html = '';
    // Header hari ini
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">';
    html += '<div style="width:44px;height:44px;border-radius:13px;background:' + (isRest ? '#F3F4F6' : 'linear-gradient(135deg,var(--green),var(--green3))') + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;">';
    if (isRest) {
      html += '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>';
    } else {
      html += '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v8"/><path d="M8 12l4 3 4-3"/><path d="M8 19l-2 3M16 19l2 3"/></svg>';
    }
    html += '</div>';
    html += '<div style="flex:1;">';
    html += '<div style="font-size:14px;font-weight:800;color:var(--text);">' + hariName + (isRest ? ' — Hari Istirahat' : ' — Olahraga Hari Ini') + '</div>';
    html += '<div style="font-size:11px;color:var(--text3);margin-top:1px;">Metode ' + metode.charAt(0).toUpperCase() + metode.slice(1) + '</div>';
    html += '</div></div>';

    // Konten aktivitas
    html += '<div style="background:' + (isRest ? '#F9FAFB' : '#ECFDF5') + ';border-radius:12px;padding:12px 14px;margin-bottom:12px;">';
    html += '<div style="font-size:13px;color:' + (isRest ? '#6B7280' : '#065F46') + ';font-weight:' + (isRest ? '400' : '700') + ';line-height:1.7;">' + akt + '</div>';
    if (!isRest) {
      var dur = akt.indexOf('60') !== -1 ? '60 menit' : akt.indexOf('45') !== -1 ? '45 menit' : akt.indexOf('20') !== -1 ? '20 menit' : '30 menit';
      html += '<div style="display:flex;gap:8px;margin-top:10px;">';
      html += '<div style="background:white;border-radius:8px;padding:5px 10px;display:flex;align-items:center;gap:5px;">';
      html += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
      html += '<span style="font-size:11px;color:var(--green);font-weight:700;">' + dur + '</span></div>';
      html += '<div style="background:white;border-radius:8px;padding:5px 10px;display:flex;align-items:center;gap:5px;">';
      html += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E07B39" stroke-width="2.5" stroke-linecap="round"><path d="M12 2c-4 6-6 9-6 13a6 6 0 0012 0c0-4-2-7-6-13z"/></svg>';
      html += '<span style="font-size:11px;color:#E07B39;font-weight:700;">~150 kkal</span></div>';
      html += '</div>';
    } else {
      html += '<div style="font-size:11px;color:#9CA3AF;margin-top:6px;">Istirahat optimal untuk pemulihan. Cukup lymphatic drainage ringan malam ini.</div>';
    }
    html += '</div>';

    // Tombol jadwal lengkap di dalam konten
    html += '<button onclick="openPanel(&quot;panelJadwalOlahraga&quot;)" style="width:100%;padding:10px;background:var(--green);color:white;border:none;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px;">';
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

// ============================================================
// MENU HARIAN
// ============================================================
var menuHarianData = [
  { time:'07:00', label:'Sarapan', menu:'2 Telur Rebus + 1 Pisang / Ubi', cal:220, icon:'🍳' },
  { time:'10:00', label:'Snack Pagi', menu:'Buah segar (jeruk/pepaya) + kacang', cal:120, icon:'🍊' },
  { time:'12:00', label:'Makan Siang', menu:'Nasi ½ porsi + Lauk protein + Sayuran', cal:450, icon:'🍱' },
  { time:'15:00', label:'Snack Sore', menu:'Pisang / Singkong rebus / Yogurt', cal:130, icon:'🍌' },
  { time:'18:00', label:'Makan Malam', menu:'Ikan/Ayam bakar + Sayuran + Sedikit nasi', cal:380, icon:'🍽️' }
];

function renderMenuHarian() {
  var k = appState.kalkulator;
  var totalCal = k ? Math.round(k.dietCal) : 1450;
  if (document.getElementById('mealTargetDisplay')) document.getElementById('mealTargetDisplay').textContent = totalCal;

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
  setSafeHTML(document.getElementById('menuHariIni'), html);
}

function switchMenuTab(tab, btn) {
  ['ekonomis','standar','premium','custom'].forEach(function(t){
    var el = document.getElementById('tabMenu' + t.charAt(0).toUpperCase() + t.slice(1));
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('.menu-tab-btn').forEach(function(b){ b.classList.remove('on'); });
  if (btn) btn.classList.add('on');

  if (tab === 'custom') renderCmFoodGrid();
}

// ============================================================
// CUSTOM MENU
// ============================================================
var cmFoodDatabase = [
  {id:1,name:"Telur Ayam",category:"protein-hewani",unit:"butir",baseCal:78,baseAmount:1},
  {id:2,name:"Dada Ayam (Rebus)",category:"protein-hewani",unit:"gram",baseCal:165,baseAmount:100},
  {id:3,name:"Dada Ayam (Goreng)",category:"protein-hewani",unit:"gram",baseCal:220,baseAmount:100},
  {id:4,name:"Ikan Kembung (Rebus)",category:"protein-hewani",unit:"gram",baseCal:167,baseAmount:100},
  {id:5,name:"Ikan Salmon",category:"protein-hewani",unit:"gram",baseCal:208,baseAmount:100},
  {id:6,name:"Ikan Tuna (Kaleng)",category:"protein-hewani",unit:"gram",baseCal:116,baseAmount:100},
  {id:7,name:"Udang (Rebus)",category:"protein-hewani",unit:"gram",baseCal:106,baseAmount:100},
  {id:8,name:"Daging Sapi (Rebus)",category:"protein-hewani",unit:"gram",baseCal:250,baseAmount:100},
  {id:9,name:"Tempe (Rebus)",category:"protein-nabati",unit:"gram",baseCal:192,baseAmount:100},
  {id:10,name:"Tempe (Goreng)",category:"protein-nabati",unit:"gram",baseCal:280,baseAmount:100},
  {id:11,name:"Tahu Putih",category:"protein-nabati",unit:"gram",baseCal:68,baseAmount:100},
  {id:12,name:"Tahu Goreng",category:"protein-nabati",unit:"gram",baseCal:200,baseAmount:100},
  {id:13,name:"Edamame",category:"protein-nabati",unit:"gram",baseCal:121,baseAmount:100},
  {id:14,name:"Kacang Hijau",category:"protein-nabati",unit:"gram",baseCal:105,baseAmount:100},
  {id:15,name:"Nasi Putih",category:"karbohidrat",unit:"gram",baseCal:130,baseAmount:100},
  {id:16,name:"Nasi Merah",category:"karbohidrat",unit:"gram",baseCal:111,baseAmount:100},
  {id:17,name:"Kentang (Rebus)",category:"karbohidrat",unit:"gram",baseCal:87,baseAmount:100},
  {id:18,name:"Ubi Jalar (Rebus)",category:"karbohidrat",unit:"gram",baseCal:90,baseAmount:100},
  {id:19,name:"Oatmeal",category:"karbohidrat",unit:"gram",baseCal:68,baseAmount:100},
  {id:20,name:"Roti Gandum",category:"karbohidrat",unit:"iris",baseCal:74,baseAmount:1},
  {id:21,name:"Alpukat",category:"lemak",unit:"gram",baseCal:160,baseAmount:100},
  {id:22,name:"Minyak Zaitun",category:"lemak",unit:"sdm",baseCal:119,baseAmount:1},
  {id:23,name:"Keju Cheddar",category:"lemak",unit:"gram",baseCal:402,baseAmount:100},
  {id:24,name:"Bayam (Rebus)",category:"sayuran",unit:"gram",baseCal:23,baseAmount:100},
  {id:25,name:"Brokoli (Rebus)",category:"sayuran",unit:"gram",baseCal:35,baseAmount:100},
  {id:26,name:"Wortel (Rebus)",category:"sayuran",unit:"gram",baseCal:35,baseAmount:100},
  {id:27,name:"Kangkung (Tumis)",category:"sayuran",unit:"gram",baseCal:50,baseAmount:100},
  {id:28,name:"Tomat",category:"sayuran",unit:"gram",baseCal:18,baseAmount:100},
  {id:29,name:"Mentimun",category:"sayuran",unit:"gram",baseCal:15,baseAmount:100},
  {id:30,name:"Jamur (Tumis)",category:"sayuran",unit:"gram",baseCal:40,baseAmount:100},
  {id:31,name:"Pisang",category:"buah",unit:"buah",baseCal:105,baseAmount:1},
  {id:32,name:"Apel",category:"buah",unit:"buah",baseCal:95,baseAmount:1},
  {id:33,name:"Jeruk",category:"buah",unit:"buah",baseCal:62,baseAmount:1},
  {id:34,name:"Semangka",category:"buah",unit:"gram",baseCal:30,baseAmount:100},
  {id:35,name:"Pepaya",category:"buah",unit:"gram",baseCal:43,baseAmount:100},
  {id:36,name:"Mangga",category:"buah",unit:"gram",baseCal:60,baseAmount:100},
  {id:37,name:"Susu Low Fat",category:"susu",unit:"ml",baseCal:42,baseAmount:100},
  {id:38,name:"Yogurt Plain",category:"susu",unit:"gram",baseCal:59,baseAmount:100},
  {id:39,name:"Greek Yogurt",category:"susu",unit:"gram",baseCal:59,baseAmount:100},
  {id:40,name:"Almond",category:"kacang-biji",unit:"gram",baseCal:579,baseAmount:100},
  {id:41,name:"Kacang Tanah",category:"kacang-biji",unit:"gram",baseCal:567,baseAmount:100},
  {id:42,name:"Chia Seed",category:"kacang-biji",unit:"sdm",baseCal:60,baseAmount:1},
  {id:43,name:"Protein Whey",category:"diet",unit:"sendok",baseCal:120,baseAmount:1},
  {id:44,name:"Psyllium Husk",category:"diet",unit:"sdm",baseCal:20,baseAmount:1}
];

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
  document.querySelectorAll('#cmCatFilter button').forEach(function(b){
    b.style.background = 'var(--white)'; b.style.color = 'var(--text3)'; b.style.border = '1px solid var(--border)';
  });
  if (btn) { btn.style.background = 'var(--green)'; btn.style.color = '#FFF'; btn.style.border = '1px solid var(--green)'; }
  renderCmFoodGrid();
}

function renderCmFoodGrid() {
  var k = appState.kalkulator;
  if (k && k.dietCal) { cmTargetCalories = Math.round(k.dietCal); document.getElementById('cmTargetCal').value = cmTargetCalories; document.getElementById('cmCurrentTarget').textContent = cmTargetCalories + ' kcal'; document.getElementById('cmDisplayTarget').textContent = cmTargetCalories; }
  var foods = cmCurrentCategory === 'all' ? cmFoodDatabase : cmFoodDatabase.filter(function(f){ return f.category === cmCurrentCategory; });
  var html = '';
  foods.forEach(function(f) {
    var isSel = cmSelectedItems.find(function(s){ return s.id === f.id; });
    html += '<div class="cm-food-item' + (isSel ? ' cm-selected' : '') + '" onclick="cmToggleFood(' + f.id + ')">';
    html += '<div class="cm-check">✓</div>';
    html += '<div class="cm-name">' + f.name + '</div>';
    html += '<div class="cm-cal">' + f.baseCal + ' kkal/' + f.baseAmount + ' ' + f.unit + '</div>';
    html += '</div>';
  });
  setSafeHTML(document.getElementById('cmFoodGrid'), html);
}

function cmToggleFood(id) {
  var food = cmFoodDatabase.find(function(f){ return f.id === id; });
  var idx = cmSelectedItems.findIndex(function(s){ return s.id === id; });
  if (idx >= 0) { cmSelectedItems.splice(idx, 1); }
  else { cmSelectedItems.push({ id: food.id, name: food.name, cal: food.baseCal, amount: food.baseAmount, unit: food.unit, baseCal: food.baseCal, baseAmount: food.baseAmount }); }
  renderCmFoodGrid();
  cmUpdateSummary();
}

function cmUpdateSummary() {
  var total = cmSelectedItems.reduce(function(sum, item){ return sum + (item.baseAmount > 0 ? Math.round(item.cal * item.amount / item.baseAmount) : 0); }, 0);
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

// ============================================================
// QUIZ LOGIC
// ============================================================
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
  q.options.forEach(function(opt, idx){
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
  btnNext.innerHTML = currentQ === 14 ? '<i class="fas fa-chart-bar"></i> Lihat Hasil' : 'Lanjut <i class="fas fa-arrow-right"></i>';
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
  selectedAnswers.forEach(function(ansIdx, qIdx){
    if (ansIdx === null) return;
    quizQuestions[qIdx].options[ansIdx].scores.forEach(function(val, tIdx){ scores[tIdx] += val; });
  });
  var maxIdx = scores.indexOf(Math.max.apply(null, scores));
  return quizTypes[maxIdx];
}

function showResult() {
  try {
  finalResult = calculateResult();
  document.getElementById('quizRunning').style.display = 'none';
  document.getElementById('quizResult').style.display = 'block';

  // Fill result UI
  document.getElementById('qrTypeName').innerHTML = 'Tipe <em>' + escHtml(finalResult.name.replace('Tipe ','')) + '</em>';
  document.getElementById('qrTagline').textContent = finalResult.tagline;
  document.getElementById('qrMetodeName').textContent = finalResult.metodeName;
  document.getElementById('qrScore').textContent = finalResult.skor;
  setTimeout(function(){ document.getElementById('qrGaugeBar').style.width = finalResult.skor + '%'; }, 400);

  // Trait cards for result
  var traits = traitDataByType[finalResult.id] || traitDataByType[2];
  var tHtml = '';
  traits.forEach(function(t) {
    tHtml += '<div class="trait-card"><div class="trait-top"><div class="trait-name">' + t.name + '</div><div class="trait-badge ' + t.badgeClass + '">' + t.badge + '</div></div>';
    tHtml += '<div class="trait-bar-bg"><div class="trait-bar-marker" style="left:' + t.pct + '%"></div></div>';
    tHtml += '<div class="trait-labels">' + t.labels.map(function(l){ return '<span>' + l + '</span>'; }).join('') + '</div>';
    tHtml += '<div class="trait-desc">' + t.desc + '</div></div>';
  });
  setSafeHTML(document.getElementById('quizTraitCards'), tHtml);

  // Tips content
  var tipsHtml = '<div style="background:' + finalResult.bg + ';border-radius:14px;padding:14px;margin-bottom:14px;">';
  tipsHtml += '<div style="font-size:12px;font-weight:700;color:' + finalResult.textColor + ';margin-bottom:8px;">🎯 Metode Kamu: ' + finalResult.metodeName + '</div>';
  tipsHtml += '</div>';
  finalResult.tips.forEach(function(tip) {
    tipsHtml += '<div style="display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border);">';
    tipsHtml += '<div style="color:var(--green);font-size:14px;margin-top:1px;">✓</div>';
    tipsHtml += '<div style="font-size:13px;color:var(--text3);line-height:1.6;">' + tip + '</div></div>';
  });
  setSafeHTML(document.getElementById('quizTipsContent'), tipsHtml);

  // Program content (jadwal olahraga)
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
  setSafeHTML(document.getElementById('quizProgramContent'), progHtml);

  // Simpan ke localStorage via DataService
  var qData = {
    tipe: finalResult.id, tipeName: finalResult.name, metode: finalResult.metode,
    metodeName: finalResult.metodeName, tagline: finalResult.tagline,
    skor: finalResult.skor, tipe_emoji: finalResult.emoji
  };
  state.set('quiz', qData);

  // Cache ke localStorage
  try {
    localStorage.setItem('kemoenik_quiz', JSON.stringify(qData));
  } catch(e) {}

  // Simpan ke localStorage
  var waForQuiz = appState.user.wa || localStorage.getItem('kemoenik_wa');
  if (waForQuiz) {
    DataService.saveQuiz(waForQuiz, qData);
  }

  renderAll();
  gtag('event', 'quiz_completed', { tipe: finalResult.name });
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
    if (!wa) {
      showToast('Error: WA tidak ditemukan');
      return;
    }

    var qData = {
      tipe: finalResult.id,
      tipeName: finalResult.name,
      metode: finalResult.metode,
      metodeName: finalResult.metodeName,
      tagline: finalResult.tagline,
      skor: finalResult.skor,
      tipe_emoji: finalResult.emoji
    };

    var check = DataService.saveQuiz(wa, qData);
    if (!check.success && check.reason === 'exists') {
      showToast('Kuis sudah pernah diisi. Gunakan tombol Reset Quiz untuk mengulang.');
      return;
    }
    if (!check.success) {
      showToast('Gagal menyimpan hasil kuis');
      return;
    }

    state.set('quiz', qData);
    state._persist();

    updateQuizResetButtonVisibility();

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
  if (!wa) return;

  try {
    var userData = DataService.loadUserData(wa) || {};
    userData.quiz = null;
    userData.updatedAt = new Date().toISOString();
    DataService._save(wa, userData);

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
  document.querySelectorAll('.result-tab-panel').forEach(function(p){ p.classList.remove('on'); });
  document.querySelectorAll('.rt-btn').forEach(function(b){ b.classList.remove('on'); });
  document.getElementById('rt' + name.charAt(0).toUpperCase() + name.slice(1)).classList.add('on');
  if (btn) btn.classList.add('on');
}

// ============================================================
// NOTIFICATION & REMINDER SYSTEM
// ============================================================
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
window.NotificationService = NotificationService;

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

// Check reminder setiap menit
setInterval(checkAndShowReminder, 60000);
setTimeout(checkAndShowReminder, 2000);

// ============================================================
// DRAWER RENDER
// ============================================================
function renderDrawer() {
  var k = appState.kalkulator;
  var nama = k ? k.nama : (appState.user.nama || '—');
  document.getElementById('dName').textContent = nama || '—';
  var dSub = appState.quiz ? appState.quiz.tipeName : 'Program Diet KEMOENIK';
  document.getElementById('dSub').textContent = dSub;
}

// ============================================================
// OPEN PANEL HOOKS
// ============================================================
// (panel hooks sudah diintegrasikan langsung ke openPanel di atas)

// ============================================================
// INIT on DOM ready
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  renderFAQ();
  // Load mission state
  var mode = localStorage.getItem('kemoenik_mission_mode') || 'normal';
  setMissionMode(mode);
});

// Trap click outside modals that are open
window.addEventListener('keydown', function(e){
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-panel.on').forEach(function(p){ closePanel(p.id); });
  }
});
