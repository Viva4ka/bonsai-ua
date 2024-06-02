document.addEventListener('DOMContentLoaded', function() {
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get('id');
    console.log('ID товару з URL:', productId);

    fetch('storage.json')
        .then(response => response.json())
        .then(products => {
            var product = products.find(p => p.id.toString() === productId);
            console.log('Отримані товари:', products);
            console.log('Знайдений товар:', product);

            if (product) {
                var detailsDiv = document.getElementById('product-details');
                var productHTML = `
                    <div class="container-product">
                      <h3 class="product-title">${product.title}</h3>
                      <div class="img-age">
                        <img src="card_img/${product.image}" alt="${product.title}" class="product-image">
                        <div class="text-button">
                          <p class="quantity"> В наявності: ${product.quantity} штук</p>
                          <p class="product-description">${product.description}</p>
                          <p class="product-height"> ${product.height}</p>
                          <p class="product-price">Ціна: ${product.price}</p>
                          <div class="card__btn">
                            <button class="btn_cart btn" data-id="${product.id}">До кошика</button>
                          </div>
                        </div>
                      </div>
                      <p class="product-desc">${product.desc}</p>
                    </div>
                `;
                detailsDiv.innerHTML = productHTML;

                // Прив'язуємо події до кнопок "До кошика"
                attachAddToCartEventListeners();
            } else {
                var detailsDiv = document.getElementById('product-details');
                detailsDiv.innerHTML = `<p class="not-found">Товар не знайдено.</p>`;
            }
        })
        .catch(error => console.error('Помилка при отриманні деталей товару:', error));
});

// Прив'язуємо події до кнопок "До кошика"
function attachAddToCartEventListeners() {
    document.querySelectorAll('.btn_cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Функція для додавання товару в кошик
function addToCart(event) {
    var productId = event.target.dataset.id; // Отримуємо id товару, на який клікнули
    var cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Отримуємо деталі товару з поточного відображення на сторінці
    var productTitle = document.querySelector('.product-title').textContent;
    var productImage = document.querySelector('.product-image').src;
    var productPrice = document.querySelector('.product-price').textContent;

    // Перевірка на наявність товару в кошику
    var existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            title: productTitle,
            image: productImage,
            price: productPrice,
            quantity: 1
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart)); // Зберігаємо оновлений список товарів у LocalStorage

    // Оновлення відображення кошика
    updateItemCount(); // Оновлення кількості товарів у кошику
    displayCheckoutButton(); // Відображення кнопки оформлення замовлення
}

// Оновлення інформації про кількість товарів у кошику
function updateItemCount() {
    var itemCountDiv = document.getElementById('item-count');
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var totalItems = cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
    itemCountDiv.textContent = `У кошику: ${totalItems} товарів`;
}

// Відображення кнопки оформлення замовлення лише коли є товари у кошику
function displayCheckoutButton() {
    var checkoutBtn = document.getElementById('checkout-btn');
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    checkoutBtn.style.display = cart.length > 0 ? "block" : "none";
}

// Завантаження товарів з файлу JSON
function loadProducts() {
    fetch('storage.json')
        .then(response => response.json())
        .then(products => {
            displayCartItems(products);
        })
        .catch(error => console.error('Помилка при завантаженні товарів:', error));
}

// Відображення товарів у кошику та кнопки оформлення замовлення
function displayCartItems(products) {
    var cartItemsDiv = document.getElementById('cart-items');
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsDiv.innerHTML = ''; // Очищаємо попередні товари

    let totalPrice = 0;

    cart.forEach(function(cartItem) {
        var product = products.find(p => p.id.toString() === cartItem.id);
        if (product) {
            var cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');

            var quantityDiv = document.createElement('div');
            quantityDiv.textContent = `Кількість: ${cartItem.quantity}`;
            cartItemDiv.appendChild(quantityDiv);

            var img = document.createElement('img');
            img.src = 'card_img/' + product.image;
            img.alt = product.title;
            img.className = 'cart_img';
            img.onclick = function() {
                window.location.href = `tovar.html?id=${product.id}`;
            };
            cartItemDiv.appendChild(img);

            var name = document.createElement('div');
            name.textContent = product.title;
            cartItemDiv.appendChild(name);

            var price = document.createElement('div');
            price.textContent = `Ціна: ${product.price}`;
            cartItemDiv.appendChild(price);

            cartItemsDiv.appendChild(cartItemDiv);

            totalPrice += cartItem.quantity * parseFloat(product.price.replace(' грн', ''));
        }
    });

    var totalDiv = document.createElement('div');
    totalDiv.classList.add('total-price');
    totalDiv.textContent = `Ітого: ${totalPrice} грн`;
    cartItemsDiv.appendChild(totalDiv);

    displayCheckoutButton(); // Відображення кнопки оформлення замовлення
}

// Викликати функцію для відображення кнопки оформлення замовлення при завантаженні сторінки
window.onload = function() {
    loadProducts();
    displayCheckoutButton(); // Відображення кнопки оформлення замовлення
    updateItemCount(); // Оновлення кількості товарів у кошику
};