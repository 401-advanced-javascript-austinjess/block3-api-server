var express = require('express');
var router = express.Router();

const Products = require('../models/products.js');
const products = new Products();

router.get('/products', getProducts);
router.post('/products', postProducts);
router.get('/products/:id', getProduct);
router.put('/products/:id', putProducts);
router.delete('/products/:id', deleteProducts);

function getProducts(request, response, next) {
  // expects an array of objects back
  products
    .get()
    .then((data) => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch(next);
}

function getProduct(request, response, next) {
  // expects an array with one object in it
  products
    .get(request.params.id)
    .then((result) => response.status(200).json(result[0]))
    .catch(next);
}

function postProducts(request, response, next) {
  // expects the record that was just added to the database
  products
    .post(request.body)
    .then((result) => response.status(200).json(result))
    .catch(next);
}

function putProducts(request, response, next) {
  // expects the record that was just updated in the database
  products
    .put(request.params.id, request.body)
    .then((result) => response.status(200).json(result))
    .catch(next);
}

function deleteProducts(request, response, next) {
  // Expects no return value (the resource should be gone)
  products
    .delete(request.params.id)
    .then((result) => response.status(200).json(result))
    .catch(next);
}

module.exports = router;
