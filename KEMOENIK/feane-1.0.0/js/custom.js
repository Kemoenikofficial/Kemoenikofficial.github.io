// Tahun footer
document.querySelectorAll("#displayYear").forEach(function(el){
  el.innerHTML = new Date().getFullYear();
});

// Isotope
$(window).on('load', function(){
  if($('.grid').length){
    $('.filters_menu li[data-filter]').click(function(){
      $('.filters_menu li').removeClass('active');
      $(this).addClass('active');
      $grid.isotope({filter:$(this).attr('data-filter')});
    });
    var $grid=$(".grid").isotope({itemSelector:".all",percentPosition:false,masonry:{columnWidth:".all"}});
  }
});

$(document).ready(function(){
  if($('select').length) $('select').niceSelect();
});

// EDIT: ganti koordinat lat/lng lokasi kamu
function myMap(){
  var lat=-6.8566; // EDIT: latitude
  var lng=107.9317; // EDIT: longitude
  var map=new google.maps.Map(document.getElementById("googleMap"),{
    center:new google.maps.LatLng(lat,lng),zoom:16,
    styles:[
      {featureType:"landscape",elementType:"geometry",stylers:[{color:"#f5f5f2"}]},
      {featureType:"water",elementType:"geometry",stylers:[{color:"#e9e9e9"}]}
    ]
  });
  var marker=new google.maps.Marker({
    position:new google.maps.LatLng(lat,lng),map:map,
    title:"Kemoenik Official Store", // EDIT: nama marker
    icon:{path:google.maps.SymbolPath.CIRCLE,scale:10,fillColor:"#1F4D3A",fillOpacity:1,strokeColor:"#C8A96A",strokeWeight:3}
  });
  var info=new google.maps.InfoWindow({
    content:'<div style="font-family:Inter,sans-serif;padding:6px;"><strong style="color:#1F4D3A;">Kemoenik Official Store</strong><br><span style="font-size:12px;color:#666;">Sumedang, Jawa Barat</span></div>' // EDIT: nama & alamat
  });
  marker.addListener('click',function(){info.open(map,marker);});
  info.open(map,marker);
}
