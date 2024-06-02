// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const xlsx = require('xlsx');

const app = express();
app.use(bodyParser.json());

app.post('/save-order', (req, res) => {
  const orderDetails = req.body;
  
  // Відкриваємо або створюємо новий Excel файл
  let workbook;
  try {
    workbook = xlsx.readFile('orders.xlsx');
  } catch (error) {
    workbook = xlsx.utils.book_new();
  }

  let worksheet = workbook.Sheets['Orders'] || xlsx.utils.json_to_sheet([]);

  // Додаємо нові дані
  const newRow = {
    Phone: orderDetails.phone,
    City: orderDetails.city,
    Street: orderDetails.street,
    Items: JSON.stringify(orderDetails.items.map(item => `${item.name} (${item.quantity})`))
  };

  const data = xlsx.utils.sheet_to_json(worksheet);
  data.push(newRow);
  const newWorksheet = xlsx.utils.json_to_sheet(data);

  // Оновлюємо або створюємо лист
  workbook.Sheets['Orders'] = newWorksheet;

  // Зберігаємо файл
  xlsx.writeFile(workbook, 'orders.xlsx');

  res.json({ message: 'Order saved' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
