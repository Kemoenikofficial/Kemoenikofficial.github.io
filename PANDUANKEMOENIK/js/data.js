// ============================================================
// DATA STATIS UNTUK APLIKASI KEMOENIK
// ============================================================

// URL halaman aktivasi (login/verifikasi voucher)
const APP_URL = '/PANDUANKEMOENIK/aktivasi/index.html';

// Data FAQ
const faqData = [
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

// ============================================================
// Data Olahraga — DITAMBAHKAN: Jadwal IF 16:8
// ============================================================
const targetOlahragaData = {
  ringan: [
    { hari: 'Sen', aktivitas: 'Lymphatic Exercise 15-20 menit (Fokus pada gerakan tangan & pernapasan)' },
    { hari: 'Sel', aktivitas: 'Istirahat aktif - Jalan santai (Peregangan/stretching sekitar 10 menit)' },
    { hari: 'Rab', aktivitas: 'Jalan kaki santai minimal 30 - 45 menit' },
    { hari: 'Kam', aktivitas: 'Jumping jack 3 set (Masing-masing 1 menit) + Jalan kaki santai 15 menit' },
    { hari: 'Jum', aktivitas: 'Jalan kaki santai 45 menit (Durasi lebih panjang di akhir pekan)' },
    { hari: 'Sab', aktivitas: 'Istirahat total (Pemulihan otot)' },
    { hari: 'Min', aktivitas: 'Lymphatic Exercise 15 menit sebelum tidur' }
  ],
  standar: [
    { hari: 'Sen', aktivitas: 'Jalan kaki santai 40 - 60 menit + Jumping jack 3 set (Masing-masing 1 menit)' },
    { hari: 'Sel', aktivitas: 'Lompat tali 10 menit + Lymphatic exercise 10 menit (Sebagai pendingin)' },
    { hari: 'Rab', aktivitas: 'Jalan kaki minimal 30 - 45 menit' },
    { hari: 'Kam', aktivitas: 'Jumping jack 4 set (Masing-masing 1 menit) + Lompat tali 10 menit' },
    { hari: 'Jum', aktivitas: 'Jalan kaki 45 menit + Lymphatic 15 menit' },
    { hari: 'Sab', aktivitas: 'Lompat tali 15 menit + Jumping jack 3 set' },
    { hari: 'Min', aktivitas: 'Istirahat + Lymphatic sebelum tidur' }
  ],
  agresif: [
    { hari: 'Sen', aktivitas: 'Lompat tali 15 menit + Jalan kaki 30 menit' },
    { hari: 'Sel', aktivitas: 'Jumping jack 5 set + Lymphatic 15 menit' },
    { hari: 'Rab', aktivitas: 'Jalan kaki 45 menit + Lompat tali 10 menit' },
    { hari: 'Kam', aktivitas: 'Lompat tali 20 menit + Jumping jack 4 set' },
    { hari: 'Jum', aktivitas: 'Jalan kaki 60 menit' },
    { hari: 'Sab', aktivitas: 'Lompat tali 15 menit + Jumping jack 5 set + Lymphatic' },
    { hari: 'Min', aktivitas: 'Jalan kaki santai 30 menit (Active Recovery)' }
  ],
  programIF: [ // Menggunakan 'programIF' agar tidak konflik dengan keyword 'if' di JS
    { hari: 'Sen', aktivitas: 'Jalan kaki minimal 30 menit (Dilakukan dalam jendela makan)' },
    { hari: 'Sel', aktivitas: 'Lymphatic Drainage 15 menit + Jumping Jack 3 set (1 menit/set, total 3 menit)' },
    { hari: 'Rab', aktivitas: 'Istirahat - Jalan santai 20 menit' },
    { hari: 'Kam', aktivitas: 'Lompat tali 15 menit + Jalan kaki 20 menit' },
    { hari: 'Jum', aktivitas: 'Jumping jack 4 set (1 menit/set) + Lymphatic 15 menit' },
    { hari: 'Sab', aktivitas: 'Jalan kaki 45 menit' },
    { hari: 'Min', aktivitas: 'Istirahat + Lymphatic sebelum tidur' }
  ]
};
// ============================================================
// Data Menu Harian — DIPERBAIKI: Kalori akurat + jadwal KEMOENIK
// ============================================================
const menuHarianData = [
  {
    time: '07:00',
    label: 'Sarapan',
    menu: '2 Telur Rebus + 1 potong Ubi Jalar Rebus (150g) + 1 gelas air putih',
    cal: 280,
    icon: '🍳',
    note: 'Protein + karbohidrat kompleks untuk energi pagi'
  },
  {
    time: '07:30', // 30 menit setelah sarapan
    label: 'Konsumsi Kemoenik',
    menu: 'Minum KEMOENIK 3 kapsul + 1 gelas air putih hangat',
    cal: 0,
    icon: '💊',
    note: 'Minum kapsul 30 menit sesudah makan pagi'
  },
  {
    time: '10:00',
    label: 'Snack Pagi',
    menu: '1 buah Pisang sedang ATAU 1 buah Jeruk + 10 butir Almond',
    cal: 160,
    icon: '🍌',
    note: 'Camilan sehat untuk jaga energi'
  },
  {
    time: '12:00',
    label: 'Makan Siang',
    menu: 'Nasi Merah ½ porsi (100g) + Dada Ayam Rebus (100g) + Tumis Sayuran + Tempe Rebus 1 potong',
    cal: 450,
    icon: '🍱',
    note: 'Porsi seimbang — karbohidrat + protein + serat'
  },
  {
    time: '15:00',
    label: 'Snack Sore',
    menu: 'Yogurt Plain 150g ATAU Singkong Rebus 150g',
    cal: 130,
    icon: '🥛',
    note: 'Pilih salah satu sesuai selera'
  },
  {
    time: '18:00',
    label: 'Makan Malam',
    menu: 'Ikan Kembung/Ayam Bakar + Tumis Bayam/Kangkung + Sedikit Nasi Merah (50g) atau tanpa nasi',
    cal: 380,
    icon: '🍽️',
    note: 'Hindari karbohidrat berlebih di malam hari, Jangan makan berat setelah jam 7 malam'
  },
  {
    time: '18:30',
    label: 'Konsumsi Kemoenik',
    menu: 'Minum KEMOENIK 3 kapsul + 2 gelas air putih',
    cal: 0,
    icon: '💊',
    note: 'Minum kapsul 30 menit sesudah makan malam, Jangan makan berat setelah jam 7 malam'
  }
];
// Total kalori makan: ~1400 kkal/hari (sesuai target diet defisit)
// Kalori ini TETAP (fixed) — tidak berubah meskipun hasil kalkulator user berbeda

// ============================================================
// Menu Harian Per Tipe Metabolisme (Personalisasi)
// id 1=Nasi Warrior, 2=Lemak Fighter, 3=Otot Aktif, 4=Hemat Energi
// id 5=Mood & Lifestyle, 6=Perut Sensitif, 7=Seimbang
// ============================================================
const menuHarianPerTipe = {
  // ── Tipe 1: Nasi Warrior – kurangi karbo, ganti karbohidrat kompleks
  1: [
    { time:'07:00', label:'Sarapan', icon:'🍳', cal:250,
      menu:'2 Telur Rebus + Ubi Jalar Rebus 100g + 1 gelas air putih',
      note:'Karbo kompleks dari ubi, bukan nasi putih' },
    { time:'07:30', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 1 gelas air hangat',
      note:'30 menit sesudah makan pagi' },
    { time:'10:00', label:'Snack Pagi', icon:'🥚', cal:120,
      menu:'2 Putih Telur Rebus + 1 buah Apel',
      note:'Protein tanpa karbo berlebih' },
    { time:'12:00', label:'Makan Siang', icon:'🍱', cal:420,
      menu:'Nasi Merah ½ centong (75g) + Dada Ayam Rebus 120g + Tumis Sayuran + Tahu Rebus 2 ptg',
      note:'Karbo dari nasi merah dibatasi, perbanyak protein & sayur' },
    { time:'15:00', label:'Snack Sore', icon:'🥛', cal:110,
      menu:'Greek Yogurt Plain 150g atau Edamame 1 genggam',
      note:'Protein dan serat, hindari snack tinggi karbo' },
    { time:'18:00', label:'Makan Malam', icon:'🍽️', cal:380,
      menu:'Ikan Kembung/Ayam Bakar + Tumis Bayam + TANPA NASI (ganti dengan Mentimun & Brokoli)',
      note:'Tidak ada karbo di malam hari untuk Tipe Nasi Warrior' },
    { time:'18:30', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 2 gelas air putih',
      note:'30 menit sesudah makan malam' }
  ],

  // ── Tipe 2: Lemak Fighter – IF 16:8, rendah lemak jenuh
  2: [
    { time:'10:00', label:'Buka Puasa (Breakfast)', icon:'🌅', cal:300,
      menu:'2 Telur Rebus + Oatmeal 50g + Pisang 1 buah + air putih 2 gelas',
      note:'Jendela makan mulai jam 10:00 — minum KEMOENIK saat ini' },
    { time:'10:15', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 1 gelas air hangat',
      note:'Langsung setelah makan pertama untuk efek maksimal IF' },
    { time:'12:30', label:'Makan Siang', icon:'🍱', cal:450,
      menu:'Nasi Merah ½ porsi (100g) + Ikan Kembung Bakar + Tumis Kangkung + Tempe Rebus',
      note:'Makanan rendah lemak jenuh, fokus protein & serat' },
    { time:'15:00', label:'Snack Sore', icon:'🍇', cal:100,
      menu:'Buah Segar (apel/pear/jeruk) + 10 butir Almond',
      note:'Camilan ringan sebelum jendela makan tutup' },
    { time:'17:30', label:'Makan Malam (Terakhir)', icon:'🍽️', cal:420,
      menu:'Dada Ayam Bakar 150g + Tumis Brokoli + Sup Sayur Bening',
      note:'Makan terakhir jam 18:00 — setelah ini puasa hingga jam 10:00 besok' },
    { time:'17:45', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 2 gelas air putih',
      note:'Sesudah makan malam, sebelum jendela makan tutup' }
  ],

  // ── Tipe 3: Otot Aktif – tinggi protein, post-workout nutrition
  3: [
    { time:'06:30', label:'Pre-Workout Ringan', icon:'⚡', cal:150,
      menu:'1 Pisang + 1 gelas air putih',
      note:'Energi cepat sebelum olahraga pagi' },
    { time:'07:30', label:'Sarapan Tinggi Protein', icon:'🍳', cal:380,
      menu:'3 Telur Rebus + Oatmeal 60g + Susu Rendah Lemak 200ml',
      note:'Protein tinggi untuk bangun & jaga massa otot' },
    { time:'08:00', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 1 gelas air hangat',
      note:'30 menit sesudah sarapan' },
    { time:'10:30', label:'Snack Protein', icon:'🥚', cal:160,
      menu:'Greek Yogurt 200g + 10 butir Almond',
      note:'Protein untuk pemulihan otot' },
    { time:'12:00', label:'Makan Siang', icon:'🍱', cal:500,
      menu:'Nasi Merah 1 porsi (150g) + Dada Ayam Rebus 150g + Telur Rebus 1 + Tumis Sayuran',
      note:'Tipe Otot Aktif butuh kalori & protein lebih banyak' },
    { time:'15:30', label:'Post-Workout Snack', icon:'💪', cal:200,
      menu:'Dada Ayam Rebus 100g atau 3 Putih Telur + 1 pisang',
      note:'Protein dalam 30 menit setelah latihan untuk recovery' },
    { time:'19:00', label:'Makan Malam', icon:'🍽️', cal:420,
      menu:'Ikan Salmon/Tuna + Tempe Rebus 2 ptg + Sayuran + Nasi Merah ½ porsi',
      note:'Protein untuk sintesis otot saat tidur' },
    { time:'19:30', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 2 gelas air putih',
      note:'30 menit sesudah makan malam' }
  ],

  // ── Tipe 4: Hemat Energi – porsi kecil sering, defisit kecil
  4: [
    { time:'07:00', label:'Sarapan', icon:'🍳', cal:220,
      menu:'1 Telur Rebus + 1 potong Ubi Rebus 100g + Teh Hijau tanpa gula',
      note:'Porsi kecil — metabolisme lambat, jangan skip sarapan' },
    { time:'07:30', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 1 gelas air hangat',
      note:'Bantu tingkatkan metabolisme secara alami' },
    { time:'09:30', label:'Snack Pagi', icon:'🍎', cal:90,
      menu:'1 buah Apel atau Pear',
      note:'Makan tiap 2-3 jam untuk jaga metabolisme tetap aktif' },
    { time:'12:00', label:'Makan Siang', icon:'🍱', cal:380,
      menu:'Nasi Merah ½ porsi (100g) + Tempe/Tahu Rebus + Tumis Sayuran + Sup Sayur',
      note:'Perbanyak serat dan air dalam makanan' },
    { time:'14:30', label:'Snack Siang', icon:'🥛', cal:100,
      menu:'Yogurt Plain 100g atau 1 genggam Kacang Edamame',
      note:'Jangan biarkan perut terlalu lapar — tipe ini butuh makan lebih sering' },
    { time:'17:00', label:'Snack Sore', icon:'🫐', cal:80,
      menu:'Buah Segar 1 porsi kecil (anggur/stroberi/jeruk)',
      note:'Camilan terakhir sebelum makan malam' },
    { time:'18:30', label:'Makan Malam', icon:'🍽️', cal:300,
      menu:'Ikan Rebus/Kukus + Sayuran Rebus + Tanpa Nasi atau Nasi Merah 50g',
      note:'Porsi malam paling kecil, hindari karbo berat' },
    { time:'19:00', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 2 gelas air putih',
      note:'30 menit sesudah makan malam' }
  ],

  // ── Tipe 5: Mood & Lifestyle – kelola stres & tidur, hindari emosional eating
  5: [
    { time:'07:00', label:'Sarapan Mood Booster', icon:'🌅', cal:280,
      menu:'Oatmeal + Pisang + Madu 1 sdt + Teh Chamomile',
      note:'Pisang & oatmeal bantu produksi serotonin untuk mood baik' },
    { time:'07:30', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 1 gelas air hangat',
      note:'Bantu keseimbangan hormonal secara alami' },
    { time:'10:00', label:'Snack Pagi', icon:'🍫', cal:120,
      menu:'Dark Chocolate 20g (min 70%) + 1 buah Jeruk',
      note:'Dark chocolate bantu kurangi kortisol (hormon stres)' },
    { time:'12:00', label:'Makan Siang', icon:'🍱', cal:420,
      menu:'Nasi Merah ½ porsi + Ayam Rebus + Bayam Rebus + Tahu Kukus',
      note:'Makan siang teratur — jangan skip meski sibuk atau stres' },
    { time:'15:00', label:'Snack Sore', icon:'🧘', cal:100,
      menu:'Pisang 1 buah atau Segelas Susu Rendah Lemak',
      note:'Jangan makan emosional — pause dulu, minum air sebelum ngemil' },
    { time:'18:00', label:'Makan Malam (Sebelum 19:00)', icon:'🍽️', cal:350,
      menu:'Ikan Kukus/Rebus + Sayuran Bervariasi + Sedikit Nasi Merah atau Ubi',
      note:'Wajib selesai makan sebelum jam 19:00 — tidur lebih awal lebih baik' },
    { time:'18:30', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 2 gelas air putih + Teh Herbal Hangat',
      note:'Teh herbal hangat di malam hari bantu kualitas tidur' }
  ],

  // ── Tipe 6: Perut Sensitif – anti-inflamasi, probiotik, kunyah perlahan
  6: [
    { time:'07:00', label:'Sarapan Ramah Lambung', icon:'🌿', cal:230,
      menu:'Bubur Oatmeal + 1 Telur Rebus + Pisang 1 buah (hindari jeruk pagi hari)',
      note:'Oatmeal lembut untuk lambung — hindari makanan asam di pagi hari' },
    { time:'07:30', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 1 gelas air hangat (bukan air dingin)',
      note:'Air hangat lebih ramah untuk pencernaan sensitif' },
    { time:'10:00', label:'Snack Probiotik', icon:'🥛', cal:100,
      menu:'Yogurt Plain 150g (tanpa perisa buatan)',
      note:'Probiotik setiap hari untuk flora usus yang sehat' },
    { time:'12:00', label:'Makan Siang', icon:'🍱', cal:400,
      menu:'Nasi Putih ½ porsi (bukan nasi merah jika lambung sensitif) + Ayam Kukus + Tempe Goreng Sedikit Minyak + Sayur Rebus',
      note:'Kunyah perlahan 20-30x per suapan — jangan makan terburu-buru' },
    { time:'15:00', label:'Snack Sore', icon:'🍌', cal:90,
      menu:'Pisang 1 buah atau Pepaya 150g',
      note:'Buah non-asam untuk bantu pencernaan' },
    { time:'18:00', label:'Makan Malam', icon:'🍽️', cal:350,
      menu:'Ikan Kukus + Sayuran Rebus (Labu/Wortel/Brokoli) + Sup Bening',
      note:'Hindari pedas & gorengan — masak dengan cara rebus atau kukus' },
    { time:'18:30', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 2 gelas air putih hangat',
      note:'Herbal KEMOENIK bantu perbaiki pencernaan secara alami' }
  ],

  // ── Tipe 7: Seimbang – variasi menu, konsistensi
  7: [
    { time:'07:00', label:'Sarapan', icon:'🍳', cal:280,
      menu:'2 Telur Rebus + 1 potong Ubi Jalar Rebus 150g + 1 gelas air putih',
      note:'Protein + karbohidrat kompleks untuk energi pagi' },
    { time:'07:30', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 1 gelas air putih hangat',
      note:'30 menit sesudah makan pagi' },
    { time:'10:00', label:'Snack Pagi', icon:'🍌', cal:150,
      menu:'1 buah Pisang + 10 butir Almond atau 1 buah Jeruk + Yogurt 100g',
      note:'Variasikan snack tiap hari agar tidak bosan' },
    { time:'12:00', label:'Makan Siang', icon:'🍱', cal:450,
      menu:'Nasi Merah ½ porsi (100g) + Dada Ayam/Ikan Rebus + Tumis Sayuran + Tempe/Tahu',
      note:'Porsi seimbang — karbohidrat + protein + serat + lemak sehat' },
    { time:'15:00', label:'Snack Sore', icon:'🥛', cal:130,
      menu:'Yogurt Plain 150g atau Singkong Rebus 150g',
      note:'Pilih sesuai selera hari ini' },
    { time:'18:00', label:'Makan Malam', icon:'🍽️', cal:380,
      menu:'Ikan/Ayam Bakar + Tumis Bayam/Kangkung + Nasi Merah 50g atau tanpa nasi',
      note:'Variasikan lauk setiap hari untuk nutrisi lengkap' },
    { time:'18:30', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 2 gelas air putih',
      note:'30 menit sesudah makan malam' }
  ]
};

// ============================================================
// Menu Harian IF 16:8 Per Tipe (Jendela Makan 10:00–18:00)
// Berdasarkan penelitian: Lowe et al. (2020) JAMA Internal Medicine
// IF 16:8 efektif turunkan kalori 20–30% secara alami tanpa hitung ketat
// ============================================================
const menuHarianIFPerTipe = {
  // Tipe 1: Nasi Warrior IF — karbo kompleks hanya di awal jendela
  1: [
    { time:'10:00', label:'Buka Puasa (Makan Pertama)', icon:'🌅', cal:300,
      menu:'2 Telur Rebus + Ubi Jalar Rebus 150g + 1 gelas air putih',
      note:'Mulai dengan protein + karbo kompleks — hindari nasi putih saat buka puasa' },
    { time:'10:15', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 1 gelas air hangat',
      note:'Minum segera setelah makan pertama untuk efek optimal' },
    { time:'12:30', label:'Makan Siang', icon:'🍱', cal:420,
      menu:'Nasi Merah ½ centong (75g) + Dada Ayam Rebus 120g + Tumis Sayuran + Tahu 2 ptg',
      note:'Ini waktu karbo terakhir hari ini — setelah ini tanpa nasi' },
    { time:'15:00', label:'Snack Sore', icon:'🥚', cal:120,
      menu:'2 Telur Rebus + Timun + Tomat Cherry',
      note:'Protein tanpa karbo — jaga gula darah tetap stabil sore hari' },
    { time:'17:30', label:'Makan Malam (Terakhir)', icon:'🍽️', cal:360,
      menu:'Ikan Bakar/Ayam Rebus + Tumis Bayam/Kangkung — TANPA NASI',
      note:'Jendela makan TUTUP jam 18:00 — tidak ada makanan apapun setelahnya' },
    { time:'17:45', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 2 gelas air putih',
      note:'Dosis malam sebelum jendela makan tutup' }
  ],

  // Tipe 2: Lemak Fighter IF — zona bakar lemak optimal
  2: [
    { time:'10:00', label:'Buka Puasa + Kemoenik', icon:'🔥', cal:280,
      menu:'2 Telur Rebus + Pisang 1 buah + 2 gelas air putih',
      note:'Setelah 16 jam puasa tubuh dalam mode fat-burning — pertahankan dengan buka puasa ringan' },
    { time:'10:15', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 1 gelas air hangat',
      note:'KEMOENIK saat buka puasa = efek pembakaran lemak maksimal (synergy IF + herbal)' },
    { time:'12:30', label:'Makan Siang', icon:'🍱', cal:450,
      menu:'Nasi Merah ½ porsi + Ikan Kembung Bakar + Tumis Kangkung + Tempe Rebus',
      note:'Makan lengkap tapi hindari gorengan & santan sepenuhnya' },
    { time:'15:30', label:'Snack Pre-Workout', icon:'⚡', cal:120,
      menu:'Pisang 1 buah atau Apel + 1 sdm Peanut Butter',
      note:'Energi untuk kardio sore hari — kardio 30 menit WAJIB untuk Tipe Lemak Fighter' },
    { time:'17:30', label:'Makan Malam Terakhir', icon:'🍽️', cal:380,
      menu:'Dada Ayam Bakar 150g + Sup Sayur Bening + Edamame 1 genggam — TANPA NASI',
      note:'Jendela TUTUP jam 18:00 — setelahnya hanya air putih & teh herbal tanpa gula' },
    { time:'17:45', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 2 gelas air putih',
      note:'Dosis terakhir sebelum jendela makan tutup' }
  ],

  // Tipe 3: Otot Aktif IF — protein tinggi dalam jendela 8 jam
  // Berdasarkan Moro et al. (2016): IF + resistance training pertahankan massa otot
  3: [
    { time:'10:00', label:'Buka Puasa Protein', icon:'💪', cal:350,
      menu:'3 Telur Rebus + Oatmeal 60g + Susu Rendah Lemak 200ml',
      note:'BV protein telur = 100 (tertinggi) — ideal untuk buka puasa atlet' },
    { time:'10:15', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 1 gelas air hangat',
      note:'Bantu metabolisme & pemulihan otot saat IF' },
    { time:'12:30', label:'Makan Siang Utama', icon:'🍱', cal:520,
      menu:'Nasi Merah 1 porsi (150g) + Dada Ayam 150g + Tempe Rebus + Tumis Sayuran',
      note:'Tipe Otot Aktif butuh kalori lebih — ini makan terbesar hari ini' },
    { time:'15:00', label:'Post-Workout Protein', icon:'🏋️', cal:200,
      menu:'Greek Yogurt 200g + 1 pisang ATAU 3 Putih Telur + buah',
      note:'Protein 30 menit setelah latihan kritis untuk muscle protein synthesis (MPS)' },
    { time:'17:30', label:'Makan Malam Terakhir', icon:'🍽️', cal:400,
      menu:'Ikan Salmon/Tuna Rebus + Tempe Goreng Sedikit + Sayuran + Nasi Merah 50g',
      note:'Protein kasein dari ikan = slow-release, ideal untuk recovery saat tidur' },
    { time:'17:45', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 2 gelas air putih',
      note:'Dosis malam sebelum jendela tutup' }
  ],

  // Tipe 4: Hemat Energi IF — termogenesis & NEAT boost
  // Penelitian: Heilbronn et al. (2005) — IF tingkatkan insulin sensitivity pada metabolisme lambat
  4: [
    { time:'10:00', label:'Buka Puasa Termogenik', icon:'🌡️', cal:250,
      menu:'1 Telur Rebus + Oatmeal + Teh Hijau Tanpa Gula (bukan kopi)',
      note:'Teh hijau mengandung EGCG yang tingkatkan metabolisme 4–5% (Dulloo et al., 1999)' },
    { time:'10:15', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 1 gelas air hangat',
      note:'Herbal KEMOENIK bantu aktifkan thermogenesis alami' },
    { time:'12:30', label:'Makan Siang', icon:'🍱', cal:380,
      menu:'Nasi Merah ½ porsi + Tempe/Tahu + Tumis Sayuran + Sup Bening',
      note:'Perbanyak serat & air dalam makanan untuk rasa kenyang lebih lama' },
    { time:'14:30', label:'Snack Siang', icon:'🫐', cal:100,
      menu:'Buah Segar 1 porsi (apel/pear) — hindari buah manis berlebih',
      note:'Tipe Hemat Energi butuh snack di tengah untuk jaga metabolisme tidak melambat' },
    { time:'17:30', label:'Makan Malam Terakhir', icon:'🍽️', cal:330,
      menu:'Ikan Kukus + Sayuran Rebus Beragam + Sup Jahe — TANPA NASI',
      note:'Jahe meningkatkan thermogenesis dan pencernaan — bagus untuk metabolisme lambat' },
    { time:'17:45', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 2 gelas air putih',
      note:'Terakhir sebelum jendela tutup jam 18:00' }
  ],

  // Tipe 5: Mood & Lifestyle IF — circadian rhythm diet
  // Penelitian: Sutton et al. (2018) — early time-restricted feeding perbaiki metabolisme & mood
  5: [
    { time:'10:00', label:'Buka Puasa Mood Booster', icon:'🌸', cal:280,
      menu:'Oatmeal + Pisang + Walnut 10 butir + Teh Chamomile tanpa gula',
      note:'Walnut mengandung omega-3 ALA & tryptophan untuk produksi serotonin (mood booster)' },
    { time:'10:15', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 1 gelas air hangat',
      note:'Herbal bantu keseimbangan hormonal yang dipengaruhi stres & pola tidur' },
    { time:'12:30', label:'Makan Siang', icon:'🍱', cal:400,
      menu:'Nasi Merah ½ porsi + Ayam Rebus + Bayam + Tahu Kukus',
      note:'Makan siang teratur tanpa terburu-buru — stres saat makan picu kortisol & penumpukan lemak' },
    { time:'15:00', label:'Snack Anti-Stres', icon:'🍫', cal:120,
      menu:'Dark Chocolate 20g (min 70%) + 1 buah Pear atau Apel',
      note:'Dark chocolate turunkan kortisol & tekanan darah (Katz et al., 2011)' },
    { time:'17:30', label:'Makan Malam Terakhir', icon:'🍽️', cal:350,
      menu:'Ikan Kukus + Sayuran Berwarna-warni + Sup Hangat — TANPA NASI',
      note:'Selesai makan jam 18:00 — tidur lebih awal (22:00) untuk optimasi hormon leptin & ghrelin' },
    { time:'17:45', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + Teh Herbal Hangat (chamomile/lavender)',
      note:'Teh herbal malam bantu kualitas tidur — kunci utama Tipe Mood & Lifestyle' }
  ],

  // Tipe 6: Perut Sensitif IF — gut healing protocol
  // Penelitian: Bagherniya et al. (2017) — IF perbaiki gut microbiome diversity
  6: [
    { time:'10:00', label:'Buka Puasa Ramah Usus', icon:'🌿', cal:220,
      menu:'Bubur Oatmeal Lembut + 1 pisang matang + air putih hangat 2 gelas',
      note:'Pisang matang mengandung FOS (prebiotik alami) — makanan baik untuk bakteri usus' },
    { time:'10:15', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 1 gelas air hangat (bukan air dingin)',
      note:'Air hangat lebih ramah untuk usus sensitif — hindari minuman dingin sepanjang hari' },
    { time:'12:00', label:'Probiotik + Makan Siang', icon:'🥛', cal:420,
      menu:'Yogurt Plain 150g DULU, tunggu 15 menit, lalu: Nasi Putih ½ porsi + Ayam Kukus + Sayur Rebus',
      note:'Makan probiotik dulu sebelum makan utama = kolonisasi bakteri baik lebih efektif' },
    { time:'15:00', label:'Snack Ramah Usus', icon:'🍌', cal:100,
      menu:'Pepaya Potong 200g atau Pisang 1 buah',
      note:'Pepaya mengandung enzim papain — bantu pencernaan protein & kurangi bloating' },
    { time:'17:30', label:'Makan Malam Terakhir', icon:'🍽️', cal:350,
      menu:'Ikan Kukus/Rebus + Sayuran Rebus Lunak (wortel, labu, brokoli) + Sup Bening',
      note:'KUNYAH 20-30x per suapan — IF mudahkan usus istirahat penuh 16 jam' },
    { time:'17:45', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 2 gelas air putih hangat',
      note:'Herbal KEMOENIK bantu perbaiki permeabilitas usus selama jendela puasa' }
  ],

  // Tipe 7: Seimbang IF — Mediterranean + IF hybrid
  7: [
    { time:'10:00', label:'Buka Puasa Seimbang', icon:'⚖️', cal:290,
      menu:'2 Telur Rebus + Roti Gandum 1 lembar + Alpukat ½ buah + air putih',
      note:'Lemak sehat dari alpukat memperlambat penyerapan gula darah saat buka puasa' },
    { time:'10:15', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 1 gelas air hangat',
      note:'30 menit setelah makan pertama' },
    { time:'12:30', label:'Makan Siang', icon:'🍱', cal:440,
      menu:'Nasi Merah ½ porsi + Dada Ayam/Ikan Grill + Tumis Sayuran + Tempe/Tahu',
      note:'Variasikan protein setiap hari untuk nutrisi lengkap (seafood, unggas, kacang bergantian)' },
    { time:'15:00', label:'Snack Buah', icon:'🍇', cal:130,
      menu:'Mix Buah Segar (apel + jeruk + anggur) + 10 butir Almond',
      note:'Antioksidan dari buah beragam proteksi sel dari stres oksidatif' },
    { time:'17:30', label:'Makan Malam Terakhir', icon:'🍽️', cal:380,
      menu:'Ikan Bakar (2x/minggu wajib) atau Ayam Bakar + Sayuran Berwarna + Nasi Merah 50g',
      note:'Jendela TUTUP jam 18:00 — ikan 2x seminggu sesuai anjuran Mediterranean Diet' },
    { time:'17:45', label:'Konsumsi Kemoenik', icon:'💊', cal:0,
      menu:'KEMOENIK 3 kapsul + 2 gelas air putih',
      note:'Dosis malam terakhir sebelum jendela makan tutup' }
  ]
};

// ============================================================
// Substitusi Menu Per Tipe Per Tab (Panduan Personalisasi Tab)
// ============================================================
const menuSubstitusiPerTipe = {
  1: { // Nasi Warrior
    nama: 'Nasi Warrior', emoji: '🍚',
    warna: '#E07B39', bg: '#FEF0E6',
    catatan: 'Tubuhmu sensitif terhadap karbohidrat — tukar sumber karbo, bukan hilangkan sepenuhnya.',
    ekonomis: [
      'Ganti nasi putih → Nasi Jagung, Ubi Rebus, atau Singkong (GI lebih rendah)',
      'Tempe & tahu adalah protein murah terbaik untuk tipe ini — makan setiap hari',
      'Sayur Bayam, Kangkung, Kelor = serat tinggi, bantu perlambat penyerapan gula',
      'Pisang BELUM matang (agak hijau) lebih baik dari yang matang — GI lebih rendah'
    ],
    standar: [
      'Nasi Merah atau Nasi Coklat wajib menggantikan nasi putih sepenuhnya',
      'Ganti pasta biasa → Pasta Gandum atau Pasta Kacang Merah (protein lebih tinggi)',
      'Yogurt Plain (bukan yogurt berasa) — konsumsi setelah makan karbo untuk perlambat GI',
      'Pilih buah: Apel, Pear, Beri — bukan mangga atau semangka (GI tinggi)'
    ],
    premium: [
      'Nasi Kembang Kol (Cauliflower Rice) sebagai pengganti nasi — hampir zero karbo',
      'Pasta Shirataki (konjac) untuk pasta rendah kalori & karbo',
      'Quinoa sebagai sumber karbo kompleks + protein lengkap (lebih baik dari nasi merah)',
      'Roti sourdough fermentasi — GI lebih rendah dari roti biasa karena proses fermentasi'
    ]
  },
  2: { // Lemak Fighter
    nama: 'Lemak Fighter', emoji: '🔥',
    warna: '#E53E3E', bg: '#FEF2F2',
    catatan: 'Fokus pada makanan rendah lemak jenuh & tinggi serat larut untuk maksimalkan pembakaran lemak.',
    ekonomis: [
      'Rebus atau kukus semua lauk — hindari gorengan sama sekali untuk tipe ini',
      'Ikan Kembung & Ikan Lele = protein murah, rendah lemak jenuh, tinggi omega-3',
      'Ganti santan → Kaldu bening. Ganti gorengan → bakar/kukus/rebus',
      'Oats murah (Quaker biasa) adalah sarapan terbaik — beta-glucan ikat lemak di usus'
    ],
    standar: [
      'Pilih dada ayam tanpa kulit SELALU — kulit ayam = 44% lemak jenuh',
      'Greek yogurt menggantikan krim/mayo sebagai dressing atau topping',
      'Brokoli, Kembang Kol, Kubis = sayuran DIM (Diindolylmethane) untuk hormonal balance',
      'Selai kacang alami (peanut butter 100%) lebih baik dari selai coklat berlemak'
    ],
    premium: [
      'Salmon, Sarden, Makarel = omega-3 EPA/DHA tinggi — aktifkan gen pembakaran lemak (PPAR-α)',
      'Minyak MCT (Medium Chain Triglycerides) sebagai pengganti minyak biasa',
      'Probiotik dari Kefir membantu bakteri usus mengurai lemak lebih efisien',
      'Alpukat sebagai sumber lemak tak jenuh tunggal — turunkan LDL, naikkan HDL'
    ]
  },
  3: { // Otot Aktif
    nama: 'Otot Aktif', emoji: '💪',
    warna: '#3182CE', bg: '#EBF8FF',
    catatan: 'Target protein 1.8–2.2g/kg berat badan per hari. Distribusi protein merata setiap 3–4 jam.',
    ekonomis: [
      'Telur adalah sumber protein BV tertinggi (100) dengan harga paling terjangkau',
      'Tempe = protein nabati lengkap yang mengandung semua asam amino esensial',
      'Ikan Lele & Ikan Kembung — protein tinggi dengan harga sangat terjangkau',
      'Kacang Hijau + Nasi = protein komplementer (lengkapi asam amino yang kurang)'
    ],
    standar: [
      'Dada ayam 150–200g per porsi makan — ini standar minimum Tipe Otot Aktif',
      'Susu rendah lemak atau susu skim — protein whey alami, bantu recovery otot',
      'Tuna kaleng (dalam air, bukan minyak) = 30g protein per kaleng, praktis & murah',
      'Telur + Nasi Merah setelah workout = kombinasi protein + karbo ideal untuk recovery'
    ],
    premium: [
      'Whey protein isolate (setelah latihan) untuk muscle protein synthesis maksimal',
      'Salmon kaya leucine — asam amino paling kritikal untuk sinyal sintesis otot (mTOR)',
      'Greek yogurt (20g protein/100g) sebagai snack malam untuk overnight recovery',
      'Daging sapi tanpa lemak — creatine alami tinggi yang meningkatkan kekuatan & massa otot'
    ]
  },
  4: { // Hemat Energi
    nama: 'Hemat Energi', emoji: '🐢',
    warna: '#7C3AED', bg: '#F5F3FF',
    catatan: 'Tingkatkan metabolisme secara alami dengan makanan termogenik & makan lebih sering (5–6x/hari).',
    ekonomis: [
      'Cabai rawit: capsaicin tingkatkan metabolisme 4–5% hingga 4 jam setelah makan',
      'Jahe rebus: gingerol aktifkan thermogenesis — minum teh jahe setiap pagi',
      'Tempe fermentasi = probiotik alami + protein yang bantu perbaiki metabolisme usus',
      'Kacang Hijau rebus: serat larut tinggi, indeks glikemik rendah, bikin kenyang lama'
    ],
    standar: [
      'Teh Hijau tanpa gula: EGCG + kafein = 4% peningkatan metabolisme (Dulloo et al.)',
      'Oatmeal + kayu manis: casein lambat + cinnamaldehyde aktifkan reseptor insulin',
      'Telur + Sayuran: choline dalam telur bantu hati mengurai lemak lebih efisien',
      'Makan setiap 3 jam (5–6x kecil) lebih efektif dari 3x besar untuk tipe metabolisme ini'
    ],
    premium: [
      'Kopi hitam tanpa gula: kafein tingkatkan metabolisme 3–11% dan oksidasi lemak 10–29%',
      'Alpukat: lemak tak jenuh tunggal perbaiki sensitivitas insulin yang sering lemah di tipe ini',
      'Ikan berlemak (salmon, sarden): omega-3 aktifkan adiponektin, hormon pembakar lemak',
      'Whey protein meningkatkan TEF (thermic effect of food) lebih tinggi dari karbo/lemak'
    ]
  },
  5: { // Mood & Lifestyle
    nama: 'Mood & Lifestyle', emoji: '🌙',
    warna: '#D97706', bg: '#FFFBEB',
    catatan: 'Makanan memengaruhi neurotransmitter. Pilih makanan yang stabilkan serotonin, dopamin, dan kortisol.',
    ekonomis: [
      'Pisang: tryptophan + vitamin B6 → serotonin. Makan 1 pisang sehari untuk mood stabil',
      'Telur: kolin + tryptophan penting untuk fungsi otak dan regulasi mood',
      'Tempe fermentasi: asam amino tryptophan + GABA alami untuk anti-kecemasan',
      'Ikan kembung/sardine: omega-3 ALA untuk mengurangi gejala depresi dan kecemasan'
    ],
    standar: [
      'Dark Chocolate 70%+: flavonoid turunkan kortisol & naikkan endorfin (Katz et al.)',
      'Walnut: alpha-linolenic acid (ALA) + melatonin alami untuk perbaiki kualitas tidur',
      'Oatmeal: beta-glucan stabilkan gula darah — gula darah stabil = mood stabil sepanjang hari',
      'Teh chamomile/lavender malam hari: apigenin bind ke reseptor GABA → efek rileksasi'
    ],
    premium: [
      'Salmon: EPA/DHA omega-3 terbukti setara antidepresan ringan (Sublette et al., 2011)',
      'Probiotik (yogurt/kefir): gut-brain axis — 95% serotonin diproduksi di usus',
      'Magnesium (dari kacang-kacangan): defisiensi magnesium korelasi kuat dengan kecemasan',
      'Buah kiwi sebelum tidur: studi NZ 2011 — tidur lebih cepat 35%, bangun lebih segar'
    ]
  },
  6: { // Perut Sensitif
    nama: 'Perut Sensitif', emoji: '🌿',
    warna: '#059669', bg: '#ECFDF5',
    catatan: 'Protokol Low-FODMAP + tinggi prebiotik & probiotik. Perkenalkan satu makanan baru per minggu.',
    ekonomis: [
      'HINDARI: bawang merah/putih mentah, susu sapi, kol, buncis (FODMAP tinggi)',
      'AMAN: nasi putih, ubi jalar, pisang matang, ayam kukus, tahu (Low-FODMAP)',
      'Tempe LEBIH BAIK dari tahu bagi usus sensitif — fermentasi urai antinutrien',
      'Masak dengan minyak kemiri bukan minyak kelapa sawit — lebih mudah dicerna'
    ],
    standar: [
      'Yogurt plain: probiotik Lactobacillus & Bifidobacterium untuk flora usus sehat',
      'Beras merah dengan porsi terbatas (½ porsi) — sebagian orang sensitif terhadap kandungan seratnya',
      'Ganti bawang merah/putih → daun bawang (hanya bagian hijau) atau minyak bawang',
      'Memasak sayuran matang-matang lebih aman dari mentah untuk usus sensitif'
    ],
    premium: [
      'Kefir: 30+ strain probiotik, jauh lebih kuat dari yogurt biasa untuk gut healing',
      'Psyllium husk: serat larut prebiotik, bantu regularitas tanpa iritasi usus',
      'Bone broth (kaldu tulang): glutamin & glycine perbaiki tight junction mukosa usus',
      'Enzim digestif (bromelain dari nanas, papain dari pepaya) bantu pecah protein'
    ]
  },
  7: { // Seimbang
    nama: 'Seimbang', emoji: '⚖️',
    warna: '#2D5A3D', bg: '#F0FDF4',
    catatan: 'Keunggulanmu adalah fleksibilitas. Terapkan prinsip Mediterranean Diet untuk kesehatan jangka panjang.',
    ekonomis: [
      'Variasi protein setiap hari: telur (Sen), tempe (Sel), ikan (Rab), ayam (Kam), dsb',
      'Sayuran berwarna-warni: merah (tomat), hijau (bayam), oranye (wortel) = antioksidan lengkap',
      'Buah lokal sesuai musim: lebih segar, lebih murah, antioksidan lebih tinggi',
      'Konsistensi lebih penting dari kesempurnaan — jalan kaki 30 menit/hari lebih efektif dari diet ketat'
    ],
    standar: [
      'Ikan minimal 2x seminggu: omega-3 dan selenium untuk perlindungan kardiovaskular',
      'Nasi Merah 5x seminggu, nasi putih 2x — transisi bertahap, tidak perlu langsung 100%',
      'Olive oil sebagai minyak masak utama — sesuai rekomendasi WHO untuk diet sehat',
      'Kacang-kacangan (almond, walnut) sebagai snack: hentikan lapar, nutrisi padat'
    ],
    premium: [
      'Prinsip Mediterranean: 70% nabati, 20% protein laut, 10% daging merah',
      'Extra virgin olive oil: oleocanthal bersifat anti-inflamasi setara ibuprofen dosis rendah',
      'Aneka ikan laut dalam: salmon, tuna, makarel, sarden — omega-3 EPA/DHA sempurna',
      'Kacang Mediterania: pistachio, walnut, almond — antioksidan + lemak sehat lengkap'
    ]
  }
};

// ============================================================
// Database Custom Menu — TIDAK DIUBAH
// ============================================================
const cmFoodDatabase = [
  {id:1, name:"Telur Ayam", category:"protein-hewani", unit:"butir", baseCal:78, baseAmount:1},
  {id:2, name:"Dada Ayam (Rebus)", category:"protein-hewani", unit:"gram", baseCal:165, baseAmount:100},
  {id:3, name:"Dada Ayam (Goreng)", category:"protein-hewani", unit:"gram", baseCal:220, baseAmount:100},
  {id:4, name:"Ikan Kembung (Rebus)", category:"protein-hewani", unit:"gram", baseCal:167, baseAmount:100},
  {id:5, name:"Ikan Salmon", category:"protein-hewani", unit:"gram", baseCal:208, baseAmount:100},
  {id:6, name:"Ikan Tuna (Kaleng)", category:"protein-hewani", unit:"gram", baseCal:116, baseAmount:100},
  {id:7, name:"Udang (Rebus)", category:"protein-hewani", unit:"gram", baseCal:106, baseAmount:100},
  {id:8, name:"Daging Sapi (Rebus)", category:"protein-hewani", unit:"gram", baseCal:250, baseAmount:100},
  {id:9, name:"Tempe (Rebus)", category:"protein-nabati", unit:"gram", baseCal:192, baseAmount:100},
  {id:10, name:"Tempe (Goreng)", category:"protein-nabati", unit:"gram", baseCal:280, baseAmount:100},
  {id:11, name:"Tahu Putih", category:"protein-nabati", unit:"gram", baseCal:68, baseAmount:100},
  {id:12, name:"Tahu Goreng", category:"protein-nabati", unit:"gram", baseCal:200, baseAmount:100},
  {id:13, name:"Edamame", category:"protein-nabati", unit:"gram", baseCal:121, baseAmount:100},
  {id:14, name:"Kacang Hijau", category:"protein-nabati", unit:"gram", baseCal:105, baseAmount:100},
  {id:15, name:"Nasi Putih", category:"karbohidrat", unit:"gram", baseCal:130, baseAmount:100},
  {id:16, name:"Nasi Merah", category:"karbohidrat", unit:"gram", baseCal:111, baseAmount:100},
  {id:17, name:"Kentang (Rebus)", category:"karbohidrat", unit:"gram", baseCal:87, baseAmount:100},
  {id:18, name:"Ubi Jalar (Rebus)", category:"karbohidrat", unit:"gram", baseCal:90, baseAmount:100},
  {id:19, name:"Oatmeal", category:"karbohidrat", unit:"gram", baseCal:68, baseAmount:100},
  {id:20, name:"Roti Gandum", category:"karbohidrat", unit:"iris", baseCal:74, baseAmount:1},
  {id:21, name:"Alpukat", category:"lemak", unit:"gram", baseCal:160, baseAmount:100},
  {id:22, name:"Minyak Zaitun", category:"lemak", unit:"sdm", baseCal:119, baseAmount:1},
  {id:23, name:"Keju Cheddar", category:"lemak", unit:"gram", baseCal:402, baseAmount:100},
  {id:24, name:"Bayam (Rebus)", category:"sayuran", unit:"gram", baseCal:23, baseAmount:100},
  {id:25, name:"Brokoli (Rebus)", category:"sayuran", unit:"gram", baseCal:35, baseAmount:100},
  {id:26, name:"Wortel (Rebus)", category:"sayuran", unit:"gram", baseCal:35, baseAmount:100},
  {id:27, name:"Kangkung (Tumis)", category:"sayuran", unit:"gram", baseCal:50, baseAmount:100},
  {id:28, name:"Tomat", category:"sayuran", unit:"gram", baseCal:18, baseAmount:100},
  {id:29, name:"Mentimun", category:"sayuran", unit:"gram", baseCal:15, baseAmount:100},
  {id:30, name:"Jamur (Tumis)", category:"sayuran", unit:"gram", baseCal:40, baseAmount:100},
  {id:31, name:"Pisang", category:"buah", unit:"buah", baseCal:105, baseAmount:1},
  {id:32, name:"Apel", category:"buah", unit:"buah", baseCal:95, baseAmount:1},
  {id:33, name:"Jeruk", category:"buah", unit:"buah", baseCal:62, baseAmount:1},
  {id:34, name:"Semangka", category:"buah", unit:"gram", baseCal:30, baseAmount:100},
  {id:35, name:"Pepaya", category:"buah", unit:"gram", baseCal:43, baseAmount:100},
  {id:36, name:"Mangga", category:"buah", unit:"gram", baseCal:60, baseAmount:100},
  {id:37, name:"Susu Low Fat", category:"susu", unit:"ml", baseCal:42, baseAmount:100},
  {id:38, name:"Yogurt Plain", category:"susu", unit:"gram", baseCal:59, baseAmount:100},
  {id:39, name:"Greek Yogurt", category:"susu", unit:"gram", baseCal:59, baseAmount:100},
  {id:40, name:"Almond", category:"kacang-biji", unit:"gram", baseCal:579, baseAmount:100},
  {id:41, name:"Kacang Tanah", category:"kacang-biji", unit:"gram", baseCal:567, baseAmount:100},
  {id:42, name:"Chia Seed", category:"kacang-biji", unit:"sdm", baseCal:60, baseAmount:1},
  {id:43, name:"Protein Whey", category:"diet", unit:"sendok", baseCal:120, baseAmount:1},
  {id:44, name:"Psyllium Husk", category:"diet", unit:"sdm", baseCal:20, baseAmount:1}
];

// ============================================================
// Data Trait per tipe metabolisme — TIDAK DIUBAH
// ============================================================
const traitDataByType = {
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

// Data Quiz — TIDAK DIUBAH
const quizQuestions = [
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

const quizTypes = [
  {id:1, name:"Tipe Nasi Warrior", tagline:"Tubuhmu bereaksi kuat terhadap karbohidrat", emoji:"🍚", color:"#E07B39", bg:"#FEF0E6", textColor:"#7C2D12", metode:"standar", metodeName:"Standar + Kurangi Karbo", skor:78,
    tips:["Batasi nasi putih max 1 centong per makan","Ganti dengan nasi merah, ubi, atau kentang rebus","Makan karbo hanya di pagi & siang, hindari malam","Perbanyak protein & sayuran di setiap makan","KEMOENIK membantu menstabilkan respons gula darah"],
    hindari:"Nasi putih, roti putih, minuman manis", anjuran:"Nasi merah, ubi jalar, oatmeal"},
  {id:2, name:"Tipe Lemak Fighter", tagline:"Tubuhmu butuh dorongan ekstra untuk bakar lemak", emoji:"🔥", color:"#E53E3E", bg:"#FEF2F2", textColor:"#7F1D1D", metode:"agresif", metodeName:"Agresif + Intermittent Fasting 16:8", skor:72,
    tips:["Terapkan IF 16:8: makan dalam jendela 8 jam saja","Contoh: makan jam 10.00–18.00, puasa sisanya","Fokus pada makanan rendah lemak jenuh","Kardio minimal 30 menit setiap hari","KEMOENIK diminum saat buka puasa untuk efek maksimal"],
    hindari:"Gorengan, santan, makanan olahan berlemak", anjuran:"Dada ayam, ikan, tempe, sayuran hijau"},
  {id:3, name:"Tipe Otot Aktif", tagline:"Tubuhmu lebih optimal dengan asupan protein tinggi", emoji:"💪", color:"#3182CE", bg:"#EBF8FF", textColor:"#1E3A5F", metode:"standar", metodeName:"Standar + Tinggi Protein", skor:82,
    tips:["Target protein 1.8–2.2g per kg berat badan","Makan protein di setiap waktu makan utama","Kombinasikan kardio dengan latihan kekuatan","Konsumsi protein 30 menit setelah olahraga","KEMOENIK membantu pemulihan dan metabolisme optimal"],
    hindari:"Diet terlalu rendah kalori yang merusak otot", anjuran:"Telur, dada ayam, tempe, ikan, Greek yogurt"},
  {id:4, name:"Tipe Hemat Energi", tagline:"Metabolismemu bekerja lebih pelan dari rata-rata", emoji:"🐢", color:"#7C3AED", bg:"#F5F3FF", textColor:"#4C1D95", metode:"ringan", metodeName:"Ringan + Konsisten Jangka Panjang", skor:68,
    tips:["Jangan potong kalori drastis, kurangi perlahan","Defisit kecil (300 kcal) lebih efektif untuk tipe ini","Perbanyak aktivitas ringan: jalan kaki, naik tangga","Makan lebih sering dalam porsi kecil (5–6x sehari)","KEMOENIK membantu meningkatkan metabolisme secara alami"],
    hindari:"Diet ekstrem atau crash diet", anjuran:"Makanan tinggi serat, protein, dan air"},
  {id:5, name:"Tipe Mood & Lifestyle", tagline:"Gaya hidupmu sangat mempengaruhi berat badanmu", emoji:"🌙", color:"#D97706", bg:"#FFFBEB", textColor:"#78350F", metode:"ringan", metodeName:"Ringan + Kelola Stres & Tidur", skor:70,
    tips:["Prioritaskan tidur 7–8 jam per malam","Kelola stres dengan meditasi atau olahraga ringan","Hindari makan larut malam saat stres","Buat rutinitas makan yang teratur setiap hari","KEMOENIK membantu keseimbangan hormonal secara alami"],
    hindari:"Begadang, makan emosional, kafein berlebih", anjuran:"Pisang, dark chocolate, teh herbal"},
  {id:6, name:"Tipe Perut Sensitif", tagline:"Sistem pencernaanmu butuh perhatian ekstra", emoji:"🌿", color:"#059669", bg:"#ECFDF5", textColor:"#064E3B", metode:"standar", metodeName:"Standar + Anti Inflamasi", skor:75,
    tips:["Hindari makanan pemicu: susu, gluten, gorengan","Perbanyak probiotik: yogurt, tempe, kimchi","Makan perlahan dan kunyah hingga halus","Hindari makan terburu-buru atau sambil stres","KEMOENIK dengan herbal alami bantu sehatkan pencernaan"],
    hindari:"Susu, gorengan, makanan pedas berlebih, gluten", anjuran:"Yogurt, tempe, sayuran rebus, buah non-asam"},
  {id:7, name:"Tipe Seimbang", tagline:"Tubuhmu sudah baik, kuncinya konsistensi!", emoji:"⚖️", color:"#2D5A3D", bg:"#F0FDF4", textColor:"#14532D", metode:"standar", metodeName:"Standar + Konsistensi", skor:88,
    tips:["Tubuhmu merespons baik terhadap diet seimbang","Tetap pada defisit kalori yang konsisten setiap hari","Variasikan menu agar tidak bosan","Olahraga kombinasi kardio + kekuatan 3–4x seminggu","KEMOENIK sebagai pendamping untuk hasil lebih optimal"],
    hindari:"Inkonsistensi dan cheat meal berlebihan", anjuran:"Semua makanan bergizi dalam porsi seimbang"}
];

// ============================================================
// BARU: Data konten Tips Diet
// ============================================================
const tipsKontenData = [
  {
    id: 'defisit', icon: '🔥', judul: 'Defisit Kalori — Kunci Utama Diet',
    warna: '#DC2626', bgWarna: '#FEF2F2',
    konten: [
      'Defisit kalori = kalori masuk LEBIH SEDIKIT dari kalori yang dibakar tubuh.',
      'Kalori harian yang sudah dihitung di kalkulator adalah target harianmu — jangan melebihinya!',
      'Defisit 300–500 kkal/hari = turun ~0.3–0.5 kg/minggu (aman & konsisten)',
      'Defisit 700 kkal/hari = turun ~0.7 kg/minggu (agresif, perlu disiplin tinggi)',
      'JANGAN potong kalori di bawah 1200 kkal/hari — berbahaya untuk kesehatan'
    ]
  },
  {
    id: 'pola-makan', icon: '🍽️', judul: 'Pola Makan yang Benar',
    warna: '#059669', bgWarna: '#ECFDF5',
    konten: [
      'Makan 3x sehari + 2x snack sehat, jangan skip sarapan',
      'Perbanyak protein di setiap makan (telur, ayam, tempe, tahu, ikan)',
      'Batasi nasi putih — ganti dengan nasi merah, ubi, kentang rebus, atau oatmeal',
      'Sayuran hijau: makan sepuasnya karena kalorinya sangat rendah',
      'Hindari makanan olahan, gorengan, dan minuman manis setiap hari',
      'Minum 2–3 liter air putih per hari untuk mendukung metabolisme'
    ]
  },
  {
    id: 'waktu-makan', icon: '⏰', judul: 'Waktu Makan yang Optimal',
    warna: '#D97706', bgWarna: '#FFFBEB',
    konten: [
      'Sarapan: jam 06:00–08:00 (jangan skip!)',
      'Makan siang: jam 11:30–13:00',
      'Snack sore: jam 15:00–16:00',
      'Makan malam: maksimal jam 18:00–19:00',
      'Jangan makan berat setelah jam 19:00 — metabolisme melambat di malam hari',
      'Konsumsi KEMOENIK: 3 kapsul pagi (sesudah makan) + 3 kapsul sore (sesudah makan)'
    ]
  },
  {
    id: 'if-puasa', icon: '🌙', judul: 'Intermittent Fasting (IF) 16:8',
    warna: '#7C3AED', bgWarna: '#F5F3FF',
    konten: [
      'IF 16:8 artinya: puasa 16 jam, makan dalam jendela 8 jam saja',
      'Contoh: makan dari jam 10:00 hingga 18:00, puasa dari 18:00 sampai 10:00 besok',
      'Boleh minum air putih, teh herbal tanpa gula, dan kopi hitam tanpa gula saat puasa',
      'Minum KEMOENIK saat buka puasa (jam 10:00) untuk efek maksimal',
      'IF sangat cocok untuk Tipe Lemak Fighter (Tipe 2)',
      'TIDAK disarankan untuk: ibu hamil, busui, penderita maag, Tipe Perut Sensitif (Tipe 6)'
    ]
  },
  {
    id: 'olahraga-tips', icon: '💪', judul: 'Panduan Olahraga Diet KEMOENIK',
    warna: '#2563EB', bgWarna: '#EFF6FF',
    konten: [
      'Jalan kaki 30 menit/hari sudah sangat efektif untuk pemula — mulai dari sini!',
      'Jumping Jack: olahraga ringan yang bisa dilakukan di rumah tanpa alat',
      'Lompat Tali: kardio terbaik untuk bakar kalori cepat (~150–200 kkal/15 menit)',
      'Lymphatic Drainage: pijat lembut untuk membantu sirkulasi dan pembuangan toksin',
      'Tutorial Lymphatic: pijat leher ke bawah, ketiak melingkar, perut searah jarum jam, paha dari lutut ke atas — 10–15x tiap area',
      'Cari tutorial di YouTube/TikTok: "Jumping Jack Pemula", "Lompat Tali Diet", "Lymphatic Drainage untuk Diet"'
    ]
  },
  {
    id: 'lymphatic', icon: '🌿', judul: 'Lymphatic Drainage — Panduan Lengkap',
    warna: '#059669', bgWarna: '#ECFDF5',
    konten: [
      'Lakukan setiap malam sebelum tidur, durasi 10–15 menit',
      'LANGKAH 1 — Leher: Pijat dari belakang telinga turun ke arah tulang selangka, 10x kiri & kanan',
      'LANGKAH 2 — Ketiak: Tekan ringan area ketiak dengan gerakan melingkar, 15x kiri & kanan',
      'LANGKAH 3 — Perut: Pijat searah jarum jam dimulai dari pusar melebar ke luar, 15–20x',
      'LANGKAH 4 — Paha: Tekan dari lutut ke arah atas paha, 10–15x per sisi',
      'LANGKAH 5 — Betis: Tekan dari pergelangan kaki ke arah lutut, 10x per sisi',
      'Gunakan minyak kelapa atau lotion agar lebih nyaman dan efektif'
    ]
  },
  {
    id: 'air-putih', icon: '💧', judul: 'Hidrasi — Kenapa Air Putih Sangat Penting',
    warna: '#0284C7', bgWarna: '#F0F9FF',
    konten: [
      'Target: minum minimal 2 liter (8 gelas) air putih sehari',
      'Minum 1–2 gelas segera setelah bangun tidur untuk kickstart metabolisme',
      'Minum 1 gelas 20–30 menit sebelum makan untuk kurangi porsi makan secara alami',
      'Kurangi minuman manis, soda, jus kemasan, dan kopi kental bergula',
      'Tanda dehidrasi: urin berwarna gelap, pusing, sulit konsentrasi — segera minum!',
      'KEMOENIK mengandung Tempuyung yang bersifat diuretik alami — pastikan minum cukup air'
    ]
  },
  {
    id: 'tidur', icon: '😴', judul: 'Tidur yang Berkualitas untuk Diet',
    warna: '#4F46E5', bgWarna: '#EEF2FF',
    konten: [
      'Target tidur: 7–8 jam per malam, tidur sebelum jam 23:00',
      'Kurang tidur meningkatkan hormon Ghrelin (hormon lapar) — kamu jadi lebih mudah lapar',
      'Kurang tidur juga menurunkan hormon Leptin (hormon kenyang) — susah merasa cukup',
      'Tidur cukup = metabolisme lebih cepat + proses pembakaran lemak lebih efektif',
      'Tips tidur lebih baik: matikan layar HP 1 jam sebelum tidur, kamar gelap dan sejuk',
      'Hindari makan berat atau kafein 2–3 jam sebelum tidur'
    ]
  }
];

// ========== DAILY CHALLENGE DATA ==========
const challengeItems = [
  { id: 'kapsul',    icon: '🌿', label: 'Minum kapsul KEMOENIK sesuai aturan' },
  { id: 'air',       icon: '💧', label: 'Minum air minimal 2 liter hari ini' },
  { id: 'olahraga',  icon: '💪', label: 'Olahraga sesuai jadwal hari ini' },
  { id: 'gorengan',  icon: '🍽️', label: 'Tidak makan gorengan hari ini' },
  { id: 'gula',      icon: '🍬', label: 'Mengurangi gula hari ini' },
  { id: 'minuman',   icon: '🥤', label: 'Tidak minum minuman manis' }
];

const badgeConfig = [
  { id: 'pemula',      icon: '🌱', label: 'Pemula Aktif',    desc: '1 hari penuh (6/6 challenge)' },
  { id: 'rajinMinum',  icon: '💊', label: 'Rajin Minum',     desc: '7 hari berturut minum kapsul' },
  { id: 'atletPemula', icon: '🏃', label: 'Atlet Pemula',    desc: '4 sesi olahraga minggu ini' },
  { id: 'pejuangDiet', icon: '🥗', label: 'Pejuang Diet',    desc: 'Tidak gorengan 5 hari berturut' },
  { id: 'konsisten',   icon: '🔥', label: 'Konsisten',       desc: '5 hari penuh berturut-turut' },
  { id: 'juaraMinggu', icon: '🏆', label: 'Juara Minggu',    desc: 'Semua target minggu tercapai' },
  { id: 'dietWarrior', icon: '👑', label: 'Diet Warrior',    desc: '4 minggu konsisten' }
];

const motivasiChallenge = [
  'Luar biasa! Kamu sudah selangkah lebih dekat ke tubuh impianmu! 🎉',
  'Yeay! Semua challenge hari ini selesai! KEMOENIK bangga sama kamu! 🥳',
  'Perfect day! Konsistensimu hari ini akan terasa 2 minggu lagi! 💪',
  'Challenge selesai! Kamu bukan cuma diet, kamu membangun kebiasaan sehat! 🌟',
  'Wow, full challenge! Tidur nyenyak malam ini, besok lebih semangat lagi! 😴✨'
];
// ============================================================
// HERBAL KEMOENIK — DATA BAHAN & MANFAAT DIET
// ============================================================
const herbalKemoenikData = [
  {
    id: 'teh-hijau',
    nama: 'Teh Hijau',
    latin: 'Camellia sinensis',
    emoji: '🍵',
    warna: '#059669',
    bg: '#ECFDF5',
    badgeColor: '#D1FAE5',
    badgeText: '#065F46',
    peran: 'Pembakar Lemak & Booster Metabolisme',
    mekanisme: 'Kandungan EGCG (Epigallocatechin gallate) menghambat enzim pemecah norepinefrin — hormon utama pembakar lemak. Hasilnya, hormon ini bertahan lebih lama di tubuh dan memicu sel lemak untuk melepas energi.',
    faktaRiset: 'Penelitian menunjukkan EGCG + kafein dalam teh hijau meningkatkan metabolisme basal 3–4%. Orang yang konsumsi ekstrak teh hijau sebelum olahraga terbukti membakar lemak 17% lebih banyak.',
    poin: [
      'Meningkatkan laju metabolisme bahkan saat istirahat',
      'EGCG + kafein bekerja sinergis memecah sel lemak ke aliran darah',
      'Bantu oksidasi lemak saat olahraga hingga 17% lebih efektif',
      'Mengandung antioksidan kuat yang melindungi sel dari kerusakan akibat diet'
    ],
    efekWajar: null
  },
  {
    id: 'jati-belanda',
    nama: 'Jati Belanda',
    latin: 'Guazuma ulmifolia',
    emoji: '🌿',
    warna: '#2E8B35',
    bg: '#F0FDF4',
    badgeColor: '#DCFCE7',
    badgeText: '#14532D',
    peran: 'Penghambat Penyerapan Lemak',
    mekanisme: 'Kandungan musilago (lendir alami) dan tanin melapisi dinding usus halus, menghambat enzim lipase pankreas — enzim yang memecah lemak dari makanan. Lemak yang tidak dipecah tidak bisa diserap dan langsung dibuang.',
    faktaRiset: 'Penelitian Astuti et al. (2010) membuktikan ekstrak Jati Belanda secara signifikan menghambat aktivitas lipase dan meningkatkan termogenesis (produksi panas tubuh untuk bakar kalori).',
    poin: [
      'Musilago melapisi usus → lemak dari makanan tidak terserap maksimal',
      'Alkaloid menekan nafsu makan secara alami tanpa stimulan kimia',
      'Tanin mengikat protein di permukaan usus → penyerapan kalori lebih lambat',
      'Kombinasi terbaik dengan Temulawak untuk lindungi lambung'
    ],
    efekWajar: 'BAB lebih lunak adalah tanda lemak sedang dikeluarkan tubuh — ini NORMAL dan artinya herbal bekerja!'
  },
  {
    id: 'kemuning',
    nama: 'Daun Kemuning',
    latin: 'Murraya paniculata',
    emoji: '🌸',
    warna: '#D97706',
    bg: '#FFFBEB',
    badgeColor: '#FEF3C7',
    badgeText: '#78350F',
    peran: 'Anti-Obesitas & Penghambat Enzim Lipase',
    mekanisme: 'Senyawa aktif kemuning (alkaloid, flavonoid, osthol) menghambat enzim lipase pankreas — sama dengan mekanisme obat diet Orlistat, namun secara alami. Lemak dari makanan tidak bisa dicerna dan diserap, lalu dibuang bersama feses.',
    faktaRiset: 'Jurnal Sains dan Kesehatan (2023) membuktikan ekstrak etanol daun kemuning dosis 200mg/kgBB memiliki aktivitas antiobesitas dengan menghambat kenaikan bobot badan sebesar 109,28%. Penelitian Universitas Lampung juga membuktikan penurunan BMI dan rasio lingkar pinggang secara signifikan (p<0,05).',
    poin: [
      'Hambat enzim lipase pankreas → lemak tidak dicerna, tidak diserap',
      'Meningkatkan metabolisme lemak dan pembakaran kalori',
      'Sifat anti-inflamasi membantu atasi inflamasi kronis akibat obesitas',
      'Melancarkan peredaran darah sehingga nutrisi tersebar merata ke sel'
    ],
    efekWajar: null
  },
  {
    id: 'temulawak',
    nama: 'Temulawak',
    latin: 'Curcuma xanthorrhiza',
    emoji: '🟡',
    warna: '#B45309',
    bg: '#FEF9C3',
    badgeColor: '#FEF08A',
    badgeText: '#713F12',
    peran: 'Penjaga Hati & Metabolisme Lemak',
    mekanisme: 'Kurkuminoid dan xanthorrhizol merangsang produksi cairan empedu dari hati. Cairan empedu inilah yang memecah lemak di usus kecil menjadi molekul kecil untuk diproses. Makin banyak empedu = pencernaan lemak makin efisien.',
    faktaRiset: 'Penelitian membuktikan temulawak berpengaruh langsung pada metabolisme lipid (pemrosesan lemak) dan dapat mengurangi peradangan yang dikaitkan dengan obesitas. Sifat hepatoprotektif-nya melindungi hati dari kerusakan selama proses detoks intensif.',
    poin: [
      'Stimulasi cairan empedu → pencernaan dan pemrosesan lemak lebih efisien',
      'Hepatoprotektif: melindungi hati yang bekerja keras saat detoks',
      'Xanthorrhizol menurunkan kadar trigliserida dan kolesterol dalam darah',
      'Mengurangi peradangan kronis — musuh tersembunyi yang hambat penurunan BB'
    ],
    efekWajar: 'Urin berwarna lebih kuning — efek normal dari Temulawak + Teh Hijau yang sedang mendetoksifikasi tubuh. Perbanyak minum air putih!'
  },
  {
    id: 'tempuyung',
    nama: 'Tempuyung',
    latin: 'Sonchus arvensis',
    emoji: '💧',
    warna: '#0369A1',
    bg: '#EFF6FF',
    badgeColor: '#DBEAFE',
    badgeText: '#1E3A5F',
    peran: 'Detoksifikasi & Buang Retensi Air',
    mekanisme: 'Kandungan flavonoid dan kalium tinggi memiliki efek diuretik alami — merangsang ginjal membuang kelebihan cairan, toksin, dan sisa metabolisme melalui urin. Ini yang menyebabkan penurunan BB terasa cepat di awal program.',
    faktaRiset: 'Penelitian IPB mengkonfirmasi kandungan kalium dan flavonoid Tempuyung berperan penting dalam efek diuretik dan anti-inflamasi. Ginjal yang bersih adalah organ kunci saat tubuh aktif membakar lemak — detoks ginjal = metabolisme lancar.',
    poin: [
      'Diuretik alami: buang kelebihan cairan & retensi air dari tubuh',
      'Detoks ginjal: bersihkan sisa metabolisme yang hambat pembakaran lemak',
      'Kalium tinggi: jaga keseimbangan elektrolit selama proses detoks',
      'Anti-inflamasi: kurangi pembengkakan akibat penumpukan cairan berlebih'
    ],
    efekWajar: 'Lebih sering buang air kecil (pipis) = tanda detoks berjalan dengan baik! Ini NORMAL. Pastikan minum air putih 2–3 liter per hari.'
  }
];
