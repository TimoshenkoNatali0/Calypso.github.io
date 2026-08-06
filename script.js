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

(function() {
    'use strict';

    const burger = document.getElementById('burgerToggle');
    const nav = document.getElementById('mainNav');
    const overlay = document.getElementById('navOverlay');
    const body = document.body;

    // Проверяем, что все элементы существуют
    if (!burger || !nav || !overlay) return;

    function toggleMenu() {
        const isOpen = nav.classList.toggle('open');
        burger.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('no-scroll');

        // Меняем aria-label для доступности
        burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    }

    function closeMenu() {
        nav.classList.remove('open');
        burger.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('no-scroll');
        burger.setAttribute('aria-label', 'Открыть меню');
    }

    // Открытие/закрытие по клику на бургер
    burger.addEventListener('click', toggleMenu);

    // Закрытие по клику на оверлей
    overlay.addEventListener('click', closeMenu);

    // Закрытие по клику на ссылку в меню
    nav.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });

    // Закрытие при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
            closeMenu();
        }
    });

    // При изменении размера окна — если меню открыто и ширина стала > 768px — закрываем
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && nav.classList.contains('open')) {
            closeMenu();
        }
    });

})();