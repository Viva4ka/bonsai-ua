// Завантаження товару з файлу JSON
function loadProduct() {
    var productId = localStorage.getItem('selectedProduct');
    if (!productId) {
      console.error('Не знайдено id товару');
      return;
    }
  
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var products = JSON.parse(xhr.responseText);
        var product = products.find(p => p.id === productId);
        if (product) {
          displayProduct(product);
        } else {
          console.error('Товар не знайдено');
        }
      }
    };
    xhr.open("GET", "storage.json", true);
    xhr.send();
  }
  
  // Відображення товару на сторінці
  function displayProduct(product) {
    var productContainer = document.getElementById('product-container');
    productContainer.innerHTML = `
      <h1>${product.title}</h1>
      <img src="card_img/${product.image}" alt="${product.title}">
      <p>${product.description}</p>
      <p>${product.price} грн</p>
    `;
  }
  
  // Викликати функцію завантаження товару при завантаженні сторінки
  window.onload = function() {
    loadProduct();
  };
  