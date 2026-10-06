(function() {
  "use strict";

  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  const speednetLoader = document.querySelector('.loader');
  if (speednetLoader) {
    const heroTitle = document.querySelector('.hero h1');
    const heroBtn = document.querySelectorAll('.hero .hero-btn-wrapper > a');

    if (typeof gsap === 'undefined') {
      window.addEventListener('load', () => speednetLoader.remove());
    } else {
      gsap.set([heroTitle, ...heroBtn], { autoAlpha: 0 });

      function heroAnimation() {
        gsap.fromTo(heroTitle, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, duration: 0.05, y: 0, delay: 0.5, ease: "elastic" });
        gsap.fromTo(heroBtn, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.7, stagger: 0.2, ease: "power3.out", clearProps: "transform,translate,rotate,scale" });
      }

      window.addEventListener('load', () => {
        gsap.timeline()
          .to('.loader__icon-container', { duration: 0.5, scale: 0, ease: "expo.inOut", delay: 0.5 })
          .to('.loader', {
            duration: 1.75,
            yPercent: -100,
            ease: "expo.inOut",
            onComplete: () => {
              speednetLoader.style.display = 'none';
              heroAnimation();
            }
          });
      });
    }
  }

  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  const coverageSwiperEl = document.querySelector('.coverage-swiper');
  if (coverageSwiperEl) {
    const section = coverageSwiperEl.closest('.coverage-spotlight');
    const total = coverageSwiperEl.querySelectorAll('.swiper-slide').length;
    const currentEl = section.querySelector('.coverage-current');
    const dotsEl = section.querySelector('.coverage-spotlight__dots');
    const pad = (n) => String(n).padStart(2, '0');

    section.querySelector('.coverage-total').textContent = pad(total);
    const dots = Array.from({ length: total }, (_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dotsEl.appendChild(dot);
      return dot;
    });

    function updateStatus(index) {
      currentEl.textContent = pad(index + 1);
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    const coverageSwiper = new Swiper(coverageSwiperEl, {
      slidesPerView: 'auto',
      spaceBetween: 20,
      loop: true,
      speed: 600,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      navigation: {
        nextEl: section.querySelector('.coverage-next'),
        prevEl: section.querySelector('.coverage-prev')
      },
      on: {
        slideChange: (swiper) => updateStatus(swiper.realIndex)
      }
    });

    dots.forEach((dot, i) => dot.addEventListener('click', () => coverageSwiper.slideToLoop(i)));
    updateStatus(coverageSwiper.realIndex);
  }

  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();