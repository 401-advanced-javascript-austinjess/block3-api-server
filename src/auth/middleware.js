const User = require('./users-model.js');

module.exports = (capability) => {
  return (req, res, next) => {
    // const _authHandler = (module.exports = (req, res, next) => {
    try {
      // Grab the authType and the token from the request headers
      let [authType, authString] = req.headers.authorization.split(/\s+/);

      switch (authType.toLowerCase()) {
      case 'basic':
        return _authBasic(authString);
      case 'bearer':
        return _authBearer(authString);
      default:
        return _authError();
      }
    } catch (err) {
      // next(err);
      return _authError();
    }

    // Handle the bearer header to pull and verify the token
    async function _authBearer(token) {
      let user = await User.authenticateToken(token);
      await _authenticate(user);
    }

    async function _authBasic(str) {
      let base64Buffer = Buffer.from(str, 'base64');
      let bufferString = base64Buffer.toString();
      let [username, password] = bufferString.split(':');
      let auth = { username, password };

      await User.authenticateBasic(auth)
        .then((user) => _authenticate(user))
        .catch(next);
    }

    // Send the user and the generated token in the results object
    async function _authenticate(user) {
      if (!user) return _authError();
      req.user = user;
      req.token = user.generateToken();
      next();
    }

    // If we ever run into an error
    async function _authError() {
      next({
        status: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid Username/Password',
      });
    }
  };
};
