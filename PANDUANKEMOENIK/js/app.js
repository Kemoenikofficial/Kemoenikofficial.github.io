// ===== NAVIGATION =====
function goToPage(pageId, navItem) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show target page
  document.getElementById('page-' + pageId).classList.add('active');
  
  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  if (navItem) {
    navItem.classList.add('active');
  } else {
    // Find nav item by page
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('onclick').includes(pageId)) {
        item.classList.add('active');
      }
    });
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== ACCORDION =====
function toggleAccordion(header) {
  const card = header.parentElement;
  const isOpen = card.classList.contains('open');
  
  // Close all accordions (optional - remove if want multiple open)
  // document.querySelectorAll('.accordion-card').forEach(c => c.classList.remove('open'));
  
  if (isOpen) {
    card.classList.remove('open');
  } else {
    card.classList.add('open');
  }
}

// ===== NOTIFICATION =====
function toggleNotif() {
  // Placeholder - implement notification panel
  alert('Notifikasi: 2 pengingat diet hari ini!');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  // Init chart placeholder (gunakan library seperti Chart.js di production)
  initCharts();
  
  // Check localStorage for user data
  const userData = localStorage.getItem('kemoenik_user');
  if (userData) {
    const user = JSON.parse(userData);
    updateUIFromData(user);
  }
});

function initCharts() {
  // Placeholder - implement with Chart.js or similar
  const canvas = document.getElementById('weightChart');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    // Draw simple line
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 80);
    ctx.lineTo(50, 70);
    ctx.lineTo(100, 60);
    ctx.lineTo(150, 55);
    ctx.lineTo(200, 50);
    ctx.stroke();
  }
}

function updateUIFromData(user) {
  // Update UI elements from localStorage data
  if (user.name) {
    document.querySelector('.greeting-name').textContent = user.name;
  }
}

// ===== LOCAL STORAGE HELPERS =====
const storage = {
  save: (key, data) => {
    localStorage.setItem('kemoenik_' + key, JSON.stringify(data));
  },
  
  load: (key, defaultValue = null) => {
    const data = localStorage.getItem('kemoenik_' + key);
    return data ? JSON.parse(data) : defaultValue;
  },
  
  remove: (key) => {
    localStorage.removeItem('kemoenik_' + key);
  }
};

// Export for global use
window.storage = storage;
window.goToPage = goToPage;
window.toggleAccordion = toggleAccordion;
