/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($) {
  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Sage = {
    // All pages
    'common': {
      init: function() {
        // JavaScript to be fired on all pages

        /* header class change on scrolling */
        var myElement = document.querySelector("header");
        var headroom  = new Headroom(myElement);
        headroom.init();       
      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    },
    // Home page
    'home': {
      init: function() {
        // JavaScript to be fired on the home page
        /* homepage sliding text */
        var slides = document.querySelectorAll('#slides .slide');
        var currentSlide = 0;
        var slideInterval = setInterval(nextSlide,3000);
        
        function nextSlide(){
          slides[currentSlide].className = 'slide';
          currentSlide = (currentSlide+1)%slides.length;
          slides[currentSlide].className = 'slide showing';
        }

        /* homepage awards slider */
        var multiSlides  = document.querySelector('.js_multislides');
        // http://easings.net/
        lory(multiSlides, {
          infinite: 6,
          slidesToScroll: 1
        });

      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
        var simple_dots       = document.querySelector('.js_simple_dots');
        var dot_count         = simple_dots.querySelectorAll('.js_slide').length;
        var dot_container     = simple_dots.querySelector('.js_dots');
        var dot_list_item     = document.createElement('li');

        function handleDotEvent(e) {
            if (e.type === 'before.lory.init') {
              //set li width same as slider width
              var frame = simple_dots.querySelector('.js_frame');
              var frameWidth = frame.offsetWidth;
              frame.querySelector('.js_slides>li').style.width = frameWidth + "px";

              for (var i = 0, len = dot_count; i < len; i++) {
                var clone = dot_list_item.cloneNode();              
                dot_container.appendChild(clone);
              }
              dot_container.childNodes[0].classList.add('active');

            }
            if (e.type === 'after.lory.init') {
              for (var i = 0, len = dot_count; i < len; i++) {
                dot_container.childNodes[i].addEventListener('click', function(e) {
                  dot_navigation_slider.slideTo(Array.prototype.indexOf.call(dot_container.childNodes, e.target));
                });
              }
            }
            if (e.type === 'after.lory.slide') {
              for (var i = 0, len = dot_container.childNodes.length; i < len; i++) {
                dot_container.childNodes[i].classList.remove('active');
              }
              dot_container.childNodes[e.detail.currentSlide - 1].classList.add('active');
            }
            if (e.type === 'on.lory.resize') {
                for (var i = 0, len = dot_container.childNodes.length; i < len; i++) {
                    dot_container.childNodes[i].classList.remove('active');
                }
                dot_container.childNodes[0].classList.add('active');
            }
        }
        simple_dots.addEventListener('before.lory.init', handleDotEvent);
        simple_dots.addEventListener('after.lory.init', handleDotEvent);
        simple_dots.addEventListener('after.lory.slide', handleDotEvent);
        simple_dots.addEventListener('on.lory.resize', handleDotEvent);

        var dot_navigation_slider = lory(simple_dots, {
            infinite: 1,
            enableMouseEvents: true
        });

        //Testimonial Slider
        var testimonial_slider = document.querySelector('.js_testimonial_slider');
       
        testimonial_slider.addEventListener('before.lory.init', LoadTestimonialSlider);
        
        function LoadTestimonialSlider(e) {
          if (e.type === 'before.lory.init') {
            //set li width same as slider width
            var frame = testimonial_slider.querySelector('.js_frame');
            var frameWidth = frame.offsetWidth;
            frame.querySelector('.js_slides>li').style.width = frameWidth + "px";
          }
        }

        lory(testimonial_slider, {
            infinite: 1
        });
      }
    },
    // About us page, note the change from about-us to about_us.
    'about_us': {
      init: function() {
        // JavaScript to be fired on the about us page
      }
    }
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Sage;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
