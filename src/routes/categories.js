var express = require('express');
var router = express.Router();
let auth = require('../auth/middleware');
const Categories = require('../models/categories');
const categories = new Categories();

router.get('/categories', getCategories);
// CREATE
router.post('/categories', auth('create'), postCategories);
router.get('/categories/:id', getCategory);
// UPDATE
router.put('/categories/:id', auth('update'), putCategories);
// DELETE
router.delete('/categories/:id', auth('delete'), deleteCategories);

// ROUTE HANDLER FUNCTIONS
function getCategories(request, response, next) {
  // expects an array of object to be returned from the model
  categories
    .getAll()
    .then((data) => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch(next);
}

function getCategory(request, response, next) {
  // expects an array with the one matching record from the model
  categories
    .get(request.params.id)
    .then((result) => response.status(200).json(result))
    .catch(next);
}

function postCategories(request, response, next) {
  // expects the record that was just added to the database
  categories
    .post(request.body)
    .then((result) => response.status(200).json(result))
    .catch(next);
}

function putCategories(request, response, next) {
  // expects the record that was just updated in the database
  categories
    .put(request.params.id, request.body)
    .then((result) => response.status(200).json(result))
    .catch(next);
}

function deleteCategories(request, response, next) {
  // Expects no return value (resource was deleted)
  categories
    .delete(request.params.id)
    .then((result) => response.status(200).json(result))
    .catch(next);
}

module.exports = router;
