import { Bill, ShopDetails } from '../types/database';

export const generateBillHTML = (bill: Bill, shopDetails: ShopDetails) => {
  const billDate = bill.date instanceof Date ? bill.date : bill.date.toDate();
  const date = billDate.toLocaleDateString();
  const time = billDate.toLocaleTimeString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bill</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo {
          max-width: 100px;
          margin-bottom: 10px;
        }
        .shop-name {
          font-size: 24px;
          font-weight: bold;
          margin: 5px 0;
        }
        .shop-details {
          font-size: 14px;
          margin: 5px 0;
        }
        .bill-info {
          margin: 20px 0;
          padding: 10px;
          background: #f5f5f5;
        }
        .customer-details {
          margin: 10px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        th {
          background: #f5f5f5;
        }
        .total {
          text-align: right;
          font-size: 18px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        ${shopDetails.logo ? `<img src="${shopDetails.logo}" class="logo" />` : ''}
        <div class="shop-name">${shopDetails.name}</div>
        <div class="shop-details">${shopDetails.address}</div>
        <div class="shop-details">Phone: ${shopDetails.phone}</div>
        ${shopDetails.gst ? `<div class="shop-details">GST: ${shopDetails.gst}</div>` : ''}
      </div>

      <div class="bill-info">
        <div>Bill No: ${bill.id}</div>
        <div>Date: ${date}</div>
        <div>Time: ${time}</div>
      </div>

      <div class="customer-details">
        <div>Customer Name: ${bill.customerName}</div>
        <div>Phone: ${bill.customerPhone}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${bill.items.map(item => `
            <tr>
              <td>${item.name}${item.customName ? ` (${item.customName})` : ''}</td>
              <td>₹${item.price}</td>
              <td>${item.quantity}</td>
              <td>₹${item.price * item.quantity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="total">
        Total Amount: ₹${bill.totalAmount}
        <br>
        Payment Mode: ${bill.paymentMode}
      </div>

      <div class="footer">
        Thank you for shopping with us!
      </div>
    </body>
    </html>
  `;
}; 