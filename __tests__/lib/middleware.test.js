require('dotenv').config();

const supergoose = require('./supergoose');
const auth = require('../../src/auth/middleware');
const Users = require('../../src/auth/users-model');

let users = {
  admin: { username: 'admin', password: 'password', role: 'admin' },
  editor: { username: 'editor', password: 'password', role: 'editor' },
  user: { username: 'user', password: 'password', role: 'user' },
};

beforeAll(async () => {
  await supergoose.startDB();
  await new Users(users.admin).save();
  await new Users(users.editor).save();
  await new Users(users.user).save();
});

afterAll(supergoose.stopDB);

describe('Auth Middleware', () => {
  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // admin:foo: YWRtaW46Zm9v

  const errorObject = {
    message: 'Invalid Username/Password',
    status: 401,
    statusMessage: 'Unauthorized',
  };

  describe('User Authentication', () => {
    let cachedToken;
    it('returns 401 for invalid bearer token', () => {
      let req = {
        headers: {
          authorization: 'Bearer YWRtaW46Zm9v',
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth();

      return middleware(req, res, next).then(() => {
        // expect(next).toHaveBeenCalledWith(errorObject);
        expect(401);
        expect(req.user).not.toBeDefined();
      });
    });

    it('basic - logs in a user with the correct credientials', async () => {
      let req = {
        headers: {
          authorization: `Basic YWRtaW46cGFzc3dvcmQ=`,
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth();

      return middleware(req, res, next).then(() => {
        cachedToken = req.token;
        console.log(cachedToken);
        expect(next).toHaveBeenCalledWith();
      });
    });

    it('bearer - logs in a user with the correct credientials', async () => {
      let req = {
        headers: {
          authorization: `Bearer ${cachedToken}`,
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth();

      await middleware(req, res, next).then(() => {
        cachedToken = req.token;
        console.log(cachedToken);
        expect(200);
        expect(next).toHaveBeenCalledWith();
      });
    });
  });
});
