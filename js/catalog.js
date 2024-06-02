// Завантаження товарів з файлу JSON
    function loadProducts() {
      fetch('storage.json')
        .then(response => response.json())
        .then(products => {
          displayProducts(products);
        })
        .catch(error => console.error('Помилка при завантаженні товарів:', error));
    }

    // Відображення товарів на сторінці
    function displayProducts(products) {
      var productList = document.getElementById("product-list");
      productList.innerHTML = ""; // Очищаємо список товарів перед виведенням нових

      // Встановлюємо початкову кількість товарів, яку потрібно відобразити
      var itemsToShow = 9;
      var itemsDisplayed = 0;

      function createProductCard(product) {
        return `
          <article class="card">
            <div class="card__picture">
              <img src="card_img/${product.image}" alt="${product.title}" onclick="window.location.href='tovar.html?id=${product.id}'">
              <div class="card__btn">
                <button class="btn_cart btn" data-id="${product.id}">До кошика</button>
              </div>
            </div>
            <div class="card__desc">
              <div class="card__title">${product.title}</div>
              <div class="card__description">${product.description}</div>
              <div class="card__price">${product.price}</div>
            </div>
          </article>
        `;
      }

      products.slice(0, itemsToShow).forEach(product => {
        productList.insertAdjacentHTML("beforeend", createProductCard(product));
        itemsDisplayed++;
      });

      // Перевіряємо, чи всі товари вже відображені
      if (itemsDisplayed < products.length) {
        // Якщо ні, відображаємо кнопку "Показати ще"
        var showMoreButton = document.createElement('button');
        showMoreButton.textContent = 'Показати ще';
        showMoreButton.classList.add('show-more-btn');
        productList.appendChild(showMoreButton);

        // Додаємо подію для кнопки "Показати ще"
        showMoreButton.addEventListener('click', function() {
          // Відображаємо наступні 9 товарів, якщо вони є
          var newItemsDisplayed = itemsDisplayed + itemsToShow;
          products.slice(itemsDisplayed, newItemsDisplayed).forEach(product => {
            productList.insertAdjacentHTML("beforeend", createProductCard(product));
          });
          itemsDisplayed = newItemsDisplayed;

          // Приховуємо кнопку "Показати ще", якщо відображено всі товари
          if (itemsDisplayed >= products.length) {
            showMoreButton.style.display = 'none';
          }

          // Прив'язуємо події до нових кнопок "До кошика"
          attachAddToCartEventListeners();
        });
      }

      // Прив'язуємо події до кнопок "До кошика"
      attachAddToCartEventListeners();
    }

    // Прив'язуємо події до кнопок "До кошика"
    function attachAddToCartEventListeners() {
      var cartButtons = document.querySelectorAll('.btn_cart');
      cartButtons.forEach(function(button) {
        button.addEventListener('click', addToCart);
      });
    }

    // Функція для додавання товару в кошик
    function addToCart(event) {
      var productId = event.target.dataset.id; // Отримуємо id товару, на який клікнули
      var cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Завантажуємо товари з поточного відображення на сторінці
      var products = Array.from(document.querySelectorAll('.btn_cart')).map(btn => ({
        id: btn.dataset.id,
        title: btn.closest('.card').querySelector('.card__title').textContent,
        image: btn.closest('.card').querySelector('img').src,
        price: btn.closest('.card').querySelector('.card__price').textContent
      }));

      // Знаходимо товар за його id у завантажених товарах
      var productToAdd = products.find(function(product) {
        return product.id === productId;
      });

      // Перевірка на наявність товару в кошику
      if (productToAdd) {
        var existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
          existingItem.quantity++;
        } else {
          cart.push({ id: productToAdd.id, name: productToAdd.title, image: productToAdd.image, price: productToAdd.price, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart)); // Зберігаємо оновлений список товарів у LocalStorage
      }
    }

    // Викликати функцію завантаження товарів при завантаженні сторінки
    window.onload = function() {
      loadProducts();
    };