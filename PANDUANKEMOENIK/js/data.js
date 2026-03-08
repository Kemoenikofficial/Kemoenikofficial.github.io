// ===== DATA PLACEHOLDER =====
// Isi dengan data dari file besar utama

const KEMOENIK_DATA = {
  // User profile
  user: {
    name: "Sarah Amanda",
    metabolismType: "Lemak Fighter",
    metabolismEmoji: "🔥",
    dailyCalories: 1450,
    targetLoss: 5,
    dietMethod: "Agresif",
    methodDetail: "Agresif + IF 16:8"
  },
  
  // Progress
  progress: {
    currentDay: 12,
    totalDays: 28,
    startWeight: 68.0,
    currentWeight: 65.6,
    targetWeight: 63.0,
    totalLost: 2.4,
    weeklyLost: 0.8,
    bmi: 24.2,
    waist: 78
  },
  
  // Missions
  missions: [
    { id: 1, name: "Minum air hangat", time: "07:00", done: true },
    { id: 2, name: "Olahraga pagi 30 menit", time: "06:30", done: true },
    { id: 3, name: "KEMOENIK pagi", time: "08:00", done: true },
    { id: 4, name: "Lymphatic drainage", time: "16:00", done: false },
    { id: 5, name: "KEMOENIK malam", time: "19:00", done: false }
  ],
  
  // Workout schedule
  workout: {
    today: {
      name: "Jalan Cepat + Jumping Jack",
      duration: "30 menit",
      calories: 150
    }
  },
  
  // Tips content (full content dari file utama)
  tips: {
    deficitKalori: {
      title: "Defisit Kalori",
      content: "..."
    },
    kurangiGula: {
      title: "Panduan Kurangi Gula",
      content: "..."
    },
    olahraga: {
      title: "Panduan Olahraga",
      content: "..."
    },
    minumKemoenik: {
      title: "Cara Minum KEMOENIK",
      content: "..."
    },
    intermittentFasting: {
      title: "Intermittent Fasting",
      content: "..."
    }
  },
  
  // Quiz data
  quiz: {
    questions: [], // Isi dari file utama
    types: []      // Isi dari file utama
  }
};

// Export
window.KEMOENIK_DATA = KEMOENIK_DATA;
