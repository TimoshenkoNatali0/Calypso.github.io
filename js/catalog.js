document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    // ДАННЫЕ ТОВАРОВ
    // ========================================
    // Пока массив пустой — товары добавляются по мере поступления.
    // Шаблон объекта:
    // {
    //   id: 1,
    //   name: 'Название',
    //   category: 'women', // women | men | armor | rock | headwear | accessories
    //   categoryLabel: 'Женские',
    //   description: 'Описание',
    //   price: 'от 25 000 ₽',
    //   badge: 'новинка', // или null
    //   image: null       // или 'images/photo.jpg'
    // }

    const products = [
        {
            id: 1,
            name: 'Корсетное платье «Амазонка»',
            category: 'women',
            categoryLabel: 'Женские сценические костюмы',
            description: 'Элегантное кожаное платье с корсетным верхом для театральной постановки. Ручная работа, натуральная кожа.',
            price: 'от 25 000 ₽',
            badge: 'хит',
            image: 'img/products/amazon-dress.jpg'
        },
        {
            id: 2,
            name: 'Корсетное платье «Амазонка»',
            category: 'women',
            categoryLabel: 'Женские сценические костюмы',
            description: 'Элегантное кожаное платье с корсетным верхом для театральной постановки. Ручная работа, натуральная кожа.',
            price: 'от 25 000 ₽',
            badge: 'хит',
            image: 'img/products/amazon-dress-2.jpg'
        },
        {
            id: 3,
            name: 'Корсетное платье «Амазонка»',
            category: 'women',
            categoryLabel: 'Женские сценические костюмы',
            description: 'Элегантное кожаное платье с корсетным верхом для театральной постановки. Ручная работа, натуральная кожа.',
            price: 'от 25 000 ₽',
            badge: 'хит',
            image: 'img/products/amazon-dress-2.jpg'
        },
        {
            id: 4,
            name: 'Корсетное платье «Амазонка»',
            category: 'women',
            categoryLabel: 'Женские сценические костюмы',
            description: 'Элегантное кожаное платье с корсетным верхом для театральной постановки. Ручная работа, натуральная кожа.',
            price: 'от 25 000 ₽',
            badge: 'хит',
            image: 'img/products/amazon-dress-2.jpg'
        },
        {
            id: 5,
            name: 'Кожаный пиджак «Рок-звезда»',
            category: 'men',
            categoryLabel: 'Мужские сценические костюмы',
            description: 'Классический кожаный пиджак с акцентными плечами для сцены и повседневности.',
            price: 'от 28 000 ₽',
            badge: 'новинка',
            image: null                                  // Фото пока нет — покажется заглушка 🖼️
        },
        {
            id: 6,
            name: 'Доспех «Рыцарь Севера»',
            category: 'armor',
            categoryLabel: 'Рыцари, викинги, доспехи',
            description: 'Полный комплект кожаного доспеха с металлическими вставками для реконструкций.',
            price: 'от 65 000 ₽',
            badge: 'премиум',
            image: 'images/products/north-knight.jpg'
        },
        {
            id: 7,
            name: 'Пояс «Викинг»',
            category: 'accessories',
            categoryLabel: 'Аксессуары',
            description: 'Широкий кожаный пояс с бронзовой пряжкой для исторических костюмов.',
            price: 'от 6 000 ₽',
            badge: null,                                 // Без плашки
            image: null
        },
        {
            id: 8,
            name: 'Пояс «Викинг»',
            category: 'headwear',
            categoryLabel: 'Аксессуары',
            description: 'Широкий кожаный пояс с бронзовой пряжкой для исторических костюмов.',
            price: 'от 6 000 ₽',
            badge: null,                                 // Без плашки
            image: null
        },
        {
            id: 9,
            name: 'Пояс «Викинг»',
            category: 'rock',
            categoryLabel: 'Аксессуары',
            description: 'Широкий кожаный пояс с бронзовой пряжкой для исторических костюмов.',
            price: 'от 6 000 ₽',
            badge: null,                                 // Без плашки
            image: null
        },
    ];

    // ========================================
    // ПОРЯДОК КАТЕГОРИЙ (для группировки)
    // ========================================
    const CATEGORY_ORDER = [
        { key: 'women', label: 'Женские сценические костюмы' },
        { key: 'men', label: 'Мужские сценические костюмы' },
        { key: 'armor', label: 'Рыцари, викинги, доспехи' },
        { key: 'rock', label: 'Рок, глэм-рок' },
        { key: 'headwear', label: 'Шляпы, маски, кокошники' },
        { key: 'accessories', label: 'Аксессуары' }
    ];

    // ========================================
    // РЕНДЕР
    // ========================================
    const grid = document.getElementById('catalogGrid');

    function renderProductCard(product) {
        return `
    <div class="product-card" data-category="${product.category}">
      <a href="product.html?id=${product.id}" class="product-card-link">
        <div class="product-image">
          ${product.image
            ? `<img src="${product.image}" alt="${product.name}">`
            : `
              <div class="product-placeholder">
                <span>🖼️</span>
                <span>Фото костюма</span>
              </div>
            `
        }
          ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        </div>
        <div class="product-info">
          <span class="product-category">${product.categoryLabel}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-meta">
            <span class="product-price">${product.price}</span>
            <span class="btn-small">Подробнее →</span>
          </div>
        </div>
      </a>
    </div>
  `;
    }

    function renderProducts(filter = 'all') {
        // Собираем нужные категории
        let categoriesToShow = CATEGORY_ORDER;
        if (filter !== 'all') {
            categoriesToShow = CATEGORY_ORDER.filter(c => c.key === filter);
        }

        let html = '';
        let totalFound = 0;

        categoriesToShow.forEach(cat => {
            const items = products.filter(p => p.category === cat.key);
            if (items.length === 0) return;

            totalFound += items.length;

            html += `
        <div class="category-group">
          <h3 class="category-group-title">${cat.label}</h3>
          <div class="category-group-grid">
            ${items.map(renderProductCard).join('')}
          </div>
        </div>
      `;
        });

        if (totalFound === 0) {
            grid.innerHTML = `
        <div class="no-products">
          <span>🔍</span>
          <p>Здесь пока нет товаров. Совсем скоро добавятся новые костюмы!</p>
        </div>
      `;
            return;
        }

        grid.innerHTML = html;
    }

    // ========================================
    // ФИЛЬТРАЦИЯ
    // ========================================
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderProducts(this.dataset.filter);
        });
    });

    // ========================================
    // ФИЛЬТР ИЗ URL (?category=women)
    // ========================================
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');

    if (categoryParam) {
        const targetBtn = document.querySelector(`.filter-btn[data-filter="${categoryParam}"]`);
        if (targetBtn) {
            filterButtons.forEach(b => b.classList.remove('active'));
            targetBtn.classList.add('active');
            renderProducts(categoryParam);
        } else {
            renderProducts('all');
        }
    } else {
        renderProducts('all');
    }

});