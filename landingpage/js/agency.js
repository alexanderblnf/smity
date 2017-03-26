// Agency Theme JavaScript

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function(){ 
            $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    });

    // hide .navbar first
    $(".navbarTest").hide();

    // fade in .navbarTest
    $(function () {
        $(window).scroll(function () {
            // set distance user needs to scroll before we fadeIn navbarTest
            if ($(this).scrollTop() > 100) {
                $('.navbarTest').fadeIn();
            } else {
                $('.navbarTest').fadeOut();
            }
        });
    });

})(jQuery); // End of use strict
