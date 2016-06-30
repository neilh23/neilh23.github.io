$(document).ready(function() {
  $('.nvtxt').hide();
  var nstate = 0;
  $('.nav-el').hover(function() {
    var t = $(this).children('a').children('.nvtxt');
    t.stop();
    if (t['nstate'] == 1) return;
    t['nstate'] = 1;
      
    t.fadeIn();
  }, function() {
    var t = $(this).children('a').children('.nvtxt');
    t.stop();
    if (t['nstate'] == 0) return;
    t['nstate'] = 0;
      
    t.fadeOut();
  });
  
  $('.fa').onmouseover(function() {
    $(this).addClass("animated shake");
  });

  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});