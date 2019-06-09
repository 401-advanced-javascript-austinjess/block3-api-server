'use strict';

const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');

// 3rd Party Resources
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require('./middleware/error.js');
const notFound = require('./middleware/404.js');

// Prepare the express app
const app = express();

let PORT = process.env.PORT || 3000;

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(categoriesRouter);
app.use(productsRouter);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (PORT) =>
    app.listen(PORT, () => console.log(`Server up on port ${PORT}`)),
};
