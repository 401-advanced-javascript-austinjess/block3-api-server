const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  role: { type: String, default: 'user', enum: ['admin', 'editor', 'user'] },
});

// This function gets run each time before a user is created
users.pre('save', function(next) {
  // hash the users password (PROMISE)
  bcrypt
    .hash(this.password, 10)
    .then((hashedPassword) => {
      this.password = hashedPassword;
      next();
    })
    .catch(console.error);
});

users.statics.authenticateToken = function(token) {
  try {
    let parsedToken = jwt.verify(token, process.env.SECRET || 'something');
    let query = { _id: parsedToken.id };
    // Search database for user (PROMISE)
    return this.findOne(query);
  } catch (error) {
    return null;
  }
};

users.statics.authenticateBasic = function(auth) {
  let query = { username: auth.username };
  // Search database for user (PROMISE)
  return this.findOne(query)
    .then((user) => user && user.comparePassword(auth.password))
    .catch((error) => {
      throw error;
    });
};

users.methods.comparePassword = function(password) {
  // (PROMISE)
  return bcrypt
    .compare(password, this.password)
    .then((valid) => (valid ? this : null));
};

users.methods.generateToken = function() {
  let token = {
    id: this._id,
    role: this.role,
  };

  // (PROMISE)
  return jwt.sign(token, process.env.SECRET);
};

// 'users' is the name of the colletion in the mongo db
module.exports = mongoose.model('users', users);
