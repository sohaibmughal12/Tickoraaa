export const generateInvoiceHtml = (order) => {
  const itemsHtml = order.orderItems.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: left;">
        <div style="font-weight: 600; color: #111;">${item.name}</div>
        ${item.selectedColor ? `<span style="font-size: 11px; color: #777;">Dial: ${item.selectedColor}</span>` : ''}
        ${item.selectedStrap ? `<span style="font-size: 11px; color: #777; margin-left: 10px;">Strap: ${item.selectedStrap}</span>` : ''}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: center; color: #555;">${item.quantity}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; color: #555;">PKR ${item.price.toLocaleString()}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600; color: #111;">PKR ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice - Order #${order._id}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 40px; }
        .invoice-box { max-w: 800px; margin: auto; padding: 0; font-size: 14px; line-height: 24px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 26px; font-weight: 900; letter-spacing: 2px; color: #000; }
        .title { font-size: 22px; font-weight: 300; text-transform: uppercase; color: #555; }
        .grid-details { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #D4AF37; font-weight: 700; margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { font-size: 11px; text-transform: uppercase; color: #777; font-weight: 600; padding-bottom: 10px; border-bottom: 2px solid #eee; }
        .totals-table { width: 300px; float: right; margin-bottom: 0; }
        .totals-table td { padding: 6px 0; }
        .grand-total { font-size: 16px; font-weight: 700; color: #D4AF37; border-top: 1px solid #eee; padding-top: 10px !important; }
        .footer { clear: both; border-top: 1px solid #eee; margin-top: 50px; padding-top: 20px; text-align: center; font-size: 11px; color: #999; }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div class="logo">TICKORA.</div>
          <div class="title">Official Invoice</div>
        </div>

        <div class="grid-details">
          <div>
            <div class="section-title">Invoice To:</div>
            <strong>${order.shippingAddress.phone}</strong><br>
            ${order.shippingAddress.street}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zip}<br>
            Pakistan
          </div>
          <div style="text-align: right;">
            <div class="section-title">Order Info:</div>
            <strong>Order ID:</strong> ${order._id}<br>
            <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
            <strong>Payment Method:</strong> <span style="text-transform: uppercase;">${order.paymentMethod.replace('_', ' ')}</span><br>
            <strong>Status:</strong> ${order.isPaid ? 'Paid' : 'Unpaid / Pending'}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align: left; width: 50%;">Timepiece</th>
              <th style="text-align: center; width: 10%;">Qty</th>
              <th style="text-align: right; width: 20%;">Price</th>
              <th style="text-align: right; width: 20%;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <table class="totals-table">
          <tbody>
            <tr>
              <td style="color: #777;">Subtotal:</td>
              <td style="text-align: right; font-weight: 600;">PKR ${(order.totalPrice - order.taxPrice - order.shippingPrice + order.discountPrice).toLocaleString()}</td>
            </tr>
            ${order.discountPrice > 0 ? `
            <tr style="color: #D4AF37;">
              <td>Discount:</td>
              <td style="text-align: right; font-weight: 600;">- PKR ${order.discountPrice.toLocaleString()}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="color: #777;">Shipping:</td>
              <td style="text-align: right; font-weight: 600;">${order.shippingPrice === 0 ? 'Free' : `PKR ${order.shippingPrice.toLocaleString()}`}</td>
            </tr>
            <tr>
              <td style="color: #777;">GST (5%):</td>
              <td style="text-align: right; font-weight: 600;">PKR ${order.taxPrice.toLocaleString()}</td>
            </tr>
            <tr class="grand-total">
              <td>Grand Total:</td>
              <td style="text-align: right; font-weight: 700;">PKR ${order.totalPrice.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          Thank you for choosing Tickora Luxury. For inquiries, email concierge@tickora.com
        </div>
      </div>
    </body>
    </html>
  `;
};
