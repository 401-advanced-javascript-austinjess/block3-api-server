'use strict';

module.exports = (err, req, res, next) => {
  let error = { error: err };
  console.log(error);
  res.statusCode = 500;
  res.statusMessage = 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(error));
  res.end();
};
