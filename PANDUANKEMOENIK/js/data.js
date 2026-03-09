/* ============================================================
   KEMOENIK APP v2.0 - data.js
   Static data, quiz logic, menu data
   ============================================================ */

// OLAHRAGA DATA
var targetOlahragaData = {
  ringan: [
    {hari:'Sen',aktivitas:'Jalan kaki 30 menit'},
    {hari:'Sel',aktivitas:'Lymphatic 15 menit'},
    {hari:'Rab',aktivitas:'Istirahat aktif — jalan santai'},
    {hari:'Kam',aktivitas:'Jalan kaki 30 menit'},
    {hari:'Jum',aktivitas:'Jumping jack 3 set'},
    {hari:'Sab',aktivitas:'Jalan kaki 45 menit'},
    {hari:'Min',aktivitas:'Istirahat total'}
  ],
  standar: [
    {hari:'Sen',aktivitas:'Jalan kaki 30 menit + Jumping jack 3 set'},
    {hari:'Sel',aktivitas:'Lompat tali 10 menit + Lymphatic 10 menit'},
    {hari:'Rab',aktivitas:'Jalan kaki 30 menit'},
    {hari:'Kam',aktivitas:'Jumping jack 4 set + Lompat tali 10 menit'},
    {hari:'Jum',aktivitas:'Jalan kaki 45 menit + Lymphatic 15 menit'},
    {hari:'Sab',aktivitas:'Lompat tali 15 menit + Jumping jack 3 set'},
    {hari:'Min',aktivitas:'Istirahat — Lymphatic sebelum tidur'}
  ],
  agresif: [
    {hari:'Sen',aktivitas:'Lompat tali 15 menit + Jalan kaki 30 menit'},
    {hari:'Sel',aktivitas:'Jumping jack 5 set + Lymphatic 15 menit'},
    {hari:'Rab',aktivitas:'Jalan kaki 45 menit + Lompat tali 10 menit'},
    {hari:'Kam',aktivitas:'Lompat tali 20 menit + Jumping jack 4 set'},
    {hari:'Jum',aktivitas:'Jalan kaki 60 menit'},
    {hari:'Sab',aktivitas:'Lompat tali 15 menit + Jumping jack 5 set + Lymphatic'},
    {hari:'Min',aktivitas:'Jalan kaki santai 30 menit — recovery'}
  ]
};

// FAQ DATA
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
  if (!container) return;
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

// QUIZ DATA
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
  {id:4,name:"Tipe Hemat Energi",tagline:"Metabolismemu bekerja lebih pelan dari rata-rata",emoji:"🐢",color:"#7C3AED",bg:"#F5F3FF",textColor:"#4C1D95",metode:"ringan",metodeName:"Ringan + Konsisten Jangka Panjang",skor:68,tips:["Jangan potong kalori drastis, kurangi perlahan","Defisit kecil (300 kkal) lebih efektif untuk tipe ini","Perbanyak aktivitas ringan: jalan kaki, naik tangga","Makan lebih sering dalam porsi kecil (5–6x sehari)","KEMOENIK membantu meningkatkan metabolisme secara alami"],hindari:"Diet ekstrem atau crash diet",anjuran:"Makanan tinggi serat, protein, dan air"},
  {id:5,name:"Tipe Mood & Lifestyle",tagline:"Gaya hidupmu sangat mempengaruhi berat badanmu",emoji:"🌙",color:"#D97706",bg:"#FFFBEB",textColor:"#78350F",metode:"ringan",metodeName:"Ringan + Kelola Stres & Tidur",skor:70,tips:["Prioritaskan tidur 7–8 jam per malam","Kelola stres dengan meditasi atau olahraga ringan","Hindari makan larut malam saat stres","Buat rutinitas makan yang teratur setiap hari","KEMOENIK membantu keseimbangan hormonal secara alami"],hindari:"Begadang, makan emosional, kafein berlebih",anjuran:"Pisang, dark chocolate, teh herbal"},
  {id:6,name:"Tipe Perut Sensitif",tagline:"Sistem pencernaanmu butuh perhatian ekstra",emoji:"🌿",color:"#059669",bg:"#ECFDF5",textColor:"#064E3B",metode:"standar",metodeName:"Standar + Anti Inflamasi",skor:75,tips:["Hindari makanan pemicu: susu, gluten, gorengan","Perbanyak probiotik: yogurt, tempe, kimchi","Makan perlahan dan kunyah hingga halus","Hindari makan terburu-buru atau sambil stres","KEMOENIK dengan herbal alami bantu sehatkan pencernaan"],hindari:"Susu, gorengan, makanan pedas berlebih, gluten",anjuran:"Yogurt, tempe, sayuran rebus, buah non-asam"},
  {id:7,name:"Tipe Seimbang",tagline:"Tubuhmu sudah baik, kuncinya konsistensi!",emoji:"⚖️",color:"#2D5A3D",bg:"#F0FDF4",textColor:"#14532D",metode:"standar",metodeName:"Standar + Konsistensi",skor:88,tips:["Tubuhmu merespons baik terhadap diet seimbang","Tetap pada defisit kalori yang konsisten setiap hari","Variasikan menu agar tidak bosan","Olahraga kombinasi kardio + kekuatan 3–4x seminggu","KEMOENIK sebagai pendamping untuk hasil lebih optimal"],hindari:"Inkonsistensi dan cheat meal berlebihan",anjuran:"Semua makanan bergizi dalam porsi seimbang"}
];

// MENU HARIAN DATA
var menuHarianData = [
  { time:'07:00', label:'Sarapan', menu:'2 Telur Rebus + 1 Pisang / Ubi', cal:220, icon:'🍳' },
  { time:'10:00', label:'Snack Pagi', menu:'Buah segar (jeruk/pepaya) + kacang', cal:120, icon:'🍊' },
  { time:'12:00', label:'Makan Siang', menu:'Nasi ½ porsi + Lauk protein + Sayuran', cal:450, icon:'🍱' },
  { time:'15:00', label:'Snack Sore', menu:'Pisang / Singkong rebus / Yogurt', cal:130, icon:'🍌' },
  { time:'18:00', label:'Makan Malam', menu:'Ikan/Ayam bakar + Sayuran + Sedikit nasi', cal:380, icon:'🍽️' }
];

// CUSTOM MENU DATABASE
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
