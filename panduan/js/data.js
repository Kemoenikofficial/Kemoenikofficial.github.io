// data.js – Semua konten panduan diet

const materi = {
    tips: [
        {
            id: 1,
            judul: "Defisit Kalori yang Benar",
            konten: "Defisit kalori berarti kalori masuk lebih sedikit dari kalori yang dibakar. Untuk hasil aman, kurangi 300–500 kkal dari kebutuhan harian. Kombinasikan dengan olahraga dan konsumsi KEMOENIK sesudah makan."
        },
        {
            id: 2,
            judul: "Kurangi Gula Bertahap",
            konten: "Batasi gula tambahan maksimal 25 gram per hari (6 sendok teh). Ganti minuman manis dengan air putih atau teh tanpa gula."
        },
        {
            id: 3,
            judul: "Olahraga Ideal",
            konten: "Lakukan kombinasi kardio (jalan cepat, jumping jack) dan latihan kekuatan. Minimal 30 menit per hari, 5 kali seminggu."
        },
        {
            id: 4,
            judul: "Cara Minum KEMOENIK",
            konten: "Minum 3 kapsul sesudah makan pagi dan 3 kapsul sesudah makan malam. Konsisten setiap hari untuk hasil maksimal."
        }
    ],
    program: [
        {
            judul: "Program 30 Hari",
            fase: [
                "Minggu 1-2: Detoksifikasi – Tubuh mulai beradaptasi, BAB lebih lancar.",
                "Minggu 3-4: Pembakaran Lemak – Berat mulai turun, lingkar perut mengecil.",
                "Minggu 5-8: Stabilisasi – Nafsu makan terkontrol, bentuk tubuh mulai terbentuk."
            ]
        },
        {
            judul: "Contoh Jadwal Makan (1500 kkal)",
            items: [
                "Sarapan: 2 telur rebus + 1 pisang",
                "Snack: Jeruk + kacang almond",
                "Makan siang: Nasi merah ½ porsi + dada ayam + sayur",
                "Snack sore: Yogurt plain",
                "Makan malam: Ikan bakar + tumis brokoli"
            ]
        }
    ],
    faq: [
        {
            pertanyaan: "Kapan hasil mulai terlihat?",
            jawaban: "Rata-rata pengguna mulai merasakan badan lebih ringan dalam 7-14 hari jika konsisten."
        },
        {
            pertanyaan: "Apakah boleh minum KEMOENIK saat haid?",
            jawaban: "Disarankan jeda di hari 1-3 haid untuk mengistirahatkan tubuh."
        },
        {
            pertanyaan: "Bagaimana kalau saya makan berlebih sehari?",
            jawaban: "Tidak masalah, lanjutkan program seperti biasa keesokan harinya. Jangan menyerah!"
        },
        {
            pertanyaan: "Apakah KEMOENIK aman untuk ibu menyusui?",
            jawaban: "Tidak dianjurkan untuk ibu hamil dan menyusui karena formula peluntur lemak."
        }
    ]
};

// Aktivitas checklist harian
const dailyActivities = [
    { id: 'act1', title: 'Minum air putih 2 gelas setelah bangun', desc: 'Hidrasi awal untuk metabolisme' },
    { id: 'act2', title: 'Olahraga pagi 30 menit', desc: 'Jalan kaki / jumping jack' },
    { id: 'act3', title: 'Minum KEMOENIK pagi', desc: '3 kapsul sesudah sarapan' },
    { id: 'act4', title: 'Makan siang dengan protein & sayur', desc: 'Kontrol porsi karbohidrat' },
    { id: 'act5', title: 'Minum KEMOENIK malam', desc: '3 kapsul sesudah makan malam' },
    { id: 'act6', title: 'Tidur 7-8 jam', desc: 'Pemulihan dan pembakaran lemak optimal' }
];
