const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  displayName: { type: String, required: true },
  description: { type: String },
});

const Product =
  mongoose.model('product', productSchema) || mongoose.models.category;

module.exports = Product;
