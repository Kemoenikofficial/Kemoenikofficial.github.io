// =============================================
// CUSTOM JS - Kemoenik Official Store
// =============================================

// Otomatis isi tahun di footer
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}
getYear();


// Isotope filter produk
$(window).on('load', function () {
    $('.filters_menu li').click(function () {
        $('.filters_menu li').removeClass('active');
        $(this).addClass('active');

        var data = $(this).attr('data-filter');
        $grid.isotope({
            filter: data
        })
    });

    var $grid = $(".grid").isotope({
        itemSelector: ".all",
        percentPosition: false,
        masonry: {
            columnWidth: ".all"
        }
    })
});


// Nice select dropdown
$(document).ready(function() {
    $('select').niceSelect();
});


/** =============================================
 *  EDIT: Google Maps - Ganti koordinat lokasi kamu
 *  Cara cari koordinat: buka Google Maps, klik lokasi,
 *  lihat angka di URL: ?q=LAT,LNG
 * ============================================= **/
function myMap() {
    var mapProp = {
        // EDIT: ganti -6.200000 (lat) dan 106.816666 (lng) dengan koordinat lokasimu
        center: new google.maps.LatLng(-6.200000, 106.816666),
        zoom: 16,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}


// Owl Carousel - Testimoni pelanggan
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
