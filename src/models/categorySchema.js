'use strict';

const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  displayName: { type: String, required: true },
  description: { type: String, required: true },
});

const Category =
  mongoose.models.category || mongoose.model('category', categorySchema);

Category.schema.pre('save', (next) => {
  this.name === this.name.toUpperCase();

  next();
});

module.exports = Category;
