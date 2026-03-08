// ===== QUIZ DATA =====
const quizQuestions=[
  {text:"Ketika makan nasi porsi besar, apa yang dirasakan?",options:[
    {emoji:"😴",text:"Mengantuk lemas",scores:[3,0,0,1,0,0,0]},
    {emoji:"😐",text:"Biasa saja",scores:[0,0,0,0,0,0,3]},
    {emoji:"😤",text:"Perut kembung",scores:[0,0,0,0,0,3,0]},
    {emoji:"⚡",text:"Lebih berenergi",scores:[0,1,2,0,0,0,1]}
  ]},
  {text:"Kondisi BB dalam 6 bulan terakhir?",options:[
    {emoji:"📈",text:"Naik terus",scores:[2,2,0,1,1,0,0]},
    {emoji:"🔄",text:"Naik turun",scores:[1,1,0,0,2,0,1]},
    {emoji:"➡️",text:"Stagnan",scores:[1,2,0,2,0,0,0]},
    {emoji:"📉",text:"Bisa turun",scores:[0,0,1,0,0,0,3]}
  ]},
  {text:"Lemak paling banyak menumpuk di?",options:[
    {emoji:"🍎",text:"Perut",scores:[2,2,0,1,0,0,0]},
    {emoji:"🍐",text:"Pinggul/paha",scores:[1,1,0,1,1,0,0]},
    {emoji:"📏",text:"Merata",scores:[0,1,0,2,0,0,1]},
    {emoji:"💪",text:"Sedikit lemak",scores:[0,0,3,0,0,0,0]}
  ]},
  {text:"Nafsu makan sehari-hari?",options:[
    {emoji:"🐘",text:"Selalu lapar",scores:[1,2,0,1,1,0,0]},
    {emoji:"⏰",text:"Jam tertentu",scores:[0,0,0,0,0,0,3]},
    {emoji:"😐",text:"Normal",scores:[0,1,1,0,0,1,1]},
    {emoji:"😤",text:"Sering ngidam",scores:[2,0,0,0,2,0,0]}
  ]},
  {text:"Setelah makan manis?",options:[
    {emoji:"📈",text:"Gula naik lalu drop",scores:[3,0,0,0,0,1,0]},
    {emoji:"😴",text:"Mengantuk",scores:[1,1,0,2,0,0,0]},
    {emoji:"⚡",text:"Energi lama",scores:[0,0,1,0,0,0,3]},
    {emoji:"🤢",text:"Tidak nyaman",scores:[0,0,0,0,0,3,0]}
  ]},
  {text:"Kualitas tidur?",options:[
    {emoji:"😴",text:"Susah tidur",scores:[0,0,0,0,3,0,0]},
    {emoji:"🌙",text:"Berkualitas",scores:[0,0,0,0,0,0,3]},
    {emoji:"⏰",text:"Tidur mepet",scores:[0,1,1,0,1,0,0]},
    {emoji:"💤",text:"Tidur lama tapi lelah",scores:[1,1,0,2,0,0,0]}
  ]},
  {text:"Kondisi perut sehari-hari?",options:[
    {emoji:"🎈",text:"Sering kembung",scores:[0,0,0,0,0,3,0]},
    {emoji:"😖",text:"Sembelit",scores:[0,0,0,0,0,3,0]},
    {emoji:"✅",text:"Lancar",scores:[0,0,0,0,0,0,3]},
    {emoji:"🔄",text:"Kadang bermasalah",scores:[0,0,0,0,1,1,1]}
  ]},
  {text:"Respons terhadap kardio?",options:[
    {emoji:"🔥",text:"Berkeringat tapi BB tak turun",scores:[1,3,0,0,0,0,0]},
    {emoji:"💪",text:"Berkeringat & BB turun",scores:[0,0,0,0,0,0,3]},
    {emoji:"😓",text:"Cepat lelah",scores:[0,0,0,3,0,0,0]},
    {emoji:"🏋️",text:"Lebih suka gym",scores:[0,0,3,0,0,0,0]}
  ]},
  {text:"Distribusi lemak?",options:[
    {emoji:"🍎",text:"Bentuk apel",scores:[2,2,0,1,0,0,0]},
    {emoji:"🍐",text:"Bentuk pir",scores:[1,1,0,1,1,0,0]},
    {emoji:"📏",text:"Merata",scores:[0,1,0,2,0,0,1]},
    {emoji:"💪",text:"Sedikit lemak",scores:[0,0,3,0,0,0,0]}
  ]},
  {text:"Setelah makan berlemak?",options:[
    {emoji:"🤢",text:"Mual",scores:[0,0,0,0,0,3,0]},
    {emoji:"😴",text:"Mengantuk",scores:[1,2,0,1,0,0,0]},
    {emoji:"✅",text:"Normal",scores:[0,0,1,0,0,0,3]},
    {emoji:"⚡",text:"Berenergi",scores:[0,1,1,0,0,0,1]}
  ]},
  {text:"Kondisi kulit?",options:[
    {emoji:"🔴",text:"Mudah berjerawat",scores:[1,0,0,0,1,2,0]},
    {emoji:"💧",text:"Kering kusam",scores:[0,1,0,2,0,1,0]},
    {emoji:"✨",text:"Normal",scores:[0,0,0,0,0,0,3]},
    {emoji:"🌊",text:"Berminyak",scores:[1,0,0,0,2,1,0]}
  ]},
  {text:"Saat skip makan?",options:[
    {emoji:"😡",text:"Pusing lemas marah",scores:[2,0,1,0,1,0,0]},
    {emoji:"💪",text:"Tidak masalah",scores:[0,2,0,0,0,0,2]},
    {emoji:"🎯",text:"Lebih fokus",scores:[0,3,0,0,0,0,1]},
    {emoji:"😐",text:"Biasa saja",scores:[0,1,0,1,0,0,2]}
  ]},
  {text:"Pola makan ideal?",options:[
    {emoji:"🥩",text:"Suka protein",scores:[0,0,3,0,0,0,0]},
    {emoji:"🥗",text:"Suka sayur",scores:[0,0,0,0,0,2,1]},
    {emoji:"🍱",text:"Porsi kecil",scores:[0,0,0,3,0,0,1]},
    {emoji:"⚖️",text:"Seimbang",scores:[0,0,0,0,0,0,3]}
  ]},
  {text:"Aktivitas fisik?",options:[
    {emoji:"🪑",text:"Kerja duduk",scores:[1,2,0,2,0,0,0]},
    {emoji:"🚶",text:"Kadang jalan",scores:[1,1,0,1,1,0,0]},
    {emoji:"🏃",text:"Olahraga 2-3x",scores:[0,0,1,0,0,0,2]},
    {emoji:"💪",text:"Olahraga intens",scores:[0,0,3,0,0,0,1]}
  ]},
  {text:"Pengalaman diet?",options:[
    {emoji:"😤",text:"Coba banyak tak berhasil",scores:[1,2,0,1,1,0,0]},
    {emoji:"🔄",text:"Yo-yo effect",scores:[2,1,0,0,1,0,0]},
    {emoji:"📈",text:"Belum perna serius",scores:[0,0,0,0,2,0,1]},
    {emoji:"✅",text:"Berhasil konsisten",scores:[0,0,0,0,0,0,3]}
  ]}
];

const quizTypes=[
  {id:1,name:"Nasi Warrior",tagline:"Tubuh bereaksi kuat terhadap karbo",emoji:"🍚",metode:"standar",metodeName:"Standar + Kurangi Karbo",skor:78,tips:["Batasi nasi 1 centong","Ganti nasi merah/ubi","Karbo pagi & siang saja","Perbanyak protein","KEMOENIK stabilkan gula"],hindari:"Nasi putih, roti putih",anjuran:"Nasi merah, ubi, oatmeal"},
  {id:2,name:"Lemak Fighter",tagline:"Butuh dorongan ekstra bakar lemak",emoji:"🔥",metode:"agresif",metodeName:"Agresif + IF 16:8",skor:72,tips:["IF 16:8","Makan jam 10-18","Fokus rendah lemak jenuh","Kardio 30 menit/hari","KEMOENIK saat buka puasa"],hindari:"Gorengan, santan",anjuran:"Dada ayam, ikan, tempe"},
  {id:3,name:"Otot Aktif",tagline:"Optimal dengan protein tinggi",emoji:"💪",metode:"standar",metodeName:"Standar + Tinggi Protein",skor:82,tips:["Protein 1.8-2.2g/kg","Protein tiap makan","Kardio + kekuatan","Protein 30 menit post workout","KEMOENIK bantu pemulihan"],hindari:"Diet kalori terlalu rendah",anjuran:"Telur, ayam, tempe, yogurt"},
  {id:4,name:"Hemat Energi",tagline:"Metabolisme lebih pelan",emoji:"🐢",metode:"ringan",metodeName:"Ringan + Konsisten",skor:68,tips:["Defisit kecil 300 kkal","Jangan drastis","Aktivitas ringan","Makan sering porsi kecil","KEMOENIK naikkan metabolisme"],hindari:"Crash diet",anjuran:"Serat tinggi, protein, air"},
  {id:5,name:"Mood & Lifestyle",tagline:"Gaya hidup mempengaruhi BB",emoji:"🌙",metode:"ringan",metodeName:"Ringan + Kelola Stres",skor:70,tips:["Tidur 7-8 jam","Kelola stres","Hindari makan larut","Rutinitas teratur","KEMOENIK keseimbangan hormonal"],hindari:"Begadang, makan emosional",anjuran:"Pisang, dark chocolate, teh herbal"},
  {id:6,name:"Perut Sensitif",tagline:"Pencernaan butuh perhatian",emoji:"🌿",metode:"standar",metodeName:"Standar + Anti Inflamasi",skor:75,tips:["Hindari pemicu: susu, gluten","Probiotik: yogurt, tempe","Makan perlahan","Hindari stres saat makan","KEMOENIK sehatkan pencernaan"],hindari:"Susu, gorengan, pedas",anjuran:"Yogurt, tempe, sayur rebus"},
  {id:7,name:"Seimbang",tagline:"Sudah baik, kuncinya konsistensi",emoji:"⚖️",metode:"standar",metodeName:"Standar + Konsisten",skor:88,tips:["Defisit konsisten","Variasi menu","Kardio + kekuatan 3-4x","KEMOENIK pendamping"],hindari:"Inkonsistensi",anjuran:"Semua bergizi seimbang"}
];

// ===== MENU DATA =====
const menuHarian=[
  {time:"07:00",label:"Sarapan",menu:"2 Telur Rebus + Pisang/Ubi",cal:220},
  {time:"10:00",label:"Snack",menu:"Buah + Kacang",cal:120},
  {time:"12:00",label:"Makan Siang",menu:"Nasi ½ + Protein + Sayur",cal:450},
  {time:"15:00",label:"Snack",menu:"Pisang/Yogurt",cal:130},
  {time:"18:00",label:"Makan Malam",menu:"Ikan/Ayam + Sayur + Sedikit Nasi",cal:380}
];

// ===== FAQ DATA =====
const faqData=[
  {cat:"Progres",items:[
    {q:"Kapan input berat badan?",a:"Setiap minggu akhir, pagi setelah bangun tidur & buang air kecil."},
    {q:"BB belum turun di grafik?",a:"Lemak turun = otot naik. Tetap konsisten!"}
  ]},
  {cat:"Konsumsi",items:[
    {q:"Waktu terbaik minum KEMOENIK?",a:"Sesudah makan."},
    {q:"Sering BAK?",a:"Efek normal Tempuyung (diuretik). Minum air 2-3 liter."}
  ]},
  {cat:"Teknis",items:[
    {q:"Boleh ganti menu?",a:"Boleh, asal defisit kalori terjaga."},
    {q:"Cheat day?",a:"Tidak apa, lanjutkan besok. Jangan sering!"}
  ]}
];

// ===== MISSION DATA =====
const missions=[
  {id:"m1",name:"Bangun & Minum Air",sub:"2 gelas air hangat",tag:"Pagi",icon:"💧"},
  {id:"m2",name:"Olahraga Pagi",sub:"Jalan kaki 30 menit",tag:"Aktif",icon:"🏃"},
  {id:"m3",name:"Minum KEMOENIK",sub:"3 kapsul sesudah sarapan",tag:"Herbal",icon:"🌿"},
  {id:"m4",name:"Lymphatic Drainage",sub:"Pijat 10-15 menit",tag:"Sore",icon:"💆"},
  {id:"m5",name:"KEMOENIK Malam",sub:"3 kapsul sesudah makan malam",tag:"Herbal",icon:"🌙"}
];
