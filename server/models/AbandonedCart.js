const mongoose = require('mongoose');

const abandonedCartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  recoveryEmailSentCount: { type: Number, default: 0 },
  lastCheckedAt: { type: Date, default: Date.now },
  isRecovered: { type: Boolean, default: false }
});

module.exports = mongoose.model('AbandonedCart', abandonedCartSchema);
