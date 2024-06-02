// Відображення кнопки оформлення замовлення лише коли є товари у кошику:
function displayCheckoutButton() {
  var checkoutBtn = document.getElementById('checkout-btn');
  checkoutBtn.style.display = cartItems.length > 0 ? "block" : "none";
}

// Оновлення інформації про кількість товарів у кошику
function updateItemCount() {
  var itemCountDiv = document.getElementById('item-count');
  var totalItems = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
  itemCountDiv.textContent = `У Кошику ${totalItems} товарів`;
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
  cartItemsDiv.innerHTML = ''; // Очищаємо попередні товари

  let totalPrice = 0;

  cartItems.forEach(function(cartItem) {
      var product = products.find(p => p.id === parseInt(cartItem.id));
      if (product) {
          var cartItemDiv = document.createElement('div');
          cartItemDiv.classList.add('cart-item');

          var quantityDiv = document.createElement('div');
          quantityDiv.textContent = `Кількість: ${cartItem.quantity} -`;
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
          price.textContent = `---Ціна: ${product.price}`;
          cartItemDiv.appendChild(price);

          var removeBtn = document.createElement('button');
          removeBtn.classList.add('remove-btn');
          removeBtn.textContent = 'Видалити';
          removeBtn.addEventListener('click', function() {
              removeItemFromCart(cartItem.id);
          });
          cartItemDiv.appendChild(removeBtn);

          cartItemsDiv.appendChild(cartItemDiv);

          totalPrice += cartItem.quantity * parseFloat(product.price.replace(' грн', ''));
      }
  });

  var totalDiv = document.createElement('div');
  totalDiv.classList.add('total-price');
  totalDiv.textContent = `Ітого: ${totalPrice} грн`;
  cartItemsDiv.appendChild(totalDiv);

  updateItemCount(); // Оновлення кількості товарів у кошику
  displayCheckoutButton(); // Відображення кнопки оформлення замовлення
}

// Оформлення замовлення
var checkoutBtn = document.getElementById('checkout-btn');
var modal = document.getElementById('modal');
var closeModal = document.getElementsByClassName('close')[0];

checkoutBtn.addEventListener('click', function() {
  modal.style.display = "block";
});

closeModal.addEventListener('click', function() {
  modal.style.display = "none";
});

window.addEventListener('click', function(event) {
  if (event.target == modal) {
      modal.style.display = "none";
  }
});

document.getElementById('modalForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Замість відправлення даних на сервер, просто очищаємо кошик і показуємо повідомлення
  localStorage.removeItem('cart'); // Очищаємо кошик після оформлення замовлення
  cartItems = []; // Очищаємо масив товарів у кошику
  loadProducts(); // Оновлення відображення кошика
  modal.style.display = "none";

  alert('Вам зателефонують, щоб уточнити місце та отримання замовлення.');
});

// Видалення товару з кошика
function removeItemFromCart(id) {
  var itemIndex = cartItems.findIndex(function(cartItem) {
      return cartItem.id === id;
  });

  if (itemIndex !== -1) {
      if (cartItems[itemIndex].quantity > 1) {
          cartItems[itemIndex].quantity--;
      } else {
          cartItems.splice(itemIndex, 1);
      }
  }

  localStorage.setItem('cart', JSON.stringify(cartItems));
  loadProducts(); // Оновлення відображення кошика після видалення товару
}

// Завантаження товарів з LocalStorage при завантаженні сторінки
window.onload = function() {
  cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  loadProducts();
  displayCheckoutButton(); // Відображення кнопки оформлення замовлення
  updateItemCount(); // Оновлення кількості товарів у кошику
};