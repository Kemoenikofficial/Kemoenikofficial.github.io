/**
 * KEMOENIK - COMPLETE DATA INTEGRATION
 * Source: KEMOENIK_APP_v2.html (extracted & optimized)
 * Version: 2.0 Modular
 */

// ============================================================
// 1. QUIZ DATA - 15 Pertanyaan Metabolisme
// ============================================================

const quizQuestions = [
  {
    text: "Ketika makan nasi dalam porsi besar (lebih dari 1 centong), apa yang biasanya kamu rasakan?",
    options: [
      { emoji: "😴", text: "Langsung mengantuk dan lemas", scores: [3, 0, 0, 1, 0, 0, 0] },
      { emoji: "😐", text: "Biasa saja, tidak ada efek khusus", scores: [0, 0, 0, 0, 0, 0, 3] },
      { emoji: "😤", text: "Perut kembung dan tidak nyaman", scores: [0, 0, 0, 0, 0, 3, 0] },
      { emoji: "⚡", text: "Justru merasa lebih berenergi", scores: [0, 1, 2, 0, 0, 0, 1] }
    ]
  },
  {
    text: "Bagaimana kondisi berat badanmu dalam 6 bulan terakhir?",
    options: [
      { emoji: "📈", text: "Naik terus meski tidak makan banyak", scores: [2, 2, 0, 1, 1, 0, 0] },
      { emoji: "🔄", text: "Naik turun tidak stabil", scores: [1, 1, 0, 0, 2, 0, 1] },
      { emoji: "➡️", text: "Stagnan, susah turun meski sudah diet", scores: [1, 2, 0, 2, 0, 0, 0] },
      { emoji: "📉", text: "Bisa turun kalau konsisten diet", scores: [0, 0, 1, 0, 0, 0, 3] }
    ]
  },
  {
    text: "Dimana lemak paling banyak menumpuk di tubuhmu?",
    options: [
      { emoji: "🍎", text: "Perut dan pinggang", scores: [2, 2, 0, 1, 0, 0, 0] },
      { emoji: "🍐", text: "Paha dan pinggul", scores: [1, 1, 0, 1, 1, 0, 0] },
      { emoji: "📏", text: "Merata di seluruh tubuh", scores: [0, 1, 0, 2, 0, 0, 1] },
      { emoji: "💪", text: "Lemak sedikit tapi susah berotot", scores: [0, 0, 3, 0, 0, 0, 0] }
    ]
  },
  {
    text: "Bagaimana nafsu makanmu sehari-hari?",
    options: [
      { emoji: "🐘", text: "Selalu lapar, sulit kenyang", scores: [1, 2, 0, 1, 1, 0, 0] },
      { emoji: "⏰", text: "Lapar di jam tertentu saja", scores: [0, 0, 0, 0, 0, 0, 3] },
      { emoji: "😐", text: "Normal, tidak terlalu lapar", scores: [0, 1, 1, 0, 0, 1, 1] },
      { emoji: "😤", text: "Sering ngidam makanan manis/asin", scores: [2, 0, 0, 0, 2, 0, 0] }
    ]
  },
  {
    text: "Apa yang terjadi setelah kamu makan makanan manis?",
    options: [
      { emoji: "📈", text: "Gula darah naik cepat, lalu drop dan lapar lagi", scores: [3, 0, 0, 0, 0, 1, 0] },
      { emoji: "😴", text: "Mengantuk dan ingin tidur", scores: [1, 1, 0, 2, 0, 0, 0] },
      { emoji: "⚡", text: "Merasa berenergi cukup lama", scores: [0, 0, 1, 0, 0, 0, 3] },
      { emoji: "🤢", text: "Tidak nyaman atau mual", scores: [0, 0, 0, 0, 0, 3, 0] }
    ]
  },
  {
    text: "Bagaimana kualitas tidurmu?",
    options: [
      { emoji: "😴", text: "Sering susah tidur atau tidur tidak nyenyak", scores: [0, 0, 0, 0, 3, 0, 0] },
      { emoji: "🌙", text: "Tidur cukup dan berkualitas", scores: [0, 0, 0, 0, 0, 0, 3] },
      { emoji: "⏰", text: "Tidur mepet karena aktivitas padat", scores: [0, 1, 1, 0, 1, 0, 0] },
      { emoji: "💤", text: "Sering tidur berlebihan tapi tetap lelah", scores: [1, 1, 0, 2, 0, 0, 0] }
    ]
  },
  {
    text: "Bagaimana kondisi perutmu sehari-hari?",
    options: [
      { emoji: "🎈", text: "Sering kembung walau tidak makan banyak", scores: [0, 0, 0, 0, 0, 3, 0] },
      { emoji: "😖", text: "Sering sembelit atau susah BAB", scores: [0, 0, 0, 0, 0, 3, 0] },
      { emoji: "✅", text: "Pencernaan lancar dan normal", scores: [0, 0, 0, 0, 0, 0, 3] },
      { emoji: "🔄", text: "Kadang bermasalah, kadang tidak", scores: [0, 0, 0, 0, 1, 1, 1] }
    ]
  },
  {
    text: "Bagaimana tubuhmu merespons olahraga kardio?",
    options: [
      { emoji: "🔥", text: "Berkeringat banyak tapi BB tidak turun", scores: [1, 3, 0, 0, 0, 0, 0] },
      { emoji: "💪", text: "Berkeringat dan BB turun", scores: [0, 0, 0, 0, 0, 0, 3] },
      { emoji: "😓", text: "Cepat lelah, sulit kardio lama", scores: [0, 0, 0, 3, 0, 0, 0] },
      { emoji: "🏋️", text: "Lebih suka olahraga kekuatan/gym", scores: [0, 0, 3, 0, 0, 0, 0] }
    ]
  },
  {
    text: "Bagaimana distribusi lemak di tubuhmu?",
    options: [
      { emoji: "🍎", text: "Banyak di perut (bentuk apel)", scores: [2, 2, 0, 1, 0, 0, 0] },
      { emoji: "🍐", text: "Banyak di pinggul/paha (bentuk pir)", scores: [1, 1, 0, 1, 1, 0, 0] },
      { emoji: "📏", text: "Merata di seluruh tubuh", scores: [0, 1, 0, 2, 0, 0, 1] },
      { emoji: "💪", text: "Lemak sedikit, tapi susah berotot", scores: [0, 0, 3, 0, 0, 0, 0] }
    ]
  },
  {
    text: "Setelah makan makanan berlemak (gorengan, santan)?",
    options: [
      { emoji: "🤢", text: "Mual atau tidak nyaman di perut", scores: [0, 0, 0, 0, 0, 3, 0] },
      { emoji: "😴", text: "Langsung mengantuk dan lemas", scores: [1, 2, 0, 1, 0, 0, 0] },
      { emoji: "✅", text: "Tidak ada masalah", scores: [0, 0, 1, 0, 0, 0, 3] },
      { emoji: "⚡", text: "Justru merasa lebih berenergi", scores: [0, 1, 1, 0, 0, 0, 1] }
    ]
  },
  {
    text: "Bagaimana kondisi kulitmu sehari-hari?",
    options: [
      { emoji: "🔴", text: "Mudah berjerawat atau kemerahan", scores: [1, 0, 0, 0, 1, 2, 0] },
      { emoji: "💧", text: "Kering dan kusam", scores: [0, 1, 0, 2, 0, 1, 0] },
      { emoji: "✨", text: "Normal dan sehat", scores: [0, 0, 0, 0, 0, 0, 3] },
      { emoji: "🌊", text: "Berminyak terutama di T-zone", scores: [1, 0, 0, 0, 2, 1, 0] }
    ]
  },
  {
    text: "Apa yang terjadi saat kamu skip makan (puasa sebentar)?",
    options: [
      { emoji: "😡", text: "Langsung pusing, lemas, dan marah", scores: [2, 0, 1, 0, 1, 0, 0] },
      { emoji: "💪", text: "Tidak masalah, masih berenergi", scores: [0, 2, 0, 0, 0, 0, 2] },
      { emoji: "🎯", text: "Justru merasa lebih fokus", scores: [0, 3, 0, 0, 0, 0, 1] },
      { emoji: "😐", text: "Biasa saja, tidak terlalu terasa", scores: [0, 1, 0, 1, 0, 0, 2] }
    ]
  },
  {
    text: "Bagaimana pola makan idealmu sehari-hari?",
    options: [
      { emoji: "🥩", text: "Lebih suka daging & protein, kurang suka karbo", scores: [0, 0, 3, 0, 0, 0, 0] },
      { emoji: "🥗", text: "Lebih suka sayur & buah, hindari lemak", scores: [0, 0, 0, 0, 0, 2, 1] },
      { emoji: "🍱", text: "Makan apa saja tapi porsi kecil", scores: [0, 0, 0, 3, 0, 0, 1] },
      { emoji: "⚖️", text: "Seimbang, semua dimakan secukupnya", scores: [0, 0, 0, 0, 0, 0, 3] }
    ]
  },
  {
    text: "Bagaimana tingkat aktivitas fisikmu sehari-hari?",
    options: [
      { emoji: "🪑", text: "Sangat jarang gerak, kerja duduk", scores: [1, 2, 0, 2, 0, 0, 0] },
      { emoji: "🚶", text: "Kadang jalan kaki, tidak rutin olahraga", scores: [1, 1, 0, 1, 1, 0, 0] },
      { emoji: "🏃", text: "Olahraga ringan 2-3x seminggu", scores: [0, 0, 1, 0, 0, 0, 2] },
      { emoji: "💪", text: "Olahraga intens hampir setiap hari", scores: [0, 0, 3, 0, 0, 0, 1] }
    ]
  },
  {
    text: "Apa pengalamanmu dengan program diet sebelumnya?",
    options: [
      { emoji: "😤", text: "Sudah coba banyak diet tapi tidak berhasil", scores: [1, 2, 0, 1, 1, 0, 0] },
      { emoji: "🔄", text: "Berhasil tapi berat balik lagi (yo-yo)", scores: [2, 1, 0, 0, 1, 0, 0] },
      { emoji: "📈", text: "Belum pernah coba diet serius", scores: [0, 0, 0, 0, 2, 0, 1] },
      { emoji: "✅", text: "Cukup berhasil kalau konsisten", scores: [0, 0, 0, 0, 0, 0, 3] }
    ]
  }
];

// ============================================================
// 2. QUIZ TYPES - 7 Tipe Metabolisme
// ============================================================

const quizTypes = [
  {
    id: 1,
    name: "Tipe Nasi Warrior",
    tagline: "Tubuhmu bereaksi kuat terhadap karbohidrat",
    emoji: "🍚",
    color: "#E07B39",
    bg: "#FEF0E6",
    textColor: "#7C2D12",
    metode: "standar",
    metodeName: "Standar + Kurangi Karbo",
    skor: 78,
    tips: [
      "Batasi nasi putih max 1 centong per makan",
      "Ganti dengan nasi merah, ubi, atau kentang rebus",
      "Makan karbo hanya di pagi & siang, hindari malam",
      "Perbanyak protein & sayuran di setiap makan",
      "KEMOENIK membantu menstabilkan respons gula darah"
    ],
    hindari: "Nasi putih, roti putih, minuman manis",
    anjuran: "Nasi merah, ubi jalar, oatmeal"
  },
  {
    id: 2,
    name: "Tipe Lemak Fighter",
    tagline: "Tubuhmu butuh dorongan ekstra untuk bakar lemak",
    emoji: "🔥",
    color: "#E53E3E",
    bg: "#FEF2F2",
    textColor: "#7F1D1D",
    metode: "agresif",
    metodeName: "Agresif + Intermittent Fasting 16:8",
    skor: 72,
    tips: [
      "Terapkan IF 16:8: makan dalam jendela 8 jam saja",
      "Contoh: makan jam 10.00–18.00, puasa sisanya",
      "Fokus pada makanan rendah lemak jenuh",
      "Kardio minimal 30 menit setiap hari",
      "KEMOENIK diminum saat buka puasa untuk efek maksimal"
    ],
    hindari: "Gorengan, santan, makanan olahan berlemak",
    anjuran: "Dada ayam, ikan, tempe, sayuran hijau"
  },
  {
    id: 3,
    name: "Tipe Otot Aktif",
    tagline: "Tubuhmu lebih optimal dengan asupan protein tinggi",
    emoji: "💪",
    color: "#3182CE",
    bg: "#EBF8FF",
    textColor: "#1E3A5F",
    metode: "standar",
    metodeName: "Standar + Tinggi Protein",
    skor: 82,
    tips: [
      "Target protein 1.8–2.2g per kg berat badan",
      "Makan protein di setiap waktu makan utama",
      "Kombinasikan kardio dengan latihan kekuatan",
      "Konsumsi protein 30 menit setelah olahraga",
      "KEMOENIK membantu pemulihan dan metabolisme optimal"
    ],
    hindari: "Diet terlalu rendah kalori yang merusak otot",
    anjuran: "Telur, dada ayam, tempe, ikan, Greek yogurt"
  },
  {
    id: 4,
    name: "Tipe Hemat Energi",
    tagline: "Metabolismemu bekerja lebih pelan dari rata-rata",
    emoji: "🐢",
    color: "#7C3AED",
    bg: "#F5F3FF",
    textColor: "#4C1D95",
    metode: "ringan",
    metodeName: "Ringan + Konsisten Jangka Panjang",
    skor: 68,
    tips: [
      "Jangan potong kalori drastis, kurangi perlahan",
      "Defisit kecil (300 kcal) lebih efektif untuk tipe ini",
      "Perbanyak aktivitas ringan: jalan kaki, naik tangga",
      "Makan lebih sering dalam porsi kecil (5–6x sehari)",
      "KEMOENIK membantu meningkatkan metabolisme secara alami"
    ],
    hindari: "Diet ekstrem atau crash diet",
    anjuran: "Makanan tinggi serat, protein, dan air"
  },
  {
    id: 5,
    name: "Tipe Mood & Lifestyle",
    tagline: "Gaya hidupmu sangat mempengaruhi berat badanmu",
    emoji: "🌙",
    color: "#D97706",
    bg: "#FFFBEB",
    textColor: "#78350F",
    metode: "ringan",
    metodeName: "Ringan + Kelola Stres & Tidur",
    skor: 70,
    tips: [
      "Prioritaskan tidur 7–8 jam per malam",
      "Kelola stres dengan meditasi atau olahraga ringan",
      "Hindari makan larut malam saat stres",
      "Buat rutinitas makan yang teratur setiap hari",
      "KEMOENIK membantu keseimbangan hormonal secara alami"
    ],
    hindari: "Begadang, makan emosional, kafein berlebih",
    anjuran: "Pisang, dark chocolate, teh herbal"
  },
  {
    id: 6,
    name: "Tipe Perut Sensitif",
    tagline: "Sistem pencernaanmu butuh perhatian ekstra",
    emoji: "🌿",
    color: "#059669",
    bg: "#ECFDF5",
    textColor: "#064E3B",
    metode: "standar",
    metodeName: "Standar + Anti Inflamasi",
    skor: 75,
    tips: [
      "Hindari makanan pemicu: susu, gluten, gorengan",
      "Perbanyak probiotik: yogurt, tempe, kimchi",
      "Makan perlahan dan kunyah hingga halus",
      "Hindari makan terburu-buru atau sambil stres",
      "KEMOENIK dengan herbal alami bantu sehatkan pencernaan"
    ],
    hindari: "Susu, gorengan, makanan pedas berlebih, gluten",
    anjuran: "Yogurt, tempe, sayuran rebus, buah non-asam"
  },
  {
    id: 7,
    name: "Tipe Seimbang",
    tagline: "Tubuhmu sudah baik, kuncinya konsistensi!",
    emoji: "⚖️",
    color: "#2D5A3D",
    bg: "#F0FDF4",
    textColor: "#14532D",
    metode: "standar",
    metodeName: "Standar + Konsistensi",
    skor: 88,
    tips: [
      "Tubuhmu merespons baik terhadap diet seimbang",
      "Tetap pada defisit kalori yang konsisten setiap hari",
      "Variasikan menu agar tidak bosan",
      "Olahraga kombinasi kardio + kekuatan 3–4x seminggu",
      "KEMOENIK sebagai pendamping untuk hasil lebih optimal"
    ],
    hindari: "Inkonsistensi dan cheat meal berlebihan",
    anjuran: "Semua makanan bergizi dalam porsi seimbang"
  }
];

// ============================================================
// 3. FAQ DATA - Pertanyaan Umum
// ============================================================

const faqData = [
  {
    cat: "Input & Evaluasi Progres",
    items: [
      {
        q: "Kapan saya harus input berat badan terbaru?",
        a: "Setiap minggu akhir setelah kapsul habis ya kak, lebih tepatnya pagi setelah bangun tidur & buang air kecil (jangan lupa untuk mengisi evaluasi mingguannya)."
      },
      {
        q: "Kok berat badan saya belum turun di grafik?",
        a: "Lemak turun bisa jadi massa otot naik, tetap konsisten menjalankan programnya, jangan lupa baca semua panduannya."
      },
      {
        q: "Saya salah masukkan angka timbangan, gimana cara ubahnya?",
        a: "Semua data bisa di edit dan dapat dihapus melalui tombol edit di riwayat evaluasi. Semangat kak!"
      }
    ]
  },
  {
    cat: "Konsumsi Kapsul & Reaksi Tubuh",
    items: [
      {
        q: "Kok belum turun di hari ke-5–7?",
        a: "Proses detoks tiap orang berbeda-beda ya kak, ada yang cepet ada yang lambat. Yang terpenting ikuti program ini supaya dapat hasil maksimal, semangat kak."
      },
      {
        q: "Kapan waktu terbaik minum kapsul KEMOENIK?",
        a: "Waktu terbaik adalah sesudah makan ya kak."
      },
      {
        q: "Kenapa saya jadi sering buang air kecil?",
        a: "Itu reaksi normal dari kandungan Tempuyung yang bersifat diuretik alami untuk membuang kelebihan cairan dan toksin. Pastikan minum air putih 2–3 liter sehari."
      },
      {
        q: "BAB jadi lebih lunak, apakah ini diare?",
        a: "Bukan diare ya kak, itu efek peluruhan lemak dari kandungan Jati Belanda. Jangan khawatir, tetap semangat dan konsisten."
      },
      {
        q: "Lagi haid/menstruasi, boleh tetap minum?",
        a: "Sarankan jeda di hari 1–3 ya kak."
      }
    ]
  },
  {
    cat: "Teknis Menu & Diet",
    items: [
      {
        q: "Saya alergi/tidak suka menu hari ini, boleh diganti?",
        a: "Boleh banget kak, asal defisit kalori ya. Sudah tersedia plan pengantinya di Custom Menu."
      },
      {
        q: "Bagaimana kalau ada acara makan (kondangan)?",
        a: "Tidak apa kak untuk sekali-kali, asal dibarengi olahraga dan defisit kalori ya. Minum kapsul KEMOENIK sebelum makan pesta agar lemak tidak langsung terserap."
      },
      {
        q: "Kalau \"cheating\" sehari, apakah program gagal?",
        a: "Jangan menyerah! Lanjutkan saja program di hari berikutnya. Kapsul KEMOENIK akan membantu, tapi jangan sering-sering ya Kak!"
      },
      {
        q: "Kenapa disuruh minum air putih terus?",
        a: "Untuk menghindari dehidrasi akibat efek detoksifikasi herbal KEMOENIK. Disarankan minum 2 liter/hari disesuaikan dengan aktivitas."
      }
    ]
  },
  {
    cat: "Aturan Pakai & Kondisi Khusus",
    items: [
      {
        q: "Boleh minum lebih dari 6 kapsul/hari?",
        a: "Tetap mengikuti anjuran 6 kapsul/hari ya kak sesuai panduan."
      },
      {
        q: "Boleh saat haid? Aman untuk Busui?",
        a: "Untuk haid: jeda saat H1–H3 ya kak. Untuk Busui: kami anjurkan jangan dulu karena KEMOENIK ini peluntur lemak."
      },
      {
        q: "Boleh minum bersama obat dokter?",
        a: "Boleh kak, sarankan memberi jeda sekitar 30 menit ya."
      },
      {
        q: "Apakah bikin ketergantungan atau jantung berdebar?",
        a: "KEMOENIK 100% herbal tanpa BKO. Tidak membuat jantung berdebar karena fokus pada metabolisme alami, bukan stimulan kimia."
      }
    ]
  },
  {
    cat: "Data & Hasil",
    items: [
      {
        q: "Berapa hari bisa kelihatan hasilnya?",
        a: "Setiap metabolisme berbeda-beda, namun rata-rata pengguna mulai merasakan badan lebih ringan dan lingkar perut berkurang dalam 7–14 hari jika mengikuti program."
      },
      {
        q: "Apakah setelah berhenti minum BB akan naik (Yoyo Effect)?",
        a: "Tidak, asalkan tetap menjaga pola makan sesuai edukasi menu. KEMOENIK membantu mengecilkan lambung secara alami sehingga nafsu makan lebih terkontrol."
      },
      {
        q: "Data saya aman tidak?",
        a: "Data berat badan dan progres hanya digunakan untuk sistem kalkulator diet personal dan tidak akan disebarluaskan."
      }
    ]
  }
];

// ============================================================
// 4. MENU HARIAN - Contoh Menu Default
// ============================================================

const menuHarianData = [
  {
    time: "07:00",
    label: "Sarapan",
    menu: "2 Telur Rebus + 1 Pisang / Ubi",
    cal: 220,
    icon: "🍳"
  },
  {
    time: "10:00",
    label: "Snack Pagi",
    menu: "Buah segar (jeruk/pepaya) + kacang",
    cal: 120,
    icon: "🍊"
  },
  {
    time: "12:00",
    label: "Makan Siang",
    menu: "Nasi ½ porsi + Lauk protein + Sayuran",
    cal: 450,
    icon: "🍱"
  },
  {
    time: "15:00",
    label: "Snack Sore",
    menu: "Pisang / Singkong rebus / Yogurt",
    cal: 130,
    icon: "🍌"
  },
  {
    time: "18:00",
    label: "Makan Malam",
    menu: "Ikan/Ayam bakar + Sayuran + Sedikit nasi",
    cal: 380,
    icon: "🍽️"
  }
];

// ============================================================
// 5. MISSIONS - Misi Harian Program
// ============================================================

const missions = {
  normal: [
    {
      id: "n1",
      name: "Bangun & Minum Air",
      sub: "2 gelas air putih hangat sebelum apapun",
      tag: "Pagi",
      tagClass: "tag-blue",
      icon: "☀️"
    },
    {
      id: "n2",
      name: "Olahraga Pagi",
      sub: "Jalan kaki 30 menit / Jumping jack / Lompat tali",
      tag: "Aktif",
      tagClass: "tag-green",
      icon: "🏃"
    },
    {
      id: "n3",
      name: "Minum KEMOENIK Pagi",
      sub: "Sesudah sarapan untuk aktivasi metabolisme",
      tag: "Herbal",
      tagClass: "tag-gold",
      icon: "🌿"
    },
    {
      id: "n4",
      name: "Lymphatic Drainage",
      sub: "10–15 menit pijat ringan sore hari",
      tag: "Sore",
      tagClass: "tag-gray",
      icon: "💆"
    },
    {
      id: "n5",
      name: "Minum KEMOENIK Malam",
      sub: "Sesudah makan malam untuk metabolisme malam",
      tag: "Herbal",
      tagClass: "tag-gold",
      icon: "🌙"
    }
  ],
  if: [
    {
      id: "i1",
      name: "Mulai Puasa 16 Jam",
      sub: "Hanya air putih, teh tanpa gula, kopi tanpa gula",
      tag: "Puasa",
      tagClass: "tag-red",
      icon: "⛔"
    },
    {
      id: "i2",
      name: "Olahraga Pagi (saat puasa)",
      sub: "Jalan kaki 30–45 menit untuk bakar lemak optimal",
      tag: "IF+Kardio",
      tagClass: "tag-blue",
      icon: "🔥"
    },
    {
      id: "i3",
      name: "Buka Puasa (10:00)",
      sub: "Protein + sayuran — Minum KEMOENIK sesudah makan",
      tag: "Makan",
      tagClass: "tag-green",
      icon: "🍽️"
    },
    {
      id: "i4",
      name: "Lymphatic Drainage",
      sub: "10–15 menit untuk lancarkan sirkulasi",
      tag: "Sore",
      tagClass: "tag-gray",
      icon: "💆"
    },
    {
      id: "i5",
      name: "Makan Terakhir (17:00)",
      sub: "Protein + sayuran ringan, skip nasi — Minum KEMOENIK",
      tag: "Makan",
      tagClass: "tag-gold",
      icon: "🌙"
    }
  ]
};

// ============================================================
// 6. TRAIT DATA BY TYPE - Karakteristik Metabolisme
// ============================================================

const traitDataByType = {
  1: [ // Nasi Warrior
    {
      name: "Respons terhadap Karbohidrat",
      badge: "Sensitif Tinggi",
      badgeClass: "badge-tinggi",
      pct: 85,
      labels: ["Rendah", "Normal", "Tinggi"],
      desc: "Tubuhmu bereaksi kuat terhadap asupan karbohidrat. Batasi karbohidrat sederhana & ganti dengan yang kompleks."
    },
    {
      name: "Kemampuan Bakar Lemak",
      badge: "Normal",
      badgeClass: "badge-optimal",
      pct: 50,
      labels: ["Rendah", "Normal", "Tinggi"],
      desc: "Kemampuan bakar lemak dalam batas normal. Defisit kalori konsisten akan memberikan hasil optimal."
    },
    {
      name: "Efisiensi Metabolisme Basal",
      badge: "Di Atas Rata-rata",
      badgeClass: "badge-optimal",
      pct: 65,
      labels: ["Rendah", "Normal", "Tinggi"],
      desc: "Metabolisme basalmu cukup efisien. Ini membantumu membakar kalori lebih banyak saat istirahat."
    },
    {
      name: "Toleransi Puasa",
      badge: "Rendah",
      badgeClass: "badge-perlu",
      pct: 30,
      labels: ["Rendah", "Normal", "Tinggi"],
      desc: "Kamu cenderung kurang toleran terhadap puasa panjang. IF tidak direkomendasikan untuk tipe ini."
    },
    {
      name: "Sensitivitas Stres vs BB",
      badge: "Sedang",
      badgeClass: "badge-perlu",
      pct: 50,
      labels: ["Rendah", "Sedang", "Tinggi"],
      desc: "Stres cukup berpengaruh terhadap berat badanmu. Kelola stres dengan olahraga ringan & tidur cukup."
    }
  ],
  2: [ // Lemak Fighter
    {
      name: "Kemampuan Bakar Lemak",
      badge: "Perlu Perhatian",
      badgeClass: "badge-perlu",
      pct: 72,
      labels: ["Rendah", "Normal", "Tinggi"],
      desc: "Tubuhmu cenderung lebih lambat membakar lemak. Atasi dengan defisit kalori konsisten + IF 16:8."
    },
    {
      name: "Respons terhadap Karbohidrat",
      badge: "Normal",
      badgeClass: "badge-optimal",
      pct: 45,
      labels: ["Sensitif", "Normal", "Toleran"],
      desc: "Respons gula darahmu terhadap karbohidrat masih normal. Tetap batasi karbohidrat sederhana."
    },
    {
      name: "Efisiensi Metabolisme Basal",
      badge: "Di Bawah Rata-rata",
      badgeClass: "badge-perlu",
      pct: 30,
      labels: ["Rendah", "Normal", "Tinggi"],
      desc: "Metabolisme basalmu lebih hemat energi — membakar lebih sedikit kalori saat istirahat."
    },
    {
      name: "Respons terhadap Kardio",
      badge: "Kurang Optimal",
      badgeClass: "badge-tinggi",
      pct: 78,
      labels: ["Kurang", "Cukup", "Baik"],
      desc: "Kardio saja tidak cukup efektif. Kombinasikan dengan latihan kekuatan untuk hasil lebih optimal."
    },
    {
      name: "Toleransi Puasa",
      badge: "Baik",
      badgeClass: "badge-optimal",
      pct: 25,
      labels: ["Rendah", "Normal", "Tinggi"],
      desc: "Tubuhmu cukup toleran terhadap puasa. IF 16:8 sangat cocok dan efektif untukmu!"
    }
  ],
  3: [ // Otot Aktif
    {
      name: "Kemampuan Bakar Lemak",
      badge: "Baik",
      badgeClass: "badge-optimal",
      pct: 60,
      labels: ["Rendah", "Normal", "Tinggi"],
      desc: "Kemampuan membakar lemakmu cukup baik, terutama saat dikombinasikan dengan latihan kekuatan."
    },
    {
      name: "Metabolisme Protein",
      badge: "Tinggi",
      badgeClass: "badge-optimal",
      pct: 80,
      labels: ["Rendah", "Normal", "Tinggi"],
      desc: "Tubuhmu efisien menggunakan protein untuk membangun & mempertahankan otot."
    },
    {
      name: "Respons terhadap Olahraga",
      badge: "Sangat Baik",
      badgeClass: "badge-optimal",
      pct: 20,
      labels: ["Kurang", "Cukup", "Baik"],
      desc: "Tubuhmu merespons sangat baik terhadap latihan fisik — ini keunggulan besar!"
    },
    {
      name: "Toleransi Kalori Rendah",
      badge: "Perlu Perhatian",
      badgeClass: "badge-perlu",
      pct: 65,
      labels: ["Toleran", "Sedang", "Sensitif"],
      desc: "Diet terlalu rendah kalori bisa merusak ototmu. Jangan potong kalori terlalu drastis."
    },
    {
      name: "Efisiensi Metabolisme Basal",
      badge: "Tinggi",
      badgeClass: "badge-optimal",
      pct: 25,
      labels: ["Rendah", "Normal", "Tinggi"],
      desc: "Metabolisme basalmu efisien dan tinggi — kamu membakar lebih banyak kalori bahkan saat istirahat."
    }
  ],
  4: [ // Hemat Energi
    {
      name: "Kecepatan Metabolisme",
      badge: "Lambat",
      badgeClass: "badge-tinggi",
      pct: 80,
      labels: ["Cepat", "Normal", "Lambat"],
      desc: "Metabolismemu bekerja lebih pelan. Jangan potong kalori drastis — defisit kecil lebih efektif."
    },
    {
      name: "Kemampuan Bakar Lemak",
      badge: "Rendah",
      badgeClass: "badge-perlu",
      pct: 70,
      labels: ["Rendah", "Normal", "Tinggi"],
      desc: "Pembakaran lemak butuh lebih banyak waktu. Konsistensi jangka panjang adalah kuncinya."
    },
    {
      name: "Toleransi Aktivitas Fisik",
      badge: "Sedang",
      badgeClass: "badge-perlu",
      pct: 55,
      labels: ["Rendah", "Sedang", "Tinggi"],
      desc: "Tingkatkan aktivitas fisik secara bertahap — jalan kaki, naik tangga, hindari lift."
    },
    {
      name: "Respons terhadap Perubahan",
      badge: "Butuh Waktu",
      badgeClass: "badge-perlu",
      pct: 72,
      labels: ["Cepat", "Sedang", "Lambat"],
      desc: "Tubuhmu butuh lebih banyak waktu untuk beradaptasi. Sabar dan tetap konsisten!"
    },
    {
      name: "Sensitivitas Stres vs BB",
      badge: "Sedang",
      badgeClass: "badge-perlu",
      pct: 55,
      labels: ["Rendah", "Sedang", "Tinggi"],
      desc: "Stres cukup berpengaruh. Prioritaskan tidur 7–8 jam dan kelola stres dengan baik."
    }
  ],
  5: [ // Mood & Lifestyle
    {
      name: "Pengaruh Stres terhadap BB",
      badge: "Tinggi",
      badgeClass: "badge-tinggi",
      pct: 82,
      labels: ["Rendah", "Sedang", "Tinggi"],
      desc: "Stres sangat mempengaruhi berat badanmu. Prioritaskan manajemen stres & tidur berkualitas."
    },
    {
      name: "Pola Tidur",
      badge: "Perlu Perhatian",
      badgeClass: "badge-perlu",
      pct: 70,
      labels: ["Baik", "Sedang", "Buruk"],
      desc: "Kurang tidur meningkatkan hormon lapar & menurunkan metabolisme. Targetkan 7–8 jam/malam."
    },
    {
      name: "Makan Emosional",
      badge: "Perlu Diwaspadai",
      badgeClass: "badge-perlu",
      pct: 75,
      labels: ["Rendah", "Sedang", "Tinggi"],
      desc: "Kamu cenderung makan saat emosi. Kenali triggernya dan cari alternatif — olahraga, meditasi."
    },
    {
      name: "Konsistensi Rutinitas",
      badge: "Perlu Ditingkatkan",
      badgeClass: "badge-tinggi",
      pct: 65,
      labels: ["Konsisten", "Sedang", "Tidak Konsisten"],
      desc: "Rutinitas yang tidak konsisten menghambat program diet. Buat jadwal makan & minum KEMOENIK tetap."
    },
    {
      name: "Kemampuan Bakar Lemak",
      badge: "Normal",
      badgeClass: "badge-optimal",
      pct: 45,
      labels: ["Rendah", "Normal", "Tinggi"],
      desc: "Kemampuan bakar lemakmu normal. Dengan perbaikan gaya hidup, hasilnya akan meningkat signifikan."
    }
  ],
  6: [ // Perut Sensitif
    {
      name: "Kesehatan Pencernaan",
      badge: "Perlu Perhatian",
      badgeClass: "badge-tinggi",
      pct: 75,
      labels: ["Baik", "Sedang", "Sensitif"],
      desc: "Sistem pencernaanmu sensitif. Hindari makanan pemicu: susu, gluten, gorengan, makanan pedas."
    },
    {
      name: "Kemampuan Bakar Lemak",
      badge: "Normal",
      badgeClass: "badge-optimal",
      pct: 50,
      labels: ["Rendah", "Normal", "Tinggi"],
      desc: "Kemampuan bakar lemak normal, namun masalah pencernaan sering menghambat proses diet."
    },
    {
      name: "Respons terhadap Lemak",
      badge: "Sensitif",
      badgeClass: "badge-perlu",
      pct: 70,
      labels: ["Toleran", "Normal", "Sensitif"],
      desc: "Makanan berlemak tinggi memicu ketidaknyamanan pencernaan. Fokus pada lemak sehat & porsi kecil."
    },
    {
      name: "Keberagaman Bakteri Usus",
      badge: "Perlu Ditingkatkan",
      badgeClass: "badge-perlu",
      pct: 60,
      labels: ["Baik", "Sedang", "Kurang"],
      desc: "Tambahkan probiotik: yogurt, tempe, kimchi untuk kesehatan usus yang lebih baik."
    },
    {
      name: "Toleransi Puasa",
      badge: "Rendah",
      badgeClass: "badge-tinggi",
      pct: 75,
      labels: ["Tinggi", "Sedang", "Rendah"],
      desc: "IF tidak direkomendasikan untuk tipe perutmu yang sensitif. Makan teratur lebih disarankan."
    }
  ],
  7: [ // Seimbang
    {
      name: "Kemampuan Bakar Lemak",
      badge: "Baik",
      badgeClass: "badge-optimal",
      pct: 35,
      labels: ["Rendah", "Normal", "Tinggi"],
      desc: "Kemampuan bakar lemakmu baik. Pertahankan dengan defisit kalori konsisten."
    },
    {
      name: "Respons terhadap Karbohidrat",
      badge: "Normal",
      badgeClass: "badge-optimal",
      pct: 50,
      labels: ["Sensitif", "Normal", "Toleran"],
      desc: "Respons karbohidratmu seimbang. Tetap variasikan antara karbohidrat kompleks dan sederhana."
    },
    {
      name: "Efisiensi Metabolisme Basal",
      badge: "Normal",
      badgeClass: "badge-optimal",
      pct: 50,
      labels: ["Rendah", "Normal", "Tinggi"],
      desc: "Metabolisme basalmu dalam kondisi optimal. Pertahankan pola makan sehat & olahraga rutin."
    },
    {
      name: "Toleransi Olahraga",
      badge: "Baik",
      badgeClass: "badge-optimal",
      pct: 25,
      labels: ["Rendah", "Sedang", "Tinggi"],
      desc: "Tubuhmu merespons baik terhadap berbagai jenis olahraga. Variasikan kardio + latihan kekuatan."
    },
    {
      name: "Konsistensi",
      badge: "Kunci Utama",
      badgeClass: "badge-optimal",
      pct: 50,
      labels: ["Rendah", "Sedang", "Tinggi"],
      desc: "Metabolismemu sudah baik — kunci keberhasilanmu adalah KONSISTENSI dalam menjalankan program."
    }
  ]
};

// ============================================================
// 7. TARGET OLAHRAGA DATA - Jadwal per Metode
// ============================================================

const targetOlahragaData = {
  ringan: [
    { hari: "Sen", aktivitas: "Jalan kaki 30 menit" },
    { hari: "Sel", aktivitas: "Lymphatic 15 menit" },
    { hari: "Rab", aktivitas: "Istirahat aktif — jalan santai" },
    { hari: "Kam", aktivitas: "Jalan kaki 30 menit" },
    { hari: "Jum", aktivitas: "Jumping jack 3 set" },
    { hari: "Sab", aktivitas: "Jalan kaki 45 menit" },
    { hari: "Min", aktivitas: "Istirahat total" }
  ],
  standar: [
    { hari: "Sen", aktivitas: "Jalan kaki 30 menit + Jumping jack 3 set" },
    { hari: "Sel", aktivitas: "Lompat tali 10 menit + Lymphatic 10 menit" },
    { hari: "Rab", aktivitas: "Jalan kaki 30 menit" },
    { hari: "Kam", aktivitas: "Jumping jack 4 set + Lompat tali 10 menit" },
    { hari: "Jum", aktivitas: "Jalan kaki 45 menit + Lymphatic 15 menit" },
    { hari: "Sab", aktivitas: "Lompat tali 15 menit + Jumping jack 3 set" },
    { hari: "Min", aktivitas: "Istirahat — Lymphatic sebelum tidur" }
  ],
  agresif: [
    { hari: "Sen", aktivitas: "Lompat tali 15 menit + Jalan kaki 30 menit" },
    { hari: "Sel", aktivitas: "Jumping jack 5 set + Lymphatic 15 menit" },
    { hari: "Rab", aktivitas: "Jalan kaki 45 menit + Lompat tali 10 menit" },
    { hari: "Kam", aktivitas: "Lompat tali 20 menit + Jumping jack 4 set" },
    { hari: "Jum", aktivitas: "Jalan kaki 60 menit" },
    { hari: "Sab", aktivitas: "Lompat tali 15 menit + Jumping jack 5 set + Lymphatic" },
    { hari: "Min", aktivitas: "Jalan kaki santai 30 menit — recovery" }
  ]
};

// ============================================================
// 8. CUSTOM MENU FOOD DATABASE
// ============================================================

const cmFoodDatabase = [
  { id: 1, name: "Telur Ayam", category: "protein-hewani", unit: "butir", baseCal: 78, baseAmount: 1 },
  { id: 2, name: "Dada Ayam (Rebus)", category: "protein-hewani", unit: "gram", baseCal: 165, baseAmount: 100 },
  { id: 3, name: "Dada Ayam (Goreng)", category: "protein-hewani", unit: "gram", baseCal: 220, baseAmount: 100 },
  { id: 4, name: "Ikan Kembung (Rebus)", category: "protein-hewani", unit: "gram", baseCal: 167, baseAmount: 100 },
  { id: 5, name: "Ikan Salmon", category: "protein-hewani", unit: "gram", baseCal: 208, baseAmount: 100 },
  { id: 6, name: "Ikan Tuna (Kaleng)", category: "protein-hewani", unit: "gram", baseCal: 116, baseAmount: 100 },
  { id: 7, name: "Udang (Rebus)", category: "protein-hewani", unit: "gram", baseCal: 106, baseAmount: 100 },
  { id: 8, name: "Daging Sapi (Rebus)", category: "protein-hewani", unit: "gram", baseCal: 250, baseAmount: 100 },
  { id: 9, name: "Tempe (Rebus)", category: "protein-nabati", unit: "gram", baseCal: 192, baseAmount: 100 },
  { id: 10, name: "Tempe (Goreng)", category: "protein-nabati", unit: "gram", baseCal: 280, baseAmount: 100 },
  { id: 11, name: "Tahu Putih", category: "protein-nabati", unit: "gram", baseCal: 68, baseAmount: 100 },
  { id: 12, name: "Tahu Goreng", category: "protein-nabati", unit: "gram", baseCal: 200, baseAmount: 100 },
  { id: 13, name: "Edamame", category: "protein-nabati", unit: "gram", baseCal: 121, baseAmount: 100 },
  { id: 14, name: "Kacang Hijau", category: "protein-nabati", unit: "gram", baseCal: 105, baseAmount: 100 },
  { id: 15, name: "Nasi Putih", category: "karbohidrat", unit: "gram", baseCal: 130, baseAmount: 100 },
  { id: 16, name: "Nasi Merah", category: "karbohidrat", unit: "gram", baseCal: 111, baseAmount: 100 },
  { id: 17, name: "Kentang (Rebus)", category: "karbohidrat", unit: "gram", baseCal: 87, baseAmount: 100 },
  { id: 18, name: "Ubi Jalar (Rebus)", category: "karbohidrat", unit: "gram", baseCal: 90, baseAmount: 100 },
  { id: 19, name: "Oatmeal", category: "karbohidrat", unit: "gram", baseCal: 68, baseAmount: 100 },
  { id: 20, name: "Roti Gandum", category: "karbohidrat", unit: "iris", baseCal: 74, baseAmount: 1 },
  { id: 21, name: "Alpukat", category: "lemak", unit: "gram", baseCal: 160, baseAmount: 100 },
  { id: 22, name: "Minyak Zaitun", category: "lemak", unit: "sdm", baseCal: 119, baseAmount: 1 },
  { id: 23, name: "Keju Cheddar", category: "lemak", unit: "gram", baseCal: 402, baseAmount: 100 },
  { id: 24, name: "Bayam (Rebus)", category: "sayuran", unit: "gram", baseCal: 23, baseAmount: 100 },
  { id: 25, name: "Brokoli (Rebus)", category: "sayuran", unit: "gram", baseCal: 35, baseAmount: 100 },
  { id: 26, name: "Wortel (Rebus)", category: "sayuran", unit: "gram", baseCal: 35, baseAmount: 100 },
  { id: 27, name: "Kangkung (Tumis)", category: "sayuran", unit: "gram", baseCal: 50, baseAmount: 100 },
  { id: 28, name: "Tomat", category: "sayuran", unit: "gram", baseCal: 18, baseAmount: 100 },
  { id: 29, name: "Mentimun", category: "sayuran", unit: "gram", baseCal: 15, baseAmount: 100 },
  { id: 30, name: "Jamur (Tumis)", category: "sayuran", unit: "gram", baseCal: 40, baseAmount: 100 },
  { id: 31, name: "Pisang", category: "buah", unit: "buah", baseCal: 105, baseAmount: 1 },
  { id: 32, name: "Apel", category: "buah", unit: "buah", baseCal: 95, baseAmount: 1 },
  { id: 33, name: "Jeruk", category: "buah", unit: "buah", baseCal: 62, baseAmount: 1 },
  { id: 34, name: "Semangka", category: "buah", unit: "gram", baseCal: 30, baseAmount: 100 },
  { id: 35, name: "Pepaya", category: "buah", unit: "gram", baseCal: 43, baseAmount: 100 },
  { id: 36, name: "Mangga", category: "buah", unit: "gram", baseCal: 60, baseAmount: 100 },
  { id: 37, name: "Susu Low Fat", category: "susu", unit: "ml", baseCal: 42, baseAmount: 100 },
  { id: 38, name: "Yogurt Plain", category: "susu", unit: "gram", baseCal: 59, baseAmount: 100 },
  { id: 39, name: "Greek Yogurt", category: "susu", unit: "gram", baseCal: 59, baseAmount: 100 },
  { id: 40, name: "Almond", category: "kacang-biji", unit: "gram", baseCal: 579, baseAmount: 100 },
  { id: 41, name: "Kacang Tanah", category: "kacang-biji", unit: "gram", baseCal: 567, baseAmount: 100 },
  { id: 42, name: "Chia Seed", category: "kacang-biji", unit: "sdm", baseCal: 60, baseAmount: 1 },
  { id: 43, name: "Protein Whey", category: "diet", unit: "sendok", baseCal: 120, baseAmount: 1 },
  { id: 44, name: "Psyllium Husk", category: "diet", unit: "sdm", baseCal: 20, baseAmount: 1 }
];

// ============================================================
// 9. MENU LENGKAP 10 HARI (Ekonomis, Standar, Premium)
// ============================================================

const menuLengkapData = {
  ekonomis: [
    { day: 1, sarapan: "2 Telur Rebus + 1 Pisang", snackPagi: "Jeruk + Kacang Tanah", makanSiang: "Nasi Putih + Tahu/Tempe Bacem + Sayur Bayam", snackSore: "Pepaya Potong", makanMalam: "Ikan Kembung Bakar + Labu Siam + Kentang" },
    { day: 2, sarapan: "2 Telur Rebus + 1 Ubi Cilembu", snackPagi: "Pisang Goreng (Air Fryer)", makanSiang: "Nasi Putih + Orek Tempe + Sayur Asem", snackSore: "Singkong Rebus", makanMalam: "Ayam Bakar (Tanpa Kulit) + Lalapan + Sambal" },
    { day: 3, sarapan: "2 Telur Rebus + Jagung Rebus", snackPagi: "Buah Semangka", makanSiang: "Bihun Jagung + Telur Dadar + Tumis Kangkung", snackSore: "Kacang Hijau (No Santan)", makanMalam: "Ikan Lele Bakar + Cah Genjer + Nasi Putih" },
    { day: 4, sarapan: "2 Telur Rebus + Singkong Rebus", snackPagi: "Buah Melon", makanSiang: "Nasi Putih + Pepes Tahu + Sayur Lodeh (Bening)", snackSore: "Jagung Manis Pipil", makanMalam: "Telur Ceplok Air + Tumis Sawi Putih + Kentang" },
    { day: 5, sarapan: "2 Telur Rebus + Roti Tawar", snackPagi: "Salak 2 butir", makanSiang: "Nasi Putih + Pindang Tongkol + Sayur Sop", snackSore: "Pisang Rebus", makanMalam: "Pepes Jamur + Tahu Kuning + Sambal" },
    { day: 6, sarapan: "2 Telur Rebus + Pepaya", snackPagi: "Bengkoang", makanSiang: "Nasi Putih + Ayam Suwir + Tumis Kacang Panjang", snackSore: "Edamame Rebus", makanMalam: "Ikan Mujair Goreng + Wortel & Buncis Rebus" },
    { day: 7, sarapan: "2 Telur Rebus + ½ Alpukat", snackPagi: "Jambu Air", makanSiang: "Gado-Gado (Bumbu Sedikit) + Lontong", snackSore: "Kerupuk Putih (1)", makanMalam: "Sup Ceker Ayam + Sayuran + Nasi Putih" },
    { day: 8, sarapan: "2 Telur Rebus + Ubi Ungu", snackPagi: "Buah Naga ½", makanSiang: "Nasi Putih + Ikan Asin Kecil + Sayur Kelor", snackSore: "Pisang Ambon", makanMalam: "Ayam Bumbu Kuning + Sambal + Lalap" },
    { day: 9, sarapan: "2 Telur Rebus + Bubur Sumsum", snackPagi: "Mangga Lokal", makanSiang: "Nasi Putih + Tumis Kerang + Daun Singkong", snackSore: "Bakwan Sayur (1)", makanMalam: "Ikan Nila Bakar + Tumis Terong + Nasi Putih" },
    { day: 10, sarapan: "2 Telur Rebus + Pisang Kukus", snackPagi: "Kurma 3 butir", makanSiang: "Nasi Putih + Kentang Balado + Sayur Sop", snackSore: "Ketan Putih (Sedikit)", makanMalam: "Ayam Ungkep + Sayur Gambas + Nasi Putih" }
  ],
  standar: [
    { day: 1, sarapan: "2 Telur Rebus + Pisang Cavendish", snackPagi: "Apel + Almond", makanSiang: "Nasi Merah + Dada Ayam Grill + Buncis", snackSore: "Yogurt Plain + Granola", makanMalam: "Ikan Kakap Kukus + Salad + Kentang" },
    { day: 2, sarapan: "2 Telur Rebus + Oatmeal", snackPagi: "Pear + Kacang Mete", makanSiang: "Nasi Merah + Sapi Lada Hitam + Pakcoy", snackSore: "Smoothie Pisang", makanMalam: "Steak Ayam + Mix Veggies + Mashed Potato" },
    { day: 3, sarapan: "2 Telur Rebus + Roti Gandum", snackPagi: "Kiwi + Pistachio", makanSiang: "Pasta Gandum + Udang + Brokoli", snackSore: "Protein Bar", makanMalam: "Ikan Dory Panggang + Asparagus + Jagung" },
    { day: 4, sarapan: "2 Telur Rebus + Buah Naga", snackPagi: "Anggur + Keju Slice", makanSiang: "Nasi Merah + Ayam Teriyaki + Stir Fry Sayur", snackSore: "Salad Buah Low Fat", makanMalam: "Sup Ikan + Sawi + Nasi Merah" },
    { day: 5, sarapan: "2 Telur Rebus + Sereal Gandum", snackPagi: "Jeruk + Edamame", makanSiang: "Nasi Merah + Ikan Gurame Bakar + Kangkung", snackSore: "Dark Chocolate", makanMalam: "Beef Patty (Homemade) + Salad + Ubi" },
    { day: 6, sarapan: "2 Telur Rebus + Pancake Protein", snackPagi: "Blueberry + Almond", makanSiang: "Nasi Merah + Opor Ayam (Low Fat) + Labu", snackSore: "Greek Yogurt", makanMalam: "Ayam Bakar + Plecing + Nasi Merah" },
    { day: 7, sarapan: "2 Telur Rebus + Smoothie Bowl", snackPagi: "Strawberry + Kuaci", makanSiang: "Sandwich Gandum + Tuna + Selada", snackSore: "Jus Alpukat (No Sugar)", makanMalam: "Ikan Bawal Bakar + Tumis Jamur + Nasi Merah" },
    { day: 8, sarapan: "2 Telur Rebus + Muesli", snackPagi: "Apel Hijau + Peanut Butter", makanSiang: "Nasi Merah + Ayam Rosemary + Wortel", snackSore: "Puding Chia Seed", makanMalam: "Salad Caesar + Ayam Grill + Telur Rebus" },
    { day: 9, sarapan: "2 Telur Rebus + Alpukat Kocok", snackPagi: "Melon + Granola Bar", makanSiang: "Nasi Merah + Semur Daging + Sawi", snackSore: "Smoothie Nanas", makanMalam: "Ikan Nila Asam Manis + Brokoli + Nasi Merah" },
    { day: 10, sarapan: "2 Telur Rebus + Granola", snackPagi: "Pisang + Selai Kacang", makanSiang: "Nasi Merah + Udang Saus Tiram + Capcay", snackSore: "Yogurt Drink", makanMalam: "Steak Tempe & Daging + Salad + Kentang" }
  ],
  premium: [
    { day: 1, sarapan: "2 Telur Rebus + Alpukat Mentega", snackPagi: "Mix Berries + Walnut", makanSiang: "Quinoa + Salmon Steak + Asparagus", snackSore: "Greek Yogurt + Chia Seed", makanMalam: "Tuna Seared + Edamame Salad + Ubi Ungu" },
    { day: 2, sarapan: "2 Telur Rebus + Smoked Salmon", snackPagi: "Cherry + Macadamia", makanSiang: "Shirataki Rice + Wagyu Beef + Kale", snackSore: "Smoothie Kale & Whey", makanMalam: "Lobster Grilled + Salad Organik + Baby Potato" },
    { day: 3, sarapan: "2 Telur Rebus + Almond Butter Toast", snackPagi: "Buah Tin + Pecans", makanSiang: "Brown Rice + Gindara Grill + Baby Corn", snackSore: "Cold Pressed Juice", makanMalam: "Scallops + Puree Kembang Kol + Edamame" },
    { day: 4, sarapan: "2 Telur Rebus + Dragon Fruit Bowl", snackPagi: "Raspberry + Almonds", makanSiang: "Quinoa + Bebek Panggang + Bok Choy", snackSore: "Sorbet Buah Asli", makanMalam: "Sirloin Steak + Truffle Veggies + Sweet Potato" },
    { day: 5, sarapan: "2 Telur Rebus + Sourdough Toast", snackPagi: "Delima (Pomegranate)", makanSiang: "Shirataki + Kepiting Soka + Wakame", snackSore: "Matcha Latte (Almond)", makanMalam: "Grilled Cod Fish + Zucchini Noodles + Quinoa" },
    { day: 6, sarapan: "2 Telur Rebus + Acai Bowl", snackPagi: "Blackberry + Pistachio", makanSiang: "Quinoa + Lamb Chop + Paprika", snackSore: "Greek Yogurt + Honey", makanMalam: "Salmon Sashimi + Salad Wakame + Sup Miso" },
    { day: 7, sarapan: "2 Telur Rebus + Chia Pudding", snackPagi: "Peach + Brazil Nuts", makanSiang: "Shirataki + Udang Galah + Asparagus", snackSore: "Keto Cake Slice", makanMalam: "Roasted Turkey + Brussel Sprouts + Pumpkin" },
    { day: 8, sarapan: "2 Telur Rebus + Guacamole", snackPagi: "Apricot + Hazelnuts", makanSiang: "Brown Rice + Barramundi + Salad Organik", snackSore: "Smoothie Avocado", makanMalam: "Tenderloin Steak + Mushroom + Baby Carrot" },
    { day: 9, sarapan: "2 Telur Rebus + Quinoa Porridge", snackPagi: "Blueberries + Pine Nuts", makanSiang: "Shirataki + Venison (Rusa) + Kale", snackSore: "Almond Milk Pudding", makanMalam: "Grilled Octopus + Salad Mediterania + Hummus" },
    { day: 10, sarapan: "2 Telur Rebus + Protein Muffin", snackPagi: "Goji Berries + Walnut", makanSiang: "Quinoa + Chicken Sous Vide + Brokoli", snackSore: "Coconut Water", makanMalam: "Sea Bass Griled + Salad Quinoa + Mashed Potato" }
  ]
};

// ============================================================
// 10. CONSTANTS & CONFIG
// ============================================================

const APP_CONFIG = {
  name: "KEMOENIK",
  version: "2.0",
  url: "https://kemoenikofficial.github.io/aktivitas/",
  firebase: {
    apiKey: "AIzaSyD6C72QBKT1T7nB_RLxM7Z_Bo7iWSCTtTw",
    authDomain: "project-panduan-dani.firebaseapp.com",
    projectId: "project-panduan-dani",
       storageBucket: "project-panduan-dani.firebasestorage.app",
    messagingSenderId: "113559517545",
    appId: "1:113559517545:web:65e0baf79e28acb80a65f8"
  },
  defaults: {
    dietDeficit: {
      ringan: 300,
      standar: 500,
      agresif: 700
    },
    weightLossPerWeek: {
      ringan: 0.3,
      standar: 0.5,
      agresif: 0.7
    },
    reminderTimes: [
      { hour: 7, minute: 30, title: "☀️ KEMOENIK Pagi", body: "Minum 3 kapsul sesudah sarapan + air hangat" },
      { hour: 18, minute: 30, title: "🌙 KEMOENIK Malam", body: "Minum 3 kapsul sesudah makan malam + air putih" }
    ]
  },
  colors: {
    primary: "#2E7D5B",
    primaryDark: "#1F4D3A",
    primaryDarker: "#163628",
    primaryLight: "#3A9970",
    gold: "#C9A86A",
    goldDark: "#A8843F",
    goldLight: "#E8D09A",
    border: "#DDE5DB",
    border2: "#C5D5C1",
    text: "#1A1A1A",
    text2: "#2D4A35",
    text3: "#7A9080",
    bg: "#F4F6F3",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    card2: "#EEF3EE",
    offwhite: "#F9FBF9",
    red: "#C0392B",
    blue: "#2563EB",
    purple: "#6D28D9"
  }
};

// ============================================================
// 11. UTILITY FUNCTIONS
// ============================================================

/**
 * Escape HTML untuk mencegah XSS
 */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Format angka ke format Indonesia
 */
function formatNumber(num, decimals = 0) {
  if (num === null || num === undefined || isNaN(num)) return '—';
  return Number(num).toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format tanggal ke format Indonesia
 */
function formatDate(date, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('id-ID', options);
}

/**
 * Hitung BMI
 */
function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

/**
 * Hitung BMR (Mifflin-St Jeor)
 */
function calculateBMR(weightKg, heightCm, age, gender) {
  if (!weightKg || !heightCm || !age || !gender) return null;
  let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  bmr += gender === 'laki' ? 5 : -161;
  return Math.round(bmr);
}

/**
 * Hitung TDEE
 */
function calculateTDEE(bmr, activityMultiplier) {
  if (!bmr || !activityMultiplier) return null;
  return Math.round(bmr * activityMultiplier);
}

/**
 * Hitung target kalori diet
 */
function calculateDietCalories(tdee, method = 'standar') {
  if (!tdee) return null;
  const deficit = APP_CONFIG.defaults.dietDeficit[method] || 500;
  return Math.round(tdee - deficit);
}

/**
 * Hitung estimasi minggu program
 */
function calculateTargetWeeks(currentWeight, targetWeight, method = 'standar') {
  if (!currentWeight || !targetWeight || currentWeight <= targetWeight) return 4;
  const lossPerWeek = APP_CONFIG.defaults.weightLossPerWeek[method] || 0.5;
  const totalLoss = currentWeight - targetWeight;
  return Math.ceil(totalLoss / lossPerWeek);
}

/**
 * Hitung estimasi tanggal tercapai
 */
function calculateTargetDate(weeks) {
  const now = new Date();
  const targetDate = new Date(now.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
  return targetDate;
}

/**
 * Hitung estimasi lingkar perut
 */
function calculateEstLingkar(gender, heightCm, bmi, weightLoss) {
  if (!gender || !heightCm || !bmi) return null;
  const heightM = heightCm / 100;
  let estLingkar;
  if (gender === 'laki') {
    estLingkar = Math.round(0.722 * bmi + 0.525 * heightM * 100 - 48.3 - (weightLoss * 0.8));
  } else {
    estLingkar = Math.round(0.735 * bmi + 0.625 * heightM * 100 - 40.2 - (weightLoss * 0.8));
  }
  return Math.max(60, estLingkar);
}

/**
 * Normalisasi nomor WA
 */
function normalizeWA(wa) {
  if (!wa) return '';
  wa = wa.replace(/\D/g, '');
  if (wa.startsWith('08')) return '62' + wa.substring(1);
  if (wa.startsWith('+62')) return wa.substring(1);
  if (wa.startsWith('62')) return wa;
  if (wa.startsWith('0')) return '62' + wa.substring(1);
  return wa;
}

/**
 * Dapatkan hari ini dalam format ISO (YYYY-MM-DD)
 */
function getTodayISO() {
  const now = new Date();
  return now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0');
}

/**
 * Dapatkan nama hari dalam bahasa Indonesia
 */
function getHariName(dayIndex) {
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return hari[dayIndex] || '—';
}

/**
 * Dapatkan tips harian (rotate berdasarkan hari)
 */
function getDailyTip(dayIndex = new Date().getDay()) {
  const tips = [
    'Minum KEMOENIK sesudah makan untuk penyerapan optimal. Jangan skip meski tidak lapar!',
    'Ganti nasi putih dengan nasi merah atau ubi untuk kalori lebih rendah & serat lebih tinggi.',
    'Minum 2 gelas air putih sebelum makan — terbukti kurangi porsi makan secara alami.',
    'Olahraga 30 menit pagi hari meningkatkan metabolisme sepanjang hari. Mulai dari jalan kaki!',
    'Hindari makan setelah jam 7 malam. Beri tubuh waktu istirahat untuk proses pembakaran lemak.',
    'Konsistensi lebih penting dari kesempurnaan. Skip 1 hari tidak masalah, asal lanjut besok!',
    'Kurangi gula secara bertahap — mulai dari tidak minum teh manis dahulu.'
  ];
  return tips[dayIndex] || tips[0];
}

// ============================================================
// 12. QUIZ CALCULATOR
// ============================================================

/**
 * Hitung hasil kuis berdasarkan jawaban
 */
function calculateQuizResult(selectedAnswers) {
  if (!selectedAnswers || !Array.isArray(selectedAnswers) || selectedAnswers.length === 0) {
    return quizTypes[1]; // Default: Lemak Fighter
  }

  const scores = [0, 0, 0, 0, 0, 0, 0];
  
  selectedAnswers.forEach((ansIdx, qIdx) => {
    if (ansIdx === null || ansIdx === undefined) return;
    const question = quizQuestions[qIdx];
    if (!question || !question.options[ansIdx]) return;
    
    question.options[ansIdx].scores.forEach((val, tIdx) => {
      scores[tIdx] += val;
    });
  });

  const maxIdx = scores.indexOf(Math.max(...scores));
  return quizTypes[maxIdx] || quizTypes[1];
}

/**
 * Dapatkan trait data untuk tipe tertentu
 */
function getTraitData(typeId) {
  return traitDataByType[typeId] || traitDataByType[2];
}

// ============================================================
// 13. FOOD DATABASE HELPERS
// ============================================================

/**
 * Cari makanan berdasarkan kategori
 */
function getFoodsByCategory(category) {
  if (category === 'all') return cmFoodDatabase;
  return cmFoodDatabase.filter(f => f.category === category);
}

/**
 * Hitung kalori makanan berdasarkan jumlah
 */
function calculateFoodCalories(foodId, amount) {
  const food = cmFoodDatabase.find(f => f.id === foodId);
  if (!food || !amount) return 0;
  return Math.round(food.baseCal * amount / food.baseAmount);
}

/**
 * Dapatkan kategori makanan yang tersedia
 */
function getFoodCategories() {
  const categories = [...new Set(cmFoodDatabase.map(f => f.category))];
  return [
    { id: 'all', name: 'Semua' },
    ...categories.map(cat => ({
      id: cat,
      name: cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }))
  ];
}

// ============================================================
// 14. MENU HELPERS
// ============================================================

/**
 * Dapatkan menu berdasarkan kategori dan hari
 */
function getMenuByCategory(category, day) {
  const menus = menuLengkapData[category];
  if (!menus) return null;
  if (day) {
    return menus.find(m => m.day === day) || null;
  }
  return menus;
}

/**
 * Generate menu harian sederhana berdasarkan target kalori
 */
function generateSimpleMenu(targetCalories) {
  // Scale porsi berdasarkan target kalori
  const baseCalories = 1300;
  const ratio = targetCalories / baseCalories;
  
  return menuHarianData.map(item => ({
    ...item,
    cal: Math.round(item.cal * ratio),
    adjusted: ratio !== 1
  }));
}

// ============================================================
// 15. OLAHRAGA HELPERS
// ============================================================

/**
 * Dapatkan jadwal olahraga berdasarkan metode
 */
function getJadwalOlahraga(metode = 'standar') {
  return targetOlahragaData[metode] || targetOlahragaData.standar;
}

/**
 * Dapatkan aktivitas olahraga hari ini
 */
function getTodayOlahraga(metode = 'standar') {
  const jadwal = getJadwalOlahraga(metode);
  const dayIndex = new Date().getDay(); // 0 = Minggu, 1 = Senin, etc
  const mapIndex = [6, 0, 1, 2, 3, 4, 5]; // Map JS day to array index
  return jadwal[mapIndex[dayIndex]] || jadwal[0];
}

// ============================================================
// 16. MISSION HELPERS
// ============================================================

/**
 * Dapatkan misi berdasarkan mode
 */
function getMissions(mode = 'normal') {
  return missions[mode] || missions.normal;
}

/**
 * Generate mission ID untuk checkbox
 */
function getMissionCheckId(missionId) {
  return missionId.replace('n', 'nc').replace('i', 'ic');
}

// ============================================================
// 17. TIMELINE DATA
// ============================================================

const timelineData = [
  {
    phase: 1,
    title: "Fase 1: Detoksifikasi Awal",
    weeks: "Minggu 1–2",
    description: "Tubuh mulai beradaptasi dengan herbal KEMOENIK. Efek detoks: sering BAK, BAB lebih lancar, badan terasa lebih ringan. TETAP KONSISTEN!",
    icon: "🌿",
    color: "#2E7D5B"
  },
  {
    phase: 2,
    title: "Fase 2: Pembakaran Lemak",
    weeks: "Minggu 3–4",
    description: "Metabolisme mulai meningkat. Terasa lebih berenergi. Berat badan mulai turun konsisten. Lingkar perut mulai mengecil.",
    icon: "🔥",
    color: "#E07B39"
  },
  {
    phase: 3,
    title: "Fase 3: Stabilisasi",
    weeks: "Minggu 5–8",
    description: "Tubuh semakin efisien membakar lemak. Nafsu makan lebih terkontrol. Tubuh mulai terbentuk. Evaluasi & maintain program.",
    icon: "⚖️",
    color: "#7C3AED"
  },
  {
    phase: 4,
    title: "Fase 4: Target Tercapai",
    weeks: "🎯",
    description: "Berat badan ideal tercapai! Lanjutkan pola makan sehat dan aktivitas rutin agar tidak yo-yo. KEMOENIK bisa dilanjutkan 1x/hari untuk maintenance.",
    icon: "🏆",
    color: "#C9A86A"
  }
];

// ============================================================
// 18. TIPS DIET DATA
// ============================================================

const tipsDietData = {
  defisit: {
    title: "Defisit Kalori",
    subtitle: "Cara defisit kalori yang benar & efektif",
    icon: "🎯",
    color: "#DC2626",
    content: {
      pengertian: "Defisit kalori berarti kalori yang masuk lebih sedikit dari kalori yang dibakar tubuh.",
      metode: [
        { name: "Ringan", deficit: 300, loss: "~0.3 kg/minggu", desc: "Cocok untuk yang baru mulai atau aktivitas tinggi. Lebih mudah dipertahankan jangka panjang.", class: "ringan" },
        { name: "Standar", deficit: 500, loss: "~0.5 kg/minggu", desc: "Pilihan paling seimbang. Tidak terlalu berat, hasil tetap terlihat nyata.", class: "standar" },
        { name: "Agresif", deficit: 700, loss: "~0.7–1 kg/minggu", desc: "Untuk hasil lebih cepat. Perlu disiplin tinggi & olahraga rutin agar tidak lemas.", class: "agresif" }
      ],
      tips: [
        "Ganti nasi putih → nasi merah atau ubi",
        "Kurangi porsi nasi jadi ½ centong",
        "Ganti gorengan → panggang/rebus/kukus",
        "Hindari minuman manis — ganti air putih",
        "Makan sayur dulu sebelum nasi & lauk",
        "Minum KEMOENIK sesudah makan untuk bantu metabolisme"
      ]
    }
  },
  gula: {
    title: "Panduan Kurangi Gula",
    subtitle: "Musuh terbesar diet yang sering terlewat",
    icon: "🚫",
    color: "#C07E10",
    content: {
      batasan: "WHO merekomendasikan maksimal 25 gram gula tambahan per hari (6 sendok teh).",
      hindari: ["Teh manis", "Es kopi susu", "Minuman boba", "Jus buah kemasan", "Biskuit & kue", "Permen & coklat"],
      gantiDengan: ["Air putih hangat", "Teh tanpa gula", "Kopi tanpa gula", "Infused water", "Buah segar", "Dark chocolate"],
      strategi: [
        "Minta minuman tanpa gula / less sugar",
        "Cek label makanan — perhatikan 'total sugars'",
        "Ganti camilan manis dengan buah segar",
        "Hindari makan manis setelah jam 7 malam",
        "Kalau ngidam manis, minum air putih dulu"
      ]
    }
  },
  olahraga: {
    title: "Panduan Olahraga",
    subtitle: "Olahraga yang direkomendasikan untuk diet",
    icon: "🏃",
    color: "#1D4ED8",
    content: {
      rekomendasi: [
        { name: "Latihan Lymphatic", desc: "Pernapasan diafragma, shoulder rolls, neck rolls" },
        { name: "Jalan Kaki Cepat", desc: "30–45 menit/hari — bakar 150–200 kkal/30 menit" }
      ],
      jenis: [
        { name: "Jalan Kaki Cepat", durasi: "30–45 menit", kalori: "150–200 kkal", level: "Pemula" },
        { name: "Jumping Jack", durasi: "3–5 set × 20–30 rep", kalori: "8–10 kkal/menit", level: "Sedang" },
        { name: "Lompat Tali", durasi: "10–15 menit", kalori: "200–300 kkal", level: "Sedang-Tinggi" }
      ],
      jadwalMingguan: [
        { hari: "Sen", aktivitas: "Jalan kaki 30 menit + Lymphatic 10 menit" },
        { hari: "Sel", aktivitas: "Jumping jack 3 set + Jalan kaki 20 menit" },
        { hari: "Rab", aktivitas: "Istirahat aktif — jalan santai 15 menit" },
        { hari: "Kam", aktivitas: "Lompat tali 15 menit + Lymphatic 10 menit" },
        { hari: "Jum", aktivitas: "Jalan kaki 45 menit" },
        { hari: "Sab", aktivitas: "Jumping jack + Lompat tali 20 menit" },
        { hari: "Min", aktivitas: "Istirahat total — Lymphatic sebelum tidur" }
      ]
    }
  },
  minum: {
    title: "Cara Minum KEMOENIK",
    subtitle: "Jadwal & aturan konsumsi optimal",
    icon: "🌿",
    color: "#2E8B35",
    content: {
      aturan: "Minum KEMOENIK sesudah makan untuk penyerapan optimal. Konsumsi rutin 1–2x sehari untuk hasil terbaik.",
      jadwal: [
        { waktu: "07:00 – 08:00", nama: "Pagi", dosis: "3 kapsul sesudah sarapan + air hangat", fungsi: "Aktivasi metabolisme sepanjang hari" },
        { waktu: "18:00 – 19:00", nama: "Malam", dosis: "3 kapsul sesudah makan malam + air putih", fungsi: "Bantu cerna & kerja optimal saat tidur" }
      ],
      alternatif: "Bisa juga 3x2 kapsul (Pagi, Siang, Malam) sesudah makan. Total 6 kapsul/hari.",
      peringatan: "Jangan minum saat perut kosong. Konsumsi rutin setiap hari untuk hasil maksimal."
    }
  },
  if: {
    title: "Opsi: Intermittent Fasting",
    subtitle: "Tidak wajib, tapi bisa percepat hasil",
    icon: "⏰",
    color: "#7C3AED",
    content: {
      pengertian: "IF adalah pola makan di mana kamu membatasi waktu makan dalam jendela tertentu.",
      metode: [
        { name: "16:8", puasa: "16 jam", makan: "8 jam", desc: "Paling populer & mudah dijalankan" },
        { name: "18:6", puasa: "18 jam", makan: "6 jam", desc: "Lebih intens, hasil lebih cepat" },
        { name: "5:2", puasa: "2 hari", makan: "5 hari normal", desc: "Puasa parsial 2 hari seminggu" }
      ],
      peringatan: "Tidak dianjurkan untuk ibu hamil, menyusui, atau penderita diabetes"
    }
  }
};

// ============================================================
// 19. EXPORT / MODULE PATTERN
// ============================================================

// Untuk ES6 module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Data
    quizQuestions,
    quizTypes,
    faqData,
    menuHarianData,
    menuLengkapData,
    missions,
    traitDataByType,
    targetOlahragaData,
    cmFoodDatabase,
    timelineData,
    tipsDietData,
    APP_CONFIG,
    
    // Functions
    escHtml,
    formatNumber,
    formatDate,
    calculateBMI,
    calculateBMR,
    calculateTDEE,
    calculateDietCalories,
    calculateTargetWeeks,
    calculateTargetDate,
    calculateEstLingkar,
    normalizeWA,
    getTodayISO,
    getHariName,
    getDailyTip,
    calculateQuizResult,
    getTraitData,
    getFoodsByCategory,
    calculateFoodCalories,
    getFoodCategories,
    getMenuByCategory,
    generateSimpleMenu,
    getJadwalOlahraga,
    getTodayOlahraga,
    getMissions,
    getMissionCheckId
  };
}

// Untuk browser global
if (typeof window !== 'undefined') {
  window.KemoenikData = {
    // Data
    quizQuestions,
    quizTypes,
    faqData,
    menuHarianData,
    menuLengkapData,
    missions,
    traitDataByType,
    targetOlahragaData,
    cmFoodDatabase,
    timelineData,
    tipsDietData,
    APP_CONFIG,
    
    // Functions
    escHtml,
    formatNumber,
    formatDate,
    calculateBMI,
    calculateBMR,
    calculateTDEE,
    calculateDietCalories,
    calculateTargetWeeks,
    calculateTargetDate,
    calculateEstLingkar,
    normalizeWA,
    getTodayISO,
    getHariName,
    getDailyTip,
    calculateQuizResult,
    getTraitData,
    getFoodsByCategory,
    calculateFoodCalories,
    getFoodCategories,
    getMenuByCategory,
    generateSimpleMenu,
    getJadwalOlahraga,
    getTodayOlahraga,
    getMissions,
    getMissionCheckId
  };
}
