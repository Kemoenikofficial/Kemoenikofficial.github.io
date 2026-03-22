// ============================================================
// KEMOENIK Official Store — custom.js
// Cart: localStorage | Checkout: WhatsApp otomatis
// ============================================================

// ── Tahun copyright ──
function getYear() {
  var el = document.getElementById('displayYear');
  if (el) el.textContent = new Date().getFullYear();
}
getYear();

// ── Format Rupiah ──
function formatRp(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

// ── CART STATE ──
var cart = [];
try { cart = JSON.parse(localStorage.getItem('kemoenik_cart') || '[]'); } catch(e) { cart = []; }

function saveCart() {
  try { localStorage.setItem('kemoenik_cart', JSON.stringify(cart)); } catch(e) {}
}

// ── Add to Cart ──
function addToCart(p) {
  var item = cart.find(function(i){ return i.id === p.id; });
  if (item) { item.qty += 1; }
  else { cart.push({ id: p.id, name: p.name, price: p.price, img: p.img || '', qty: 1 }); }
  saveCart();
  renderCart();
  showToast('🛒 ' + p.name + ' ditambahkan!');
}

// ── Update Qty ──
function updateQty(id, delta) {
  var item = cart.find(function(i){ return i.id === id; });
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(function(i){ return i.id !== id; });
  saveCart();
  renderCart();
}

// ── Remove item ──
function removeItem(id) {
  cart = cart.filter(function(i){ return i.id !== id; });
  saveCart();
  renderCart();
}

// ── Clear cart ──
function clearCart() {
  if (!cart.length) return;
  if (confirm('Kosongkan semua item di keranjang?')) {
    cart = [];
    saveCart();
    renderCart();
  }
}

// ── Render Cart ──
function renderCart() {
  var container  = document.getElementById('cartItems');
  var badge      = document.getElementById('cartBadge');
  var totalEl    = document.getElementById('cartTotalPrice');
  var subtotalEl = document.getElementById('cartSubtotal');

  var totalQty   = cart.reduce(function(s,i){ return s + i.qty; }, 0);
  var totalPrice = cart.reduce(function(s,i){ return s + i.price * i.qty; }, 0);

  // Badge
  if (badge) {
    badge.textContent = totalQty;
    badge.classList.toggle('show', totalQty > 0);
  }
  if (totalEl)    totalEl.textContent    = formatRp(totalPrice);
  if (subtotalEl) subtotalEl.textContent = totalQty + ' produk';

  if (!container) return;

  if (!cart.length) {
    container.innerHTML =
      '<div class="cart-empty-state">' +
        '<i class="fa fa-shopping-cart"></i>' +
        '<p>Keranjang masih kosong</p>' +
      '</div>';
    return;
  }

  var html = '';
  cart.forEach(function(item) {
    html +=
      '<div class="cart-item">' +
        '<div class="cart-item-img">' +
          (item.img ? '<img src="' + item.img + '" alt="' + item.name + '" onerror="this.style.display=\'none\'">' : '') +
        '</div>' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + item.name + '</div>' +
          '<div class="cart-item-price">' + formatRp(item.price) + '</div>' +
          '<div class="cart-item-qty">' +
            '<button class="qty-btn" onclick="updateQty(\'' + item.id + '\',-1)">−</button>' +
            '<span class="qty-val">' + item.qty + '</span>' +
            '<button class="qty-btn" onclick="updateQty(\'' + item.id + '\',1)">+</button>' +
          '</div>' +
        '</div>' +
        '<button class="cart-item-remove" onclick="removeItem(\'' + item.id + '\')">✕</button>' +
      '</div>';
  });
  container.innerHTML = html;
}

// ── Checkout via WhatsApp ──
function checkoutWA() {
  if (!cart.length) { showToast('⚠️ Keranjang masih kosong!'); return; }
  var total = cart.reduce(function(s,i){ return s + i.price * i.qty; }, 0);
  var lines = ['Halo, saya mau pesan produk KEMOENIK:\n'];
  cart.forEach(function(item, idx) {
    lines.push((idx+1) + '. ' + item.name + ' x' + item.qty + ' = ' + formatRp(item.price * item.qty));
  });
  lines.push('\n*Total: ' + formatRp(total) + '*');
  lines.push('\nMohon konfirmasi & info pengiriman. Terima kasih 🙏');
  window.open('https://wa.me/6281546450547?text=' + encodeURIComponent(lines.join('\n')), '_blank');
}

// ── Open/Close Cart ──
function openCart() {
  var s = document.getElementById('cartSidebar');
  var o = document.getElementById('cartOverlay');
  if (s) s.classList.add('open');
  if (o) o.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  var s = document.getElementById('cartSidebar');
  var o = document.getElementById('cartOverlay');
  if (s) s.classList.remove('open');
  if (o) o.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Toast ──
function showToast(msg) {
  var t = document.getElementById('kemoToast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 2800);
}

// ── DOMContentLoaded ──
document.addEventListener('DOMContentLoaded', function() {
  renderCart();

  // Filter katalog
  var pills = document.querySelectorAll('.filters_menu li');
  var cols  = document.querySelectorAll('#productGrid .product-col');
  if (pills.length && cols.length) {
    pills.forEach(function(pill) {
      pill.addEventListener('click', function() {
        pills.forEach(function(p){ p.classList.remove('active'); });
        this.classList.add('active');
        var f = this.getAttribute('data-filter');
        cols.forEach(function(c) {
          c.style.display = (f === '*' || c.classList.contains(f.replace('.',''))) ? '' : 'none';
        });
      });
    });
  }

  // Owl Carousel testimoni
  if (typeof $ !== 'undefined' && $.fn.owlCarousel) {
    $('.client_owl-carousel').owlCarousel({
      loop: true, margin: 20, dots: false, nav: true,
      autoplay: true, autoplayHoverPause: true,
      navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
      responsive: { 0: { items: 1 }, 768: { items: 2 } }
    });
  }

  // Nice select
  if (typeof $ !== 'undefined' && $.fn.niceSelect) {
    $('select').niceSelect();
  }
});

// Google Map
function myMap() {
  if (typeof google === 'undefined') return;
  new google.maps.Map(document.getElementById('googleMap'), {
    center: new google.maps.LatLng(-6.854168, 107.921867),
    zoom: 15
  });
}
