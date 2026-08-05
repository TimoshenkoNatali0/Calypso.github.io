(function() {
    'use strict';

    const heroParallax = document.getElementById('heroParallax');
    if (!heroParallax) return;

    let ticking = false;
    let lastScrollY = window.scrollY;

    function updateParallax() {
        const scrollY = window.scrollY;
        const offset = scrollY * 0.35;
        heroParallax.style.transform = 'translateY(' + offset + 'px)';
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    window.addEventListener('resize', function() {
        setTimeout(updateParallax, 100);
    }, { passive: true });

    setTimeout(updateParallax, 50);

})();