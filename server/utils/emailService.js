const nodemailer = require('nodemailer');

// Create Transporter
// In production, configure SMTP settings in .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'ethereal_user', // mock developer credentials
    pass: process.env.SMTP_PASS || 'ethereal_pass'
  }
});

/**
 * Send a quiet-luxury styled order confirmation HTML email.
 * @param {string} toEmail - Recipient email address
 * @param {object} order - The populated Order document
 */
const sendOrderConfirmationEmail = async (toEmail, order) => {
  const itemsListHTML = order.items.map(item => `
    <tr style="border-bottom: 1px solid #E5E5E5;">
      <td style="padding: 12px 0; font-size: 13px; color: #0A0A0A; font-family: 'Inter', sans-serif;">
        <strong>${item.name}</strong><br/>
        <span style="font-size: 10px; color: #707070; text-transform: uppercase;">SIZE: ${item.size} / COLOR: ${item.color}</span>
      </td>
      <td style="padding: 12px 0; text-align: center; font-size: 13px; color: #0A0A0A; font-family: 'Inter', sans-serif;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 0; text-align: right; font-size: 13px; color: #0A0A0A; font-family: 'Inter', sans-serif; font-weight: bold;">
        $${item.price * item.quantity}
      </td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"Montclair Atelier" <${process.env.SMTP_FROM || 'atelier@montclair.com'}>`,
    to: toEmail,
    subject: `Order Confirmed: ${order._id.toString().substring(0, 8).toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmed | Montclair</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F8F8F8; font-family: 'Inter', sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #EAEAEA; margin: 40px auto; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
          
          <!-- BRAND LOGO HEADER -->
          <tr>
            <td align="center" style="padding-bottom: 40px; border-bottom: 1px solid #E5E5E5;">
              <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.25em; text-transform: uppercase; color: #0A0A0A; font-family: 'Outfit', sans-serif;">
                MONTCLAIR
              </h1>
              <span style="font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: #C8A45D; display: block; margin-top: 4px;">
                Designed For The Modern Gentleman
              </span>
            </td>
          </tr>

          <!-- SALUTATION -->
          <tr>
            <td style="padding-top: 40px; padding-bottom: 20px;">
              <h2 style="margin: 0; font-size: 16px; font-weight: bold; text-transform: uppercase; color: #0A0A0A; font-family: 'Outfit', sans-serif;">
                Order Confirmed
              </h2>
              <p style="font-size: 13px; color: #707070; line-height: 1.6; font-weight: 300; margin-top: 8px;">
                We have registered your capsule request. Meticulous fabrication and packaging procedures have been initiated at our local atelier workspace.
              </p>
            </td>
          </tr>

          <!-- ORDER ID BOX -->
          <tr>
            <td style="background-color: #F8F8F8; padding: 16px; margin-bottom: 30px; text-align: center; border: 1px solid #EAEAEA;">
              <span style="font-size: 9px; color: #707070; text-transform: uppercase; letter-spacing: 0.1em; display: block;">Order Reference ID</span>
              <strong style="font-size: 15px; color: #C8A45D; letter-spacing: 0.15em; text-transform: uppercase; display: block; margin-top: 4px;">
                ${order._id.toString().substring(0, 10).toUpperCase()}
              </strong>
            </td>
          </tr>

          <!-- ITEMS TABLE -->
          <tr>
            <td style="padding-top: 20px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <thead>
                  <tr style="border-bottom: 2px solid #0A0A0A;">
                    <th align="left" style="padding-bottom: 8px; font-size: 10px; uppercase; letter-spacing: 0.1em; color: #707070;">Garment Details</th>
                    <th align="center" style="padding-bottom: 8px; font-size: 10px; uppercase; letter-spacing: 0.1em; color: #707070;">Qty</th>
                    <th align="right" style="padding-bottom: 8px; font-size: 10px; uppercase; letter-spacing: 0.1em; color: #707070;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsListHTML}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- TOTALS PRICING BLOCK -->
          <tr>
            <td style="padding-top: 30px; padding-bottom: 30px; border-bottom: 1px solid #E5E5E5;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; color: #707070; line-height: 2;">
                <tr>
                  <td align="left">Subtotal</td>
                  <td align="right" style="color: #0A0A0A;">$${order.subTotal}</td>
                </tr>
                ${order.discountAmount > 0 ? `
                <tr style="color: #C8A45D;">
                  <td align="left">Discount applied</td>
                  <td align="right">-$${order.discountAmount}</td>
                </tr>
                ` : ''}
                <tr>
                  <td align="left">Express Shipping</td>
                  <td align="right" style="color: #0A0A0A;">${order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee}`}</td>
                </tr>
                <tr style="font-size: 14px; font-weight: bold; color: #0A0A0A; border-top: 1px solid #EAEAEA; height: 40px;">
                  <td align="left" style="padding-top: 10px;">Total</td>
                  <td align="right" style="padding-top: 10px; color: #C8A45D;">$${order.totalAmount}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BRAND STORY NOTE -->
          <tr>
            <td style="padding-top: 40px; text-align: center;">
              <p style="font-size: 11px; color: #707070; line-height: 1.8; font-weight: 300; font-style: italic;">
                "Structure drapes confidence. Dress for the room."
              </p>
              <p style="font-size: 10px; color: #9CA3AF; margin-top: 20px;">
                Montclair Atelier • Milan | New York | Mumbai
              </p>
            </td>
          </tr>

        </table>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email dispatched: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Email dispatch failure: ${error.message}`);
  }
};

module.exports = { sendOrderConfirmationEmail };
