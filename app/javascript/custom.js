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
