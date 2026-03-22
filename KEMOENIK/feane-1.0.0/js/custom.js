// ============================================================
// KEMOENIK — custom.js
// Fitur: cart localStorage, toast, isotope, owl carousel
// ============================================================

// ── Tahun copyright ──
function getYear() {
  var currentDate = new Date();
  document.querySelector("#displayYear").innerHTML = currentDate.getFullYear();
}
getYear();

// ── Format Rupiah ──
function formatRupiah(num) {
  return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ── CART STATE ──
var cart = JSON.parse(localStorage.getItem('kemoenik_cart') || '[]');

function saveCart() {
  localStorage.setItem('kemoenik_cart', JSON.stringify(cart));
}

// ── Add to Cart ──
function addToCart(product) {
  var existing = cart.find(function(i) { return i.id === product.id; });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });
  }
  saveCart();
  renderCart();
  showToast('✅ ' + product.name + ' ditambahkan ke keranjang!');
}

// ── Update Qty ──
function updateQty(id, delta) {
  var item = cart.find(function(i) { return i.id === id; });
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(function(i) { return i.id !== id; });
  }
  saveCart();
  renderCart();
}

// ── Remove item ──
function removeItem(id) {
  cart = cart.filter(function(i) { return i.id !== id; });
  saveCart();
  renderCart();
}

// ── Clear cart ──
function clearCart() {
  if (cart.length === 0) return;
  if (confirm('Kosongkan semua keranjang?')) {
    cart = [];
    saveCart();
    renderCart();
  }
}

// ── Render Cart ──
function renderCart() {
  var container = document.getElementById('cartItems');
  var empty     = document.getElementById('cartEmpty');
  var badge     = document.getElementById('cartBadge');
  var totalEl   = document.getElementById('cartTotalPrice');

  if (!container) return;

  // Badge
  var totalQty = cart.reduce(function(s,i) { return s + i.qty; }, 0);
  if (badge) {
    badge.textContent = totalQty;
    badge.classList.toggle('show', totalQty > 0);
  }

  // Total
  var totalPrice = cart.reduce(function(s,i) { return s + i.price * i.qty; }, 0);
  if (totalEl) totalEl.textContent = formatRupiah(totalPrice);

  // Items
  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty"><i class="fa fa-shopping-cart"></i><p>Keranjang masih kosong</p></div>';
    return;
  }

  var html = '';
  cart.forEach(function(item) {
    html += '<div class="cart-item">';
    html +=   '<div class="cart-item-img">';
    if (item.img) {
      html += '<img src="' + item.img + '" alt="' + item.name + '" onerror="this.style.display=\'none\'">';
    }
    html +=   '</div>';
    html +=   '<div class="cart-item-info">';
    html +=     '<div class="cart-item-name">' + item.name + '</div>';
    html +=     '<div class="cart-item-price">' + formatRupiah(item.price) + '</div>';
    html +=     '<div class="cart-item-qty">';
    html +=       '<button class="qty-btn" onclick="updateQty(\'' + item.id + '\',-1)">−</button>';
    html +=       '<span class="qty-val">' + item.qty + '</span>';
    html +=       '<button class="qty-btn" onclick="updateQty(\'' + item.id + '\',1)">+</button>';
    html +=     '</div>';
    html +=   '</div>';
    html +=   '<button class="cart-item-remove" onclick="removeItem(\'' + item.id + '\')" title="Hapus">✕</button>';
    html += '</div>';
  });
  container.innerHTML = html;
}

// ── Open/Close Cart ──
function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Toast ──
function showToast(msg) {
  var toast = document.getElementById('kemoToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 2800);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', function() {
  renderCart();

  // Isotope filter
  $(window).on('load', function() {
    $('.filters_menu li').click(function() {
      $('.filters_menu li').removeClass('active');
      $(this).addClass('active');
      var data = $(this).attr('data-filter');
      $grid.isotope({ filter: data });
    });
    var $grid = $(".grid").isotope({
      itemSelector: ".all",
      percentPosition: false,
      masonry: { columnWidth: ".all" }
    });
  });

  // Nice select
  $('select').niceSelect();

  // Owl Carousel testimoni
  $(".client_owl-carousel").owlCarousel({
    loop: true, margin: 0, dots: false, nav: true,
    autoplay: true, autoplayHoverPause: true,
    navText: [
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ],
    responsive: { 0: { items:1 }, 768: { items:2 }, 1000: { items:2 } }
  });
});

// Google Map (untuk book.html)
function myMap() {
  var mapProp = {
    center: new google.maps.LatLng(-6.854168, 107.921867), // Sumedang, Jawa Barat
    zoom: 15,
  };
  new google.maps.Map(document.getElementById("googleMap"), mapProp);
}
