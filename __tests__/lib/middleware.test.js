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
  const adminUser = await new Users(users.admin).save();
  const editorUser = await new Users(users.editor).save();
  const userUser = await new Users(users.user).save();
});

afterAll(supergoose.stopDB);

describe('Auth Middleware', () => {
  let cachedToken;
  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // admin:foo: YWRtaW46Zm9v

  const errorObject = {
    message: 'Invalid Username/Password',
    status: 401,
    statusMessage: 'Unauthorized',
  };

  it('returns 401 for invalid bearer token', async () => {
    let req = {
      headers: {
        authorization: 'Bearer invalid',
      },
    };
    let res = {};
    let next = jest.fn();
    let middleware = auth;

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(errorObject);
    expect(req.user).not.toBeDefined();
  });

  it('logs in an admin user with the correct credientials', async () => {
    let req = {
      headers: {
        authorization: 'Bearer YWRtaW46cGFzc3dvcmQ=',
      },
    };
    let res = {};
    let next = jest.fn();
    let middleware = auth;

    await middleware(req, res, next).then(() => {
      cachedToken = req.token;
      expect(next).toHaveBeenCalledWith();
    });
  });

  it('returns 200 with token for valid Bearer token', async () => {
    let req = {
      headers: {
        authorization: `Bearer ${cachedToken}`,
      },
    };
    let res = {};
    let next = jest.fn();
    let middleware = auth;

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toBeDefined();
  });
});
