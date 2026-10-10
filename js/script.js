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

// ========================================
// МОДУЛЬ: ВИДЕО В СЕКЦИИ "ПРОЦЕСС"
// ========================================
(function initProcessVideos() {
    const cards = document.querySelectorAll('.process-video-card');
    if (!cards.length) return;

    cards.forEach(card => {
        const video = card.querySelector('video');
        if (!video) return;

        // При наведении курсора — играем
        card.addEventListener('mouseenter', () => {
            const playPromise = video.play();
            // Браузер может заблокировать автоплей — гасим ошибку
            if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }
        });

        // При уходе курсора — пауза и возврат к первому кадру
        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });

        // Клик по карточке — открываем видео на весь экран
        card.addEventListener('click', () => {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
            // Включаем звук при полноэкранном просмотре
            video.muted = false;
            video.controls = true;
            video.play().catch(() => {});
        });

        // При выходе из полноэкранного режима — возвращаем в исходное состояние
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                video.muted = true;
                video.controls = false;
                video.pause();
                video.currentTime = 0;
            }
        });
    });

    console.log('✅ Видео в секции "Процесс" инициализированы');
})();

// ========================================
// МОДУЛЬ: КАРУСЕЛЬ ВИДЕО В СЕКЦИИ "ПРОЦЕСС"
// ========================================
(function initProcessCarousel() {
    const viewport = document.getElementById('processViewport');
    const track = document.getElementById('processTrack');
    const prevBtn = document.getElementById('processPrev');
    const nextBtn = document.getElementById('processNext');
    const dotsContainer = document.getElementById('processDots');

    if (!viewport || !track || !prevBtn || !nextBtn || !dotsContainer) {
        console.warn('⚠️ Карусель: не найдены необходимые элементы');
        return;
    }

    const cards = Array.from(track.querySelectorAll('.process-video-card'));
    if (cards.length === 0) return;

    const totalCards = cards.length;
    let currentIndex = 0;
    let dots = [];

    // ========================================
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // ========================================
    function getGap() {
        const gap = parseFloat(getComputedStyle(track).gap);
        return isNaN(gap) ? 0 : gap;
    }

    function getVisibleCount() {
        if (cards.length === 0) return 1;
        const cardWidth = cards[0].offsetWidth;
        const gap = getGap();
        const viewportWidth = viewport.offsetWidth;
        return Math.max(1, Math.round((viewportWidth + gap) / (cardWidth + gap)));
    }

    function getMaxIndex() {
        return Math.max(0, totalCards - getVisibleCount());
    }

    // ========================================
    // ПОСТРОЕНИЕ ТОЧЕК
    // ========================================
    function buildDots() {
        dotsContainer.innerHTML = '';
        dots = [];
        const positionsCount = getMaxIndex() + 1;

        for (let i = 0; i < positionsCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Позиция ${i + 1}`);
            dot.dataset.index = i;
            dot.addEventListener('click', function () {
                goTo(parseInt(this.dataset.index, 10));
            });
            dotsContainer.appendChild(dot);
            dots.push(dot);
        }
    }

    // ========================================
    // ПЕРЕХОД К ИНДЕКСУ
    // ========================================
    function goTo(index) {
        const maxIndex = getMaxIndex();
        const safeIndex = Math.max(0, Math.min(index, maxIndex));
        const gap = getGap();
        const cardWidth = cards[0].offsetWidth;
        const targetScroll = safeIndex * (cardWidth + gap);

        viewport.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });

        currentIndex = safeIndex;
    }

    // ========================================
    // ОБНОВЛЕНИЕ UI (точки + стрелки)
    // ========================================
    function updateUI() {
        const maxIndex = getMaxIndex();
        const gap = getGap();
        const cardWidth = cards[0].offsetWidth + gap;
        const scrollLeft = viewport.scrollLeft;

        // Определяем активную точку
        let rawIndex = Math.round(scrollLeft / cardWidth);
        const activeIndex = Math.min(rawIndex, maxIndex);

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });

        currentIndex = activeIndex;

        // Состояние стрелок
        prevBtn.disabled = scrollLeft <= 5;
        nextBtn.disabled = scrollLeft >= (viewport.scrollWidth - viewport.offsetWidth - 5);
    }

    // ========================================
    // СОБЫТИЯ: СТРЕЛКИ
    // ========================================
    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    // ========================================
    // СОБЫТИЯ: СКРОЛЛ
    // ========================================
    let scrollTimeout;
    viewport.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateUI, 80);
    }, { passive: true });

    // ========================================
    // СОБЫТИЯ: РЕСАЙЗ (пересчёт точек)
    // ========================================
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            buildDots();
            goTo(currentIndex);
            setTimeout(updateUI, 100);
        }, 150);
    }, { passive: true });

    // ========================================
    // ВИДЕО: HOVER + FULLSCREEN
    // ========================================
    // ========================================
// ВИДЕО: HOVER + FULLSCREEN + ПОСТЕР
// ========================================
    cards.forEach(card => {
        const video = card.querySelector('video');
        if (!video) return;

        // ----------------------------------------
        // HOVER: воспроизведение в блоке
        // ----------------------------------------
        card.addEventListener('mouseenter', () => {
            // Показываем класс сразу — постер исчезает мгновенно
            card.classList.add('is-playing');

            const p = video.play();
            if (p !== undefined) p.catch(() => {});
        });

        card.addEventListener('mouseleave', () => {
            // Не сбрасываем, если видео в fullscreen
            if (document.fullscreenElement) return;

            video.pause();
            video.currentTime = 0;
            card.classList.remove('is-playing');
        });

        // ----------------------------------------
        // КЛИК: раскрытие на весь экран
        // ----------------------------------------
        card.addEventListener('click', (e) => {
            // Если уже в fullscreen — ничего не делаем (браузер сам выйдет)
            if (document.fullscreenElement) return;

            // Останавливаем "фоновое" воспроизведение
            video.pause();
            video.currentTime = 0;

            // Включаем звук и контролы
            video.muted = false;
            video.controls = true;

            // Открываем на весь экран
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        });

        // Когда видео вошло в fullscreen — воспроизводим
        video.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement === video) {
                video.play().catch(() => {});
            }
        });
    });

// ========================================
// ВЫХОД ИЗ FULLSCREEN — возврат в исходное
// ========================================
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            cards.forEach(card => {
                const video = card.querySelector('video');
                if (!video) return;
                video.muted = true;
                video.controls = false;
                video.pause();
                video.currentTime = 0;
                card.classList.remove('is-playing');
            });
        }
    });

    // При выходе из fullscreen — возвращаем в исходное состояние
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            cards.forEach(card => {
                const video = card.querySelector('video');
                if (!video) return;
                video.muted = true;
                video.controls = false;
                video.pause();
                video.currentTime = 0;
            });
        }
    });

    // ========================================
    // ИНИЦИАЛИЗАЦИЯ
    // ========================================
    buildDots();
    setTimeout(updateUI, 100);

    console.log('✅ Карусель "Процесс" инициализирована:', totalCards, 'видео,', dots.length, 'точек');

})();