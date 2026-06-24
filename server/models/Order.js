const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [orderItemSchema],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  subTotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentDetails: {
    gateway: { type: String, enum: ['stripe', 'razorpay'], required: true },
    transactionId: { type: String, required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }
  },
  shippingStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing',
    index: true
  },
  couponCode: { type: String },
  trackingNumber: { type: String },
  carrierName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
