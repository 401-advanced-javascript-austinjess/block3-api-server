'use strict';

const uuid = require('uuid/v4');
const Product = require('./productsSchema');

class Products {
  // constructor() {
  //   this.database = [];
  // }

  get(_id) {
    if (!/^[0-9a-z]{24}$/i.test(_id)) return Promise.resolve(null);

    return Product.findOne({ _id: _id });
  }

  post(entry) {
    const newProduct = new Product(entry);
    return newProduct.save();
  }

  put(_id, entry) {
    return Product.findByIdAndUpdate({ _id }, entry, { new: true });
  }

  delete(_id) {
    return Product.findOneAndDelete({ _id: _id });
  }

  sanitize(entry) {}
}

module.exports = Products;
