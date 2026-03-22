// ============================================================
// KEMOENIK Store — custom.js
// Cart: localStorage | Checkout: WhatsApp otomatis
// ============================================================

// ── Tahun ──
function getYear() {
  var el = document.querySelector('#displayYear');
  if (el) el.innerHTML = new Date().getFullYear();
}
getYear();

// ── Format Rupiah ──
function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

// ── CART STATE ──
var cart = [];
try { cart = JSON.parse(localStorage.getItem('kemoenik_cart') || '[]'); } catch(e) { cart = []; }

function saveCart() {
  try { localStorage.setItem('kemoenik_cart', JSON.stringify(cart)); } catch(e) {}
}

// ── Add to Cart ──
function addToCart(product) {
  var existing = cart.find(function(i) { return i.id === product.id; });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img || '',
      everpro: product.everpro || '',
      qty: 1
    });
  }
  saveCart();
  renderCart();
  showToast('🛒 ' + product.name + ' ditambahkan ke keranjang!');
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

// ── Remove ──
function removeItem(id) {
  cart = cart.filter(function(i) { return i.id !== id; });
  saveCart();
  renderCart();
}

// ── Clear ──
function clearCart() {
  if (cart.length === 0) return;
  if (confirm('Kosongkan semua item di keranjang?')) {
    cart = [];
    saveCart();
    renderCart();
  }
}

// ── Render Cart ──
function renderCart() {
  var container = document.getElementById('cartItems');
  var badge     = document.getElementById('cartBadge');
  var totalEl   = document.getElementById('cartTotalPrice');
  var subEl     = document.getElementById('cartSubtotal');

  var totalQty   = cart.reduce(function(s,i) { return s + i.qty; }, 0);
  var totalPrice = cart.reduce(function(s,i) { return s + i.price * i.qty; }, 0);

  if (badge) {
    badge.textContent = totalQty;
    badge.classList.toggle('show', totalQty > 0);
  }
  if (totalEl) totalEl.textContent = formatRupiah(totalPrice);
  if (subEl)   subEl.textContent   = totalQty + ' produk';

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML =
      '<div class="cart-empty">' +
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
          '<div class="cart-item-price">' + formatRupiah(item.price) + '</div>' +
          '<div class="cart-item-qty">' +
            '<button class="qty-btn" onclick="updateQty(\'' + item.id + '\',-1)">−</button>' +
            '<span class="qty-val">' + item.qty + '</span>' +
            '<button class="qty-btn" onclick="updateQty(\'' + item.id + '\',1)">+</button>' +
          '</div>' +
        '</div>' +
        '<button class="cart-item-remove" onclick="removeItem(\'' + item.id + '\')" title="Hapus">✕</button>' +
      '</div>';
  });
  container.innerHTML = html;
}

// ── Checkout via WhatsApp ──
function checkoutWA() {
  if (cart.length === 0) {
    showToast('⚠️ Keranjang masih kosong!');
    return;
  }

  var total = cart.reduce(function(s,i) { return s + i.price * i.qty; }, 0);
  var lines = ['Halo, saya mau pesan produk KEMOENIK berikut:'];
  lines.push('');
  cart.forEach(function(item, idx) {
    lines.push((idx+1) + '. ' + item.name + ' x' + item.qty + ' = ' + formatRupiah(item.price * item.qty));
  });
  lines.push('');
  lines.push('*Total: ' + formatRupiah(total) + '*');
  lines.push('');
  lines.push('Mohon konfirmasi pesanan dan info pengiriman. Terima kasih! 🙏');

  var msg = encodeURIComponent(lines.join('\n'));
  var waUrl = 'https://wa.me/6281546450547?text=' + msg;
  window.open(waUrl, '_blank');
}

// ── Open/Close Cart ──
function openCart() {
  var sidebar = document.getElementById('cartSidebar');
  var overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  var sidebar = document.getElementById('cartSidebar');
  var overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
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
  if (typeof $ !== 'undefined') {
    $(window).on('load', function() {
      var $grid;
      if ($('.grid').length) {
        $grid = $('.grid').isotope({
          itemSelector: '.all',
          percentPosition: true,
          masonry: { columnWidth: '.all' }
        });
        $('.filters_menu li').on('click', function() {
          $('.filters_menu li').removeClass('active');
          $(this).addClass('active');
          var data = $(this).attr('data-filter');
          $grid.isotope({ filter: data });
        });
      }
    });

    // Nice select
    if ($.fn.niceSelect) $('select').niceSelect();

    // Owl carousel testimoni
    if ($('.client_owl-carousel').length && $.fn.owlCarousel) {
      $('.client_owl-carousel').owlCarousel({
        loop: true, margin: 20, dots: false, nav: true,
        autoplay: true, autoplayHoverPause: true,
        navText: [
          '<i class="fa fa-angle-left"></i>',
          '<i class="fa fa-angle-right"></i>'
        ],
        responsive: { 0: { items: 1 }, 768: { items: 2 } }
      });
    }
  }
});

// Google Map
function myMap() {
  if (typeof google === 'undefined') return;
  var mapProp = {
    center: new google.maps.LatLng(-6.854168, 107.921867),
    zoom: 15,
  };
  new google.maps.Map(document.getElementById('googleMap'), mapProp);
}
