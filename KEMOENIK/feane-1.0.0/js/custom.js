// Tahun otomatis di footer
function getYear() {
  var currentDate = new Date();
  document.querySelector("#displayYear").innerHTML = currentDate.getFullYear();
}
getYear();

// Isotope filter produk
$(window).on('load', function () {
  $('.filters_menu li').click(function () {
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
$(document).ready(function () {
  $('select').niceSelect();
});

// =============================================
// EDIT: Google Maps — ganti koordinat lokasi kamu
// Cara cari: buka maps.google.com → klik lokasi → lihat angka di URL
// =============================================
function myMap() {
  var mapProp = {
    // EDIT: ganti -6.8566 (lat) dan 107.9317 (lng) dengan koordinat lokasimu
    center: new google.maps.LatLng(-6.8566, 107.9317),
    zoom: 16,
  };
  var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

  // EDIT: ganti koordinat marker sesuai lokasi kamu
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(-6.8566, 107.9317),
    map: map,
    // EDIT: ganti title marker
    title: "Kemoenik Official Store"
  });
}

// Owl Carousel testimoni
$(".client_owl-carousel").owlCarousel({
  loop: true,
  margin: 0,
  dots: false,
  nav: true,
  autoplay: true,
  autoplayHoverPause: true,
  navText: [
    '<i class="fa fa-angle-left" aria-hidden="true"></i>',
    '<i class="fa fa-angle-right" aria-hidden="true"></i>'
  ],
  responsive: {
    0: { items: 1 },
    768: { items: 2 },
    1000: { items: 2 }
  }
});
