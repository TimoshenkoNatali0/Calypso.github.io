document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    // ДАННЫЕ ТОВАРОВ (должны совпадать с catalog.js)
    // ========================================
    // ⚠️ ВАЖНО: этот массив должен быть тот же, что в catalog.js.
    // Позже можно вынести в отдельный файл products.js и подключать на обеих страницах.

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
    // ПОЛУЧАЕМ ID ИЗ URL
    // ========================================
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'), 10);

    const container = document.getElementById('productPage');
    const relatedGrid = document.getElementById('relatedGrid');
    const breadcrumbCategory = document.getElementById('breadcrumbCategory');
    const breadcrumbProduct = document.getElementById('breadcrumbProduct');

    // ========================================
    // НАХОДИМ ТОВАР
    // ========================================
    const product = products.find(p => p.id === productId);

    if (!product) {
        container.innerHTML = `
      <div class="no-products" style="grid-column: 1 / -1;">
        <span>🔍</span>
        <p>Товар не найден. Возможно, он был удалён или ссылка неверна.</p>
        <a href="catalog.html" class="btn-primary" style="margin-top: 20px;">Вернуться в каталог</a>
      </div>
    `;
        relatedGrid.innerHTML = '';
        return;
    }

    // ========================================
    // ОБНОВЛЯЕМ ХЛЕБНЫЕ КРОШКИ
    // ========================================
    breadcrumbCategory.textContent = product.categoryLabel;
    breadcrumbCategory.href = `catalog.html?category=${product.category}`;
    breadcrumbProduct.textContent = product.name;

    // Обновляем title страницы
    document.title = `${product.name} — Calypso`;

    // ========================================
    // РЕНДЕР СТРАНИЦЫ ТОВАРА
    // ========================================
    const galleryHTML = product.image
        ? `
      <div class="product-main-image">
        <img src="${product.image}" alt="${product.name}" id="mainImage">
      </div>
    `
        : `
      <div class="product-main-image">
        <div class="product-image-placeholder">
          <span>🖼️</span>
          <span>Фото товара</span>
          <small>(загрузите фото)</small>
        </div>
      </div>
    `;

    const featuresHTML = product.features
        ? product.features.map(f => `<li>${f}</li>`).join('')
        : '';

    container.innerHTML = `
    <div class="product-gallery">
      ${galleryHTML}
      ${product.image ? `
        <div class="product-thumbs">
          <div class="product-thumb active">
            <img src="${product.image}" alt="${product.name}">
          </div>
        </div>
      ` : ''}
    </div>

    <div class="product-details">
      <span class="product-category">${product.categoryLabel}</span>
      <h1>${product.name}</h1>
      <div class="product-price-large">${product.price}</div>
      <p class="product-description">${product.fullDescription || product.description}</p>
      
      ${featuresHTML ? `
        <ul class="product-features">
          ${featuresHTML}
        </ul>
      ` : ''}

      <div class="product-actions">
        <a href="index.html#cta" class="btn-primary">Заказать</a>
        <a href="catalog.html?category=${product.category}" class="btn-small">Смотреть ещё</a>
      </div>
    </div>
  `;

    // ========================================
    // ПОХОЖИЕ ТОВАРЫ (из той же категории)
    // ========================================
    const related = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 3);

    if (related.length > 0) {
        relatedGrid.innerHTML = related.map(p => `
      <div class="product-card">
        <a href="product.html?id=${p.id}" class="product-card-link">
          <div class="product-image">
            ${p.image
            ? `<img src="${p.image}" alt="${p.name}">`
            : `<div class="product-placeholder"><span>🖼️</span><span>Фото костюма</span></div>`
        }
            ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          </div>
          <div class="product-info">
            <span class="product-category">${p.categoryLabel}</span>
            <h3>${p.name}</h3>
            <div class="product-meta">
              <span class="product-price">${p.price}</span>
            </div>
          </div>
        </a>
      </div>
    `).join('');
    } else {
        document.querySelector('.related-products').style.display = 'none';
    }

});