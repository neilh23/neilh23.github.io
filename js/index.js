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

  $(window).scroll(function() {
 
    if ($(document).scrollTop() > 100) {
      $('#penguin').removeClass('penguin');
      $('#surname').addClass('surname-float');
      $('#forename').addClass('forename-float');
      $('#penguin').addClass('penguin-float');
      $('header').addClass('header-float');
      $('#about').addClass('about-float');
      $('#totop').show();
    } else {
      $('header').removeClass('header-float');
      $('#surname').removeClass('surname-float');
      $('#forename').removeClass('forename-float');
      $('#penguin').removeClass('penguin-float');
      $('#about').removeClass('about-float');
      $('#penguin').addClass('penguin');
      $('#totop').hide();
    }
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