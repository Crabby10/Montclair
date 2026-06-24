const mongoose = require('mongoose');

const skuSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  colorHex: { type: String },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, required: true, unique: true }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  images: [{ type: String, required: true }],
  category: { type: String, required: true, index: true },
  subCategory: { type: String },
  collectionTag: { type: String, index: true },
  skus: [skuSchema],
  tags: [String],
  fabricDetails: { type: String },
  careInstructions: { type: String },
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
