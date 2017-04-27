//burger menu
$(".burger-menu").click(function () {
  $(this).toggleClass("menu-on");
  $(".mynavbar-collapse").fadeToggle("in");
});

//smooth parallax
$(document).scroll(function () {

  var $movebg = $(window).scrollTop() * -0.3;
  $('.portion').css('background-positionY', ($movebg) + 'px');
});

