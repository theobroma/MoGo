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
  $('body').animate({
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

//Sticky navbar
(function($, undefined){

  var $navbar = $(".mynavbar"),
      y_pos = $navbar.offset().top,
      height = $navbar.height();

  $(document).scroll(function(){
    var scrollTop = $(this).scrollTop();

    if (scrollTop > y_pos + height+300){
      $navbar.addClass("mynavbar-fixed-top");
    } else if (scrollTop <= y_pos){
      $navbar.removeClass("mynavbar-fixed-top");
    }
  });

})(jQuery, undefined);

