// ============================================================
// DATA STATIS DAN LAYANAN PENYIMPANAN - KEMOENIK
// ============================================================

// ========== STATE GLOBAL ==========
var appState = {}; // akan diisi oleh state dan localStorage

var state = {
    data: {},
    set: function(key, val) {
        var parts = key.split('.');
        var obj = this.data;
        for (var i = 0; i < parts.length - 1; i++) {
            var part = parts[i];
            if (!obj[part]) obj[part] = {};
            obj = obj[part];
        }
        obj[parts[parts.length - 1]] = val;
        // update appState juga agar sinkron
        window.appState = this.data;
    },
    get: function(key) {
        var parts = key.split('.');
        var obj = this.data;
        for (var i = 0; i < parts.length; i++) {
            if (obj[parts[i]] === undefined) return undefined;
            obj = obj[parts[i]];
        }
        return obj;
    },
    _persist: function() {
        localStorage.setItem('kemoenik_appState', JSON.stringify(this.data));
    }
};

// Muat state dari localStorage jika ada
try {
    var saved = localStorage.getItem('kemoenik_appState');
    if (saved) {
        state.data = JSON.parse(saved);
        appState = state.data;
    }
} catch(e) {}

// ========== DATA QUIZ ==========
var quizTypes = [
    {
        id: 0,
        name: 'Tipe Cepat',
        metode: 'agresif',
        metodeName: 'Agresif + IF',
        tagline: 'Metabolisme cepat, mudah lapar',
        skor: 88,
        emoji: '⚡',
        bg: '#FEF3C7',
        textColor: '#92400E',
        tips: [
            'Konsumsi protein tinggi untuk menjaga kenyang lebih lama',
            'Olahraga intensitas tinggi 3-4x seminggu',
            'Hindari karbohidrat sederhana'
        ],
        hindari: 'Gula, makanan olahan, karbohidrat simple',
        anjuran: 'Protein tanpa lemak, sayuran tinggi serat, lemak sehat'
    },
    {
        id: 1,
        name: 'Tipe Lambat',
        metode: 'ringan',
        metodeName: 'Ringan',
        tagline: 'Metabolisme cenderung lambat, mudah menyimpan lemak',
        skor: 82,
        emoji: '🐢',
        bg: '#E0F2FE',
        textColor: '#0369A1',
        tips: [
            'Makan dalam porsi kecil tapi sering',
            'Fokus pada makanan termogenik (cabai, jahe)',
            'Hindari makan malam berat'
        ],
        hindari: 'Makanan berlemak tinggi, gorengan',
        anjuran: 'Protein tanpa lemak, sayuran, karbohidrat kompleks'
    },
    {
        id: 2,
        name: 'Tipe Seimbang',
        metode: 'standar',
        metodeName: 'Standar',
        tagline: 'Metabolisme normal, responsif terhadap diet',
        skor: 85,
        emoji: '⚖️',
        bg: '#DCFCE7',
        textColor: '#166534',
        tips: [
            'Makan teratur dengan porsi seimbang',
            'Kombinasi cardio dan strength training',
            'Batasi gula tambahan'
        ],
        hindari: 'Makanan cepat saji, minuman manis',
        anjuran: 'Makanan utuh, protein tanpa lemak, sayur'
    },
    {
        id: 3,
        name: 'Tipe Insulin Resisten',
        metode: 'agresif',
        metodeName: 'Agresif + IF',
        tagline: 'Sulit mengontrol gula darah, mudah lapar',
        skor: 90,
        emoji: '🩸',
        bg: '#FEE2E2',
        textColor: '#991B1B',
        tips: [
            'Batasi karbohidrat, pilih yang rendah glikemik',
            'Olahraga rutin untuk sensitivitas insulin',
            'IF 16:8 sangat direkomendasikan'
        ],
        hindari: 'Nasi putih, roti putih, gula',
        anjuran: 'Protein tanpa lemak, sayuran non-starch, lemak sehat'
    },
    {
        id: 4,
        name: 'Tipe Hormonal',
        metode: 'standar',
        metodeName: 'Standar',
        tagline: 'Dipengaruhi siklus hormonal, mudah retensi air',
        skor: 78,
        emoji: '🌸',
        bg: '#FCE7F3',
        textColor: '#9D174D',
        tips: [
            'Kurangi garam untuk mengurangi retensi air',
            'Tingkatkan magnesium (kacang, biji)',
            'Olahraga ringan saat PMS'
        ],
        hindari: 'Makanan asin, kafein berlebih',
        anjuran: 'Makanan kaya magnesium, air putih cukup'
    },
    {
        id: 5,
        name: 'Tipe Aktif',
        metode: 'standar',
        metodeName: 'Standar',
        tagline: 'Aktif bergerak, butuh asupan lebih',
        skor: 86,
        emoji: '🏃',
        bg: '#E0F2FE',
        textColor: '#0369A1',
        tips: [
            'Pastikan asupan protein cukup untuk pemulihan',
            'Makan sebelum dan sesudah olahraga',
            'Jangan takut karbohidrat kompleks'
        ],
        hindari: 'Diet sangat rendah kalori',
        anjuran: 'Karbohidrat kompleks, protein tanpa lemak'
    },
    {
        id: 6,
        name: 'Tipe Stres',
        metode: 'ringan',
        metodeName: 'Ringan',
        tagline: 'Stres mempengaruhi metabolisme, mudah lapar emosional',
        skor: 80,
        emoji: '😮‍💨',
        bg: '#FEF9C3',
        textColor: '#854D0E',
        tips: [
            'Fokus pada makanan penenang (teh herbal, dark chocolate)',
            'Olahraga ringan seperti yoga',
            'Hindari stres eating dengan mindful eating'
        ],
        hindari: 'Makanan tinggi gula, kafein',
        anjuran: 'Makanan kaya magnesium, protein, sayur'
    }
];

var traitDataByType = {
    0: [ // Tipe Cepat
        { name: 'Kecepatan Metabolisme', pct: 85, badge: 'Cepat', badgeClass: 'badge-tinggi', labels: ['Lambat', 'Sedang', 'Cepat'], desc: 'Metabolisme basal tinggi, cepat lapar, butuh asupan sering.' },
        { name: 'Sensitivitas Insulin', pct: 70, badge: 'Baik', badgeClass: 'badge-optimal', labels: ['Resisten', 'Normal', 'Sensitif'], desc: 'Insulin cukup sensitif, karbohidrat dapat ditoleransi dengan baik.' },
        { name: 'Kecenderungan Lapar', pct: 80, badge: 'Sering Lapar', badgeClass: 'badge-tinggi', labels: ['Jarang', 'Normal', 'Sering'], desc: 'Cenderung cepat lapar, perlu ngemil sehat.' },
        { name: 'Respon Olahraga', pct: 75, badge: 'Responsif', badgeClass: 'badge-optimal', labels: ['Lambat', 'Sedang', 'Responsif'], desc: 'Respon baik terhadap olahraga intensitas tinggi.' },
        { name: 'Retensi Air', pct: 30, badge: 'Rendah', badgeClass: 'badge-perlu', labels: ['Rendah', 'Sedang', 'Tinggi'], desc: 'Tidak mudah retensi air.' }
    ],
    1: [ // Tipe Lambat
        { name: 'Kecepatan Metabolisme', pct: 30, badge: 'Lambat', badgeClass: 'badge-perlu', labels: ['Lambat', 'Sedang', 'Cepat'], desc: 'Metabolisme basal rendah, mudah menyimpan lemak.' },
        { name: 'Sensitivitas Insulin', pct: 45, badge: 'Normal', badgeClass: 'badge-optimal', labels: ['Resisten', 'Normal', 'Sensitif'], desc: 'Sensitivitas insulin cukup, perlu jaga asupan karbo.' },
        { name: 'Kecenderungan Lapar', pct: 40, badge: 'Normal', badgeClass: 'badge-optimal', labels: ['Jarang', 'Normal', 'Sering'], desc: 'Lapar terkontrol, mudah kenyang.' },
        { name: 'Respon Olahraga', pct: 50, badge: 'Sedang', badgeClass: 'badge-optimal', labels: ['Lambat', 'Sedang', 'Responsif'], desc: 'Respon olahraga sedang, perlu konsistensi.' },
        { name: 'Retensi Air', pct: 60, badge: 'Sedang', badgeClass: 'badge-optimal', labels: ['Rendah', 'Sedang', 'Tinggi'], desc: 'Kadang retensi air, kurangi garam.' }
    ],
    2: [ // Tipe Seimbang
        { name: 'Kecepatan Metabolisme', pct: 60, badge: 'Sedang', badgeClass: 'badge-optimal', labels: ['Lambat', 'Sedang', 'Cepat'], desc: 'Metabolisme normal, responsif terhadap diet.' },
        { name: 'Sensitivitas Insulin', pct: 65, badge: 'Baik', badgeClass: 'badge-optimal', labels: ['Resisten', 'Normal', 'Sensitif'], desc: 'Insulin sensitif, karbo dapat diatur.' },
        { name: 'Kecenderungan Lapar', pct: 50, badge: 'Normal', badgeClass: 'badge-optimal', labels: ['Jarang', 'Normal', 'Sering'], desc: 'Lapar normal, mudah dikontrol.' },
        { name: 'Respon Olahraga', pct: 70, badge: 'Responsif', badgeClass: 'badge-optimal', labels: ['Lambat', 'Sedang', 'Responsif'], desc: 'Respon baik terhadap olahraga teratur.' },
        { name: 'Retensi Air', pct: 40, badge: 'Rendah', badgeClass: 'badge-perlu', labels: ['Rendah', 'Sedang', 'Tinggi'], desc: 'Tidak mudah retensi air.' }
    ],
    // Tambahkan untuk tipe lainnya sesuai kebutuhan (3-6) dengan data dummy
    3: [ // Tipe Insulin Resisten
        { name: 'Kecepatan Metabolisme', pct: 50, badge: 'Sedang', badgeClass: 'badge-optimal', labels: ['Lambat', 'Sedang', 'Cepat'], desc: 'Metabolisme sedang, tapi sensitivitas insulin rendah.' },
        { name: 'Sensitivitas Insulin', pct: 20, badge: 'Resisten', badgeClass: 'badge-perlu', labels: ['Resisten', 'Normal', 'Sensitif'], desc: 'Insulin resisten, perlu batasi karbo.' },
        { name: 'Kecenderungan Lapar', pct: 80, badge: 'Sering', badgeClass: 'badge-tinggi', labels: ['Jarang', 'Normal', 'Sering'], desc: 'Cepat lapar karena fluktuasi gula darah.' },
        { name: 'Respon Olahraga', pct: 60, badge: 'Sedang', badgeClass: 'badge-optimal', labels: ['Lambat', 'Sedang', 'Responsif'], desc: 'Respon olahraga sedang, perlu konsisten.' },
        { name: 'Retensi Air', pct: 50, badge: 'Sedang', badgeClass: 'badge-optimal', labels: ['Rendah', 'Sedang', 'Tinggi'], desc: 'Kadang retensi air.' }
    ],
    4: [ // Tipe Hormonal
        { name: 'Kecepatan Metabolisme', pct: 55, badge: 'Sedang', badgeClass: 'badge-optimal', labels: ['Lambat', 'Sedang', 'Cepat'], desc: 'Metabolisme fluktuatif tergantung siklus.' },
        { name: 'Sensitivitas Insulin', pct: 60, badge: 'Normal', badgeClass: 'badge-optimal', labels: ['Resisten', 'Normal', 'Sensitif'], desc: 'Insulin normal, tapi bisa berubah saat PMS.' },
        { name: 'Kecenderungan Lapar', pct: 70, badge: 'Sering', badgeClass: 'badge-tinggi', labels: ['Jarang', 'Normal', 'Sering'], desc: 'Lapar meningkat menjelang menstruasi.' },
        { name: 'Respon Olahraga', pct: 65, badge: 'Sedang', badgeClass: 'badge-optimal', labels: ['Lambat', 'Sedang', 'Responsif'], desc: 'Respon baik, tapi butuh variasi.' },
        { name: 'Retensi Air', pct: 80, badge: 'Tinggi', badgeClass: 'badge-tinggi', labels: ['Rendah', 'Sedang', 'Tinggi'], desc: 'Mudah retensi air saat PMS.' }
    ],
    5: [ // Tipe Aktif
        { name: 'Kecepatan Metabolisme', pct: 80, badge: 'Cepat', badgeClass: 'badge-tinggi', labels: ['Lambat', 'Sedang', 'Cepat'], desc: 'Metabolisme tinggi karena aktivitas fisik.' },
        { name: 'Sensitivitas Insulin', pct: 75, badge: 'Baik', badgeClass: 'badge-optimal', labels: ['Resisten', 'Normal', 'Sensitif'], desc: 'Insulin sensitif, karbo cepat terpakai.' },
        { name: 'Kecenderungan Lapar', pct: 70, badge: 'Sering', badgeClass: 'badge-tinggi', labels: ['Jarang', 'Normal', 'Sering'], desc: 'Sering lapar karena energi terbakar.' },
        { name: 'Respon Olahraga', pct: 90, badge: 'Sangat Responsif', badgeClass: 'badge-tinggi', labels: ['Lambat', 'Sedang', 'Responsif'], desc: 'Respon sangat baik terhadap olahraga.' },
        { name: 'Retensi Air', pct: 30, badge: 'Rendah', badgeClass: 'badge-perlu', labels: ['Rendah', 'Sedang', 'Tinggi'], desc: 'Minim retensi air.' }
    ],
    6: [ // Tipe Stres
        { name: 'Kecepatan Metabolisme', pct: 45, badge: 'Lambat', badgeClass: 'badge-perlu', labels: ['Lambat', 'Sedang', 'Cepat'], desc: 'Stres memperlambat metabolisme.' },
        { name: 'Sensitivitas Insulin', pct: 50, badge: 'Normal', badgeClass: 'badge-optimal', labels: ['Resisten', 'Normal', 'Sensitif'], desc: 'Sensitivitas insulin menurun saat stres.' },
        { name: 'Kecenderungan Lapar', pct: 85, badge: 'Sangat Sering', badgeClass: 'badge-tinggi', labels: ['Jarang', 'Normal', 'Sering'], desc: 'Lapar emosional karena stres.' },
        { name: 'Respon Olahraga', pct: 40, badge: 'Lambat', badgeClass: 'badge-perlu', labels: ['Lambat', 'Sedang', 'Responsif'], desc: 'Stres mengurangi efektivitas olahraga.' },
        { name: 'Retensi Air', pct: 60, badge: 'Sedang', badgeClass: 'badge-optimal', labels: ['Rendah', 'Sedang', 'Tinggi'], desc: 'Cenderung retensi air saat stres.' }
    ]
};

// ========== DATA OLAHRAGA DENGAN MANFAAT ==========
var targetOlahragaData = {
    standar: [
        { hari: 'Senin', aktivitas: 'Jalan cepat 30 menit', manfaat: 'Meningkatkan sirkulasi, membakar ~150 kkal, baik untuk jantung.' },
        { hari: 'Selasa', aktivitas: 'Lymphatic Drainage 15 menit + Jumping Jack 2 set', manfaat: 'Mengurangi kembung, melancarkan aliran getah bening, membakar ~50 kkal.' },
        { hari: 'Rabu', aktivitas: 'Istirahat / recovery', manfaat: 'Pemulihan otot, kurangi stres, cukup lakukan peregangan ringan.' },
        { hari: 'Kamis', aktivitas: 'Full Body Stretch 20 menit', manfaat: 'Meningkatkan fleksibilitas, relaksasi, mengurangi nyeri otot.' },
        { hari: 'Jumat', aktivitas: 'Cardio ringan 20 menit (lari di tempat, skipping)', manfaat: 'Membakar kalori, meningkatkan daya tahan kardio.' },
        { hari: 'Sabtu', aktivitas: 'Yoga 30 menit', manfaat: 'Menguatkan otot, menenangkan pikiran, membakar ~100 kkal.' },
        { hari: 'Minggu', aktivitas: 'Jalan santai 30 menit', manfaat: 'Aktivitas ringan, tetap bergerak, baik untuk recovery.' }
    ],
    agresif: [
        { hari: 'Senin', aktivitas: 'HIIT 20 menit + lari 15 menit', manfaat: 'Pembakaran lemak maksimal, afterburn effect.' },
        { hari: 'Selasa', aktivitas: 'Angkat beban 30 menit', manfaat: 'Membangun otot, meningkatkan metabolisme basal.' },
        { hari: 'Rabu', aktivitas: 'Lymphatic Drainage + Yoga 20 menit', manfaat: 'Pemulihan aktif, melancarkan sirkulasi.' },
        { hari: 'Kamis', aktivitas: 'Cardio 30 menit (lari, bersepeda)', manfaat: 'Membakar kalori, meningkatkan stamina.' },
        { hari: 'Jumat', aktivitas: 'Full Body Strength 30 menit', manfaat: 'Menguatkan otot, membentuk tubuh.' },
        { hari: 'Sabtu', aktivitas: 'HIIT 20 menit + core workout', manfaat: 'Membakar lemak, menguatkan perut.' },
        { hari: 'Minggu', aktivitas: 'Istirahat aktif (jalan kaki)', manfaat: 'Pemulihan, tetap bergerak.' }
    ],
    ringan: [
        { hari: 'Senin', aktivitas: 'Jalan kaki 30 menit', manfaat: 'Aktivitas ringan, baik untuk pemula.' },
        { hari: 'Selasa', aktivitas: 'Lymphatic Drainage 15 menit', manfaat: 'Melancarkan sirkulasi, mengurangi kembung.' },
        { hari: 'Rabu', aktivitas: 'Istirahat', manfaat: 'Pemulihan total.' },
        { hari: 'Kamis', aktivitas: 'Yoga 20 menit', manfaat: 'Relaksasi, meningkatkan fleksibilitas.' },
        { hari: 'Jumat', aktivitas: 'Jalan cepat 20 menit', manfaat: 'Membakar kalori ringan.' },
        { hari: 'Sabtu', aktivitas: 'Peregangan 15 menit', manfaat: 'Melemaskan otot.' },
        { hari: 'Minggu', aktivitas: 'Istirahat', manfaat: 'Recovery.' }
    ],
    if: [
        { hari: 'Senin', aktivitas: 'Jalan cepat saat puasa 30 menit', manfaat: 'Maksimalkan pembakaran lemak (fasted cardio).' },
        { hari: 'Selasa', aktivitas: 'Lymphatic Drainage 15 menit', manfaat: 'Lancarkan sirkulasi, kurangi kembung.' },
        { hari: 'Rabu', aktivitas: 'Istirahat', manfaat: 'Pemulihan, jaga puasa.' },
        { hari: 'Kamis', aktivitas: 'Jumping Jack 3 set + squat', manfaat: 'Tingkatkan metabolisme, bakar kalori.' },
        { hari: 'Jumat', aktivitas: 'Yoga ringan 20 menit', manfaat: 'Relaksasi, jaga keseimbangan.' },
        { hari: 'Sabtu', aktivitas: 'Cardio 20 menit (lari di tempat)', manfaat: 'Bakar lemak, tingkatkan stamina.' },
        { hari: 'Minggu', aktivitas: 'Jalan kaki 30 menit', manfaat: 'Aktivitas ringan, tetap bergerak.' }
    ]
};

// ========== DATA FAQ ==========
var faqData = [
    {
        cat: 'Produk KEMOENIK',
        items: [
            { q: 'Apa itu KEMOENIK?', a: 'KEMOENIK adalah suplemen herbal berbahan alami (teh hijau, jati belanda, kemuning, temulawak, tempuyung) yang membantu proses diet dengan cara membakar lemak, mengontrol nafsu makan, dan melancarkan metabolisme.' },
            { q: 'Bagaimana cara minum KEMOENIK?', a: 'Minum 3 kapsul pada pagi hari setelah sarapan, dan 3 kapsul pada sore/malam setelah makan. Gunakan air hangat untuk hasil optimal.' },
            { q: 'Apakah ada efek samping?', a: 'KEMOENIK terbuat dari bahan alami dan umumnya aman dikonsumsi. Namun, bagi yang memiliki kondisi medis tertentu, disarankan konsultasi dengan dokter terlebih dahulu.' },
            { q: 'Berapa lama 1 box habis?', a: '1 box berisi 60 kapsul, cukup untuk 10 hari (6 kapsul per hari).' }
        ]
    },
    {
        cat: 'Program Diet',
        items: [
            { q: 'Apakah saya harus olahraga?', a: 'Olahraga akan mempercepat hasil, tetapi tidak wajib. Yang terpenting adalah konsistensi minum KEMOENIK dan menjaga defisit kalori.' },
            { q: 'Bolehkah saya tetap makan nasi?', a: 'Boleh, tetapi pilih nasi merah atau batasi porsinya. Kunci diet adalah defisit kalori, bukan menghilangkan karbohidrat sepenuhnya.' },
            { q: 'Bagaimana jika saya lupa minum?', a: 'Jika lupa, segera minum begitu ingat. Jangan menggandakan dosis di waktu berikutnya.' },
            { q: 'Kapan hasil mulai terlihat?', a: 'Biasanya dalam 1-2 minggu pertama, Anda akan merasakan perubahan seperti badan lebih ringan, BAB lancar, dan nafsu makan terkontrol. Penurunan berat bervariasi tergantung konsistensi.' }
        ]
    },
    {
        cat: 'Teknis Aplikasi',
        items: [
            { q: 'Bagaimana cara mengisi kalkulator?', a: 'Masuk ke menu Program, lalu klik "Kalkulasi Kalori Personal". Isi data diri dan target, lalu klik Generate. Simpan untuk mengaktifkan program.' },
            { q: 'Apa itu skor akurasi?', a: 'Skor akurasi adalah persentase kecocokan metode diet yang direkomendasikan dengan profil metabolisme Anda, berdasarkan hasil kuis.' },
            { q: 'Bagaimana cara mereset program?', a: 'Di halaman Program, klik tombol "Mulai Ulang" atau "Berhenti" untuk mereset timeline. Untuk mereset kalkulator, buka panel kalkulator dan klik tombol Reset.' }
        ]
    }
];

// ========== DATA MENU HARIAN ==========
var menuHarianData = [
    { time: '07.00', icon: '🍳', label: 'Sarapan', menu: '2 telur rebus + 1 pisang + segelas air putih', cal: 350 },
    { time: '10.00', icon: '🍎', label: 'Snack Pagi', menu: 'Apel + 10 butir almond', cal: 150 },
    { time: '12.30', icon: '🍚', label: 'Makan Siang', menu: 'Nasi merah 100g + dada ayam 100g + sayur bayam', cal: 500 },
    { time: '16.00', icon: '🥗', label: 'Snack Sore', menu: 'Yogurt plain + granola', cal: 200 },
    { time: '19.00', icon: '🥘', label: 'Makan Malam', menu: 'Ikan bakar 100g + tumis brokoli + kentang rebus 1', cal: 400 }
];

// ========== DATABASE CUSTOM MENU ==========
var cmFoodDatabase = [
    { id: 1, name: 'Telur Rebus', category: 'protein-hewani', baseCal: 70, baseAmount: 1, unit: 'butir' },
    { id: 2, name: 'Dada Ayam Fillet', category: 'protein-hewani', baseCal: 165, baseAmount: 100, unit: 'g' },
    { id: 3, name: 'Ikan Kembung', category: 'protein-hewani', baseCal: 120, baseAmount: 100, unit: 'g' },
    { id: 4, name: 'Tahu Putih', category: 'protein-nabati', baseCal: 80, baseAmount: 100, unit: 'g' },
    { id: 5, name: 'Tempe', category: 'protein-nabati', baseCal: 150, baseAmount: 100, unit: 'g' },
    { id: 6, name: 'Nasi Putih', category: 'karbohidrat', baseCal: 175, baseAmount: 100, unit: 'g' },
    { id: 7, name: 'Nasi Merah', category: 'karbohidrat', baseCal: 165, baseAmount: 100, unit: 'g' },
    { id: 8, name: 'Kentang Rebus', category: 'karbohidrat', baseCal: 87, baseAmount: 100, unit: 'g' },
    { id: 9, name: 'Ubi Rebus', category: 'karbohidrat', baseCal: 100, baseAmount: 100, unit: 'g' },
    { id: 10, name: 'Brokoli', category: 'sayuran', baseCal: 34, baseAmount: 100, unit: 'g' },
    { id: 11, name: 'Bayam', category: 'sayuran', baseCal: 23, baseAmount: 100, unit: 'g' },
    { id: 12, name: 'Wortel', category: 'sayuran', baseCal: 41, baseAmount: 100, unit: 'g' },
    { id: 13, name: 'Pisang', category: 'buah', baseCal: 105, baseAmount: 1, unit: 'buah' },
    { id: 14, name: 'Apel', category: 'buah', baseCal: 95, baseAmount: 1, unit: 'buah' },
    { id: 15, name: 'Alpukat', category: 'buah', baseCal: 160, baseAmount: 0.5, unit: 'buah' },
    { id: 16, name: 'Minyak Zaitun', category: 'lemak', baseCal: 120, baseAmount: 1, unit: 'sdm' },
    { id: 17, name: 'Kacang Almond', category: 'lemak', baseCal: 160, baseAmount: 10, unit: 'butir' }
];

// ========== DATA TIPS KONTEN ==========
var tipsKontenData = [
    {
        id: 'defisit',
        judul: 'Defisit Kalori',
        konten: [
            'Defisit kalori adalah kunci utama menurunkan berat badan. Artinya, kalori yang masuk lebih sedikit daripada yang dibakar.',
            'Hitung kebutuhan kalori harianmu (BMR x aktivitas), lalu kurangi 300-500 kkal untuk defisit yang aman.',
            'Jangan defisit terlalu ekstrim (<1200 kkal untuk wanita, <1500 untuk pria) karena bisa memperlambat metabolisme.',
            'Gunakan kalkulator KEMOENIK untuk menentukan target defisit yang tepat.'
        ],
        warna: '#DC2626',
        bgWarna: '#FEE2E2',
        icon: '🔥'
    },
    {
        id: 'pola-makan',
        judul: 'Panduan Kurangi Gula',
        konten: [
            'Gula tambahan adalah musuh utama diet. Batasi konsumsi gula maksimal 4 sendok teh per hari.',
            'Hindari minuman manis kemasan, sirup, dan kopi kekinian.',
            'Ganti gula dengan pemanis alami seperti stevia atau konsumsi buah untuk rasa manis.',
            'Baca label nutrisi: hindari produk dengan kadar gula >10g per 100g.'
        ],
        warna: '#C07E10',
        bgWarna: '#FEF3C7',
        icon: '🍬'
    },
    {
        id: 'olahraga-tips',
        judul: 'Panduan Olahraga',
        konten: [
            'Kombinasi cardio dan strength training paling efektif untuk bakar lemak.',
            'Lakukan cardio 3-4x seminggu (jalan cepat, lari, bersepeda) masing-masing 30 menit.',
            'Strength training 2x seminggu untuk membangun otot (otak-otak, squat, push-up).',
            'Jangan lupa pemanasan dan pendinginan untuk cegah cedera.'
        ],
        warna: '#1D4ED8',
        bgWarna: '#DBEAFE',
        icon: '🏋️'
    },
    {
        id: 'air-putih',
        judul: 'Cara Minum KEMOENIK',
        konten: [
            'Minum 3 kapsul pagi setelah sarapan dengan air hangat.',
            'Minum 3 kapsul sore/malam setelah makan malam.',
            'Pastikan minum air putih minimal 2 liter sehari untuk membantu kinerja herbal.',
            'Jangan lupa minum air putih sebelum makan untuk mengurangi porsi.'
        ],
        warna: '#2E8B35',
        bgWarna: '#DCFCE7',
        icon: '💧'
    },
    {
        id: 'if-puasa',
        judul: 'Opsi: Intermittent Fasting',
        konten: [
            'IF 16:8 artinya puasa 16 jam, makan dalam jendela 8 jam (misal 10.00-18.00).',
            'Metode ini membantu mengurangi asupan kalori dan meningkatkan sensitivitas insulin.',
            'Saat puasa, hanya boleh minum air putih, teh/kopi tanpa gula.',
            'Kombinasikan dengan KEMOENIK untuk hasil maksimal: minum saat buka puasa dan sebelum puasa.'
        ],
        warna: '#7C3AED',
        bgWarna: '#EDE9FE',
        icon: '⏰'
    },
    {
        id: 'waktu-makan',
        judul: 'Waktu Makan Ideal',
        konten: [
            'Sarapan: 07.00-08.00, kaya protein dan serat.',
            'Makan siang: 12.00-13.00, porsi sedang dengan sayur dan lauk.',
            'Makan malam: sebelum 19.00, ringan dan hindari karbohidrat berlebih.',
            'Camilan: pilih buah atau kacang, batasi setelah jam 18.00.'
        ],
        warna: '#D97706',
        bgWarna: '#FEF3C7',
        icon: '🕒'
    },
    {
        id: 'lymphatic',
        judul: 'Lymphatic Drainage',
        konten: [
            'Lymphatic drainage adalah pijatan ringan untuk melancarkan aliran getah bening.',
            'Bisa dilakukan sendiri dengan gerakan memutar di area leher, ketiak, dan pangkal paha.',
            'Lakukan 10-15 menit setiap hari, terutama saat hari istirahat olahraga.',
            'Manfaat: mengurangi kembung, meningkatkan imun, dan membantu detoks.'
        ],
        warna: '#2563EB',
        bgWarna: '#EFF6FF',
        icon: '💆'
    },
    {
        id: 'tidur',
        judul: 'Pentingnya Tidur',
        konten: [
            'Tidur cukup 7-8 jam per malam membantu mengatur hormon lapar (ghrelin dan leptin).',
            'Kurang tidur dapat meningkatkan keinginan makan makanan manis dan berlemak.',
            'Tidur juga membantu pemulihan otot setelah olahraga.',
            'Ciptakan rutinitas tidur yang teratur: hindari HP 1 jam sebelum tidur.'
        ],
        warna: '#6B21A5',
        bgWarna: '#F3E8FF',
        icon: '😴'
    }
];

// ========== DATA SOAL QUIZ ==========
var quizQuestions = [
    {
        text: 'Seberapa sering Anda merasa lapar?',
        options: [
            { emoji: '🍔', text: 'Sering sekali, bahkan setelah makan', scores: [3, 1, 2, 4, 2, 3, 4] },
            { emoji: '🍎', text: 'Kadang-kadang, normal', scores: [2, 2, 3, 2, 3, 2, 2] },
            { emoji: '🥗', text: 'Jarang, mudah kenyang', scores: [1, 3, 2, 1, 2, 1, 1] }
        ]
    },
    {
        text: 'Bagaimana respons tubuh Anda terhadap makanan manis?',
        options: [
            { emoji: '🍰', text: 'Cepat lapar lagi setelah makan manis', scores: [3, 2, 2, 4, 3, 2, 3] },
            { emoji: '🍬', text: 'Biasa saja, tidak terlalu pengaruh', scores: [2, 3, 3, 2, 2, 3, 2] },
            { emoji: '🍵', text: 'Hindari manis, cepat gemuk', scores: [1, 4, 2, 3, 2, 1, 2] }
        ]
    },
    {
        text: 'Seberapa sering Anda mengonsumsi karbohidrat (nasi, roti, mie)?',
        options: [
            { emoji: '🍚', text: 'Setiap kali makan, porsi besar', scores: [4, 3, 3, 4, 2, 4, 3] },
            { emoji: '🍝', text: '1-2 kali sehari, porsi sedang', scores: [2, 2, 3, 2, 3, 2, 2] },
            { emoji: '🥦', text: 'Jarang, lebih banyak protein & sayur', scores: [1, 1, 2, 1, 3, 1, 2] }
        ]
    },
    {
        text: 'Bagaimana tingkat energi Anda sepanjang hari?',
        options: [
            { emoji: '⚡', text: 'Energi naik turun, mudah lelah', scores: [2, 3, 2, 3, 4, 3, 4] },
            { emoji: '😊', text: 'Stabil, cukup berenergi', scores: [3, 2, 3, 2, 2, 3, 2] },
            { emoji: '😴', text: 'Sering lemas, kurang bertenaga', scores: [1, 4, 2, 3, 3, 2, 3] }
        ]
    },
    {
        text: 'Apakah Anda mudah stres atau cemas?',
        options: [
            { emoji: '😰', text: 'Sangat mudah, sering makan saat stres', scores: [2, 3, 2, 3, 4, 3, 5] },
            { emoji: '😌', text: 'Kadang, biasa saja', scores: [3, 2, 3, 2, 2, 3, 2] },
            { emoji: '😎', text: 'Jarang stres, santai', scores: [2, 1, 2, 1, 1, 2, 1] }
        ]
    },
    {
        text: 'Bagaimana kualitas tidur Anda?',
        options: [
            { emoji: '😴', text: 'Tidur nyenyak 7-8 jam', scores: [3, 2, 3, 2, 2, 3, 1] },
            { emoji: '😐', text: 'Cukup, sering terbangun', scores: [2, 3, 2, 3, 3, 2, 3] },
            { emoji: '😫', text: 'Sulit tidur, kurang dari 6 jam', scores: [1, 4, 2, 3, 4, 2, 4] }
        ]
    },
    {
        text: 'Apakah Anda mengalami retensi air (mudah bengkak, berat badan naik turun)?',
        options: [
            { emoji: '💧', text: 'Sering, terutama saat PMS', scores: [2, 2, 2, 2, 4, 2, 3] },
            { emoji: '💪', text: 'Jarang, badan cenderung stabil', scores: [3, 3, 3, 3, 1, 3, 2] },
            { emoji: '🤷', text: 'Tidak tahu / kadang', scores: [2, 2, 2, 2, 2, 2, 2] }
        ]
    },
    {
        text: 'Seberapa sering Anda berolahraga?',
        options: [
            { emoji: '🏃', text: 'Rutin 3-5x seminggu', scores: [4, 3, 4, 3, 3, 5, 2] },
            { emoji: '🚶', text: '1-2x seminggu', scores: [2, 2, 2, 2, 2, 2, 2] },
            { emoji: '🛋️', text: 'Jarang / tidak pernah', scores: [1, 3, 1, 2, 3, 1, 3] }
        ]
    },
    {
        text: 'Bagaimana metabolisme keluarga Anda?',
        options: [
            { emoji: '👨‍👩‍👧', text: 'Kebanyakan gemuk / mudah gemuk', scores: [1, 4, 2, 3, 3, 2, 3] },
            { emoji: '👪', text: 'Rata-rata normal', scores: [3, 2, 3, 2, 2, 3, 2] },
            { emoji: '🏃', text: 'Kebanyakan kurus / susah gemuk', scores: [4, 1, 3, 2, 1, 4, 1] }
        ]
    },
    {
        text: 'Apakah Anda sering ngemil di malam hari?',
        options: [
            { emoji: '🍪', text: 'Sering, susah menahan lapar', scores: [3, 2, 2, 4, 3, 3, 4] },
            { emoji: '🍎', text: 'Kadang, bisa dikontrol', scores: [2, 2, 3, 2, 2, 2, 2] },
            { emoji: '🚫', text: 'Tidak pernah, sudah terbiasa', scores: [1, 2, 2, 1, 2, 1, 1] }
        ]
    },
    {
        text: 'Bagaimana respons tubuh terhadap makanan berlemak?',
        options: [
            { emoji: '🍟', text: 'Langsung terasa berat, kembung', scores: [2, 3, 2, 3, 3, 2, 3] },
            { emoji: '🍗', text: 'Biasa saja, tidak masalah', scores: [3, 2, 3, 2, 2, 3, 2] },
            { emoji: '🤢', text: 'Mual / tidak tahan', scores: [1, 1, 1, 1, 2, 1, 2] }
        ]
    },
    {
        text: 'Apakah Anda memiliki riwayat diabetes dalam keluarga?',
        options: [
            { emoji: '🩺', text: 'Ya, orang tua / saudara kandung', scores: [2, 3, 2, 4, 2, 2, 3] },
            { emoji: '👨‍👩‍👧', text: 'Ada, tetapi jauh (kakek, bibi)', scores: [2, 2, 2, 3, 2, 2, 2] },
            { emoji: '✅', text: 'Tidak ada riwayat', scores: [3, 2, 3, 2, 3, 3, 2] }
        ]
    },
    {
        text: 'Seberapa sering Anda merasa kembung atau begah?',
        options: [
            { emoji: '🎈', text: 'Sering, hampir setiap hari', scores: [2, 3, 2, 2, 4, 2, 3] },
            { emoji: '😐', text: 'Kadang-kadang', scores: [2, 2, 3, 2, 2, 3, 2] },
            { emoji: '✅', text: 'Jarang', scores: [3, 2, 2, 3, 1, 2, 2] }
        ]
    },
    {
        text: 'Apakah Anda mudah merasa kenyang?',
        options: [
            { emoji: '🍽️', text: 'Ya, sedikit makan sudah kenyang', scores: [1, 3, 2, 1, 2, 1, 2] },
            { emoji: '🤔', text: 'Normal, sedang-sedang saja', scores: [2, 2, 3, 2, 2, 3, 2] },
            { emoji: '🍕', text: 'Tidak, bisa makan banyak', scores: [4, 2, 2, 4, 3, 3, 3] }
        ]
    },
    {
        text: 'Bagaimana kondisi pencernaan Anda?',
        options: [
            { emoji: '💩', text: 'Lancar, BAB rutin setiap hari', scores: [3, 2, 3, 2, 2, 3, 2] },
            { emoji: '😣', text: 'Sembelit atau diare bergantian', scores: [2, 3, 2, 3, 4, 2, 3] },
            { emoji: '🤷', text: 'Kadang lancar, kadang susah', scores: [2, 2, 2, 2, 3, 2, 2] }
        ]
    }
];

// ========== DATA SERVICE UNTUK PENYIMPANAN ==========
var DataService = {
    loadUserData: function(wa) {
        var key = 'kemoenik_user_' + wa;
        var data = localStorage.getItem(key);
        return data ? JSON.parse(data) : {};
    },
    saveUserData: function(wa, data) {
        var key = 'kemoenik_user_' + wa;
        localStorage.setItem(key, JSON.stringify(data));
    },
    saveKalkulator: function(wa, data) {
        var userData = this.loadUserData(wa);
        userData.kalkulator = data;
        this.saveUserData(wa, userData);
        return { success: true };
    },
    saveQuiz: function(wa, data) {
        var userData = this.loadUserData(wa);
        userData.quiz = data;
        this.saveUserData(wa, userData);
        return { success: true };
    },
    saveEvaluasi: function(wa, data) {
        var userData = this.loadUserData(wa);
        if (!userData.evaluasi) userData.evaluasi = [];
        // Jika data adalah array (setelah hapus), timpa
        if (Array.isArray(data)) {
            userData.evaluasi = data;
        } else {
            userData.evaluasi.push(data);
        }
        this.saveUserData(wa, userData);
    },
    saveProfile: function(wa, data) {
        var userData = this.loadUserData(wa);
        userData.profile = data;
        this.saveUserData(wa, userData);
    },
    resetProgram: function(wa) {
        var userData = this.loadUserData(wa);
        userData.kalkulator = null;
        userData.evaluasi = [];
        this.saveUserData(wa, userData);
    },
    saveMisiChecked: function(wa, key, val) {
        var userData = this.loadUserData(wa);
        if (!userData.misiChecked) userData.misiChecked = {};
        userData.misiChecked[key] = val;
        this.saveUserData(wa, userData);
    },
    saveProgramPilihan: function(wa, pilihan) {
        var userData = this.loadUserData(wa);
        userData.programPilihan = pilihan;
        this.saveUserData(wa, userData);
    }
};

// ========== FUNGSI CHECK VOUCHER (DUMMY) ==========
async function checkVoucherValid(wa, voucher) {
    // Simulasi pengecekan voucher (selalu valid untuk demo)
    return { valid: true, fallback: false, message: 'Voucher valid' };
}