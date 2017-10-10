//cash
var $page = $('html, body');
//burger menu
$(".burger-menu").click(function () {
  $(this).toggleClass("menu-on");
  $(".mynavbar-collapse").fadeToggle("in");
});

//smooth parallax
$(document).scroll(function () {

  var $movebg = $(window).scrollTop() * -0.5;
  $('.portion').css('background-positionY', ($movebg) + 'px');
});

//scroll toTop
$('#toTop').click(function () {
  $page.animate({
    scrollTop: 0
  }, 1000);
  return false;
});

$(window).scroll(function(){                              // отслеживаем событие
   if ( $(window).scrollTop() <= 200 ){                   // ставим условие
      $('#toTop').css('opacity','0').css('bottom','-50px');            // определяем действие
   }
    if ( $(window).scrollTop() >= 200 ){
      $('#toTop').css('opacity','0.7').css('bottom','30px');
   }
});


//Waypoint navbar
var $navLi = $('.mynavbar li');

$('.tracked').waypoint(function(direction) {
  var hash = $(this)[0].element.id;
  $navLi.removeClass('active');
  $.each($navLi,function() {
    if ( $(this).children('a').attr('href').slice(1) == hash ){
      $(this).addClass('active');
    }
  });
},{
  offset: '30%'
});

//smooth scrolling
$('a[href*="#"]').click(function() {
  var href = $.attr(this, 'href');
  $page.animate({
      scrollTop: $(href).offset().top
  }, 400, function () {
      window.location.hash = href;
  });
  return false;
});

//modal
$( '#open-map-btn' ).click(function(event) {
  event.preventDefault();
  $('body').addClass('modal-open').css('padding-right','17px')
  .append( '<div class="modal-backdrop fade in"></div>' );
  $('.modal').addClass('in').css('display','block');
});


$( '.modal-close-btn' ).click(function(event) {
  event.preventDefault();
  $('body').removeClass('modal-open').css('padding-right','0');
  $( '.modal-backdrop' ).remove();
  $('.modal').removeClass('in').css('display','none');
});

//slider1
$('#slider1').slick({
  nextArrow: '<i class="fa fa-chevron-right custom-slick-next slick-arrow"></i>',
  prevArrow: '<i class="fa fa-chevron-left custom-slick-prev slick-arrow"></i>',
  infinite: true,
  autoplay: true
});

