'use strict';

const connect = require('../../utils/mongoose.connect');
require('dotenv').config();
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

const Products = require('../../src/models/products');
const repository = new Products();

describe('The Product Repository', () => {
  beforeAll(() => {
    return connect(MONGODB_URI);
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  it('should post a new product to the db and retreive it', async () => {
    const result = await repository.post({
      category: 'Category 1',
      name: 'Product 1',
      displayName: 'PRODUCT 1',
      description: 'This is the first product',
    });
    expect(result).toBeDefined();
    expect(result.name).toBe('Product 1');
    expect(result.category).toBe('Category 1');
    expect(result._id).toBeDefined();

    const fromDb = await repository.get(result._id);
    expect(fromDb).toBeDefined();
    expect(fromDb._id.toString()).toBe(result._id.toString());
    expect(fromDb.name).toBe('Product 1');
  });

  it('should return null if the id is invalid', async () => {
    const result = await repository.get('this is invalid!');

    expect(result).toBeNull();
  });

  it('should update a product and return that product', async () => {
    const result = await repository.post({
      category: 'Category 1',
      name: 'Product 2',
      displayName: 'PRODUCT 2',
      description: 'This is another product',
    });

    const newParams = {
      category: 'Category 1',
      name: 'Updated Product 2',
      displayName: 'UPDATED PRODUCT 2',
      description: 'This should be an updated product',
    };

    const updatedProduct = await repository.put(result._id, newParams);

    expect(updatedProduct).toBeDefined();
    expect(updatedProduct.name).toBe('Updated Product 2');
  });

  it('should delete a specific product', async () => {
    const result = await repository.post({
      category: 'Category 1',
      name: 'Product 3',
      displayName: 'PRODUCT 2',
      description: 'to be deleted',
    });
    const deleteProduct = await repository.delete(result._id);
    expect(deleteProduct).toBeDefined();
  });
});
