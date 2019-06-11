const server = require('../../src/app').server;
const supergoose = require('../../__tests__/lib/supergoose');

const mockRequest = supergoose.server(server);

const Role = require('../../src/auth/roles.model');
const User = require('../../src/auth/users-model');

let roles = [
  { role: 'admin', capabilities: ['create', 'update', 'delete', 'read'] },
  { role: 'editor', capabilities: ['create', 'update', 'read'] },
  { role: 'user', capabilities: ['create', 'read'] },
];

let users = {
  admin: new User({ username: 'admin', password: 'password', role: 'admin' }),
  editor: new User({
    username: 'editor',
    password: 'password',
    role: 'editor',
  }),
  user: new User({ username: 'user', password: 'password', role: 'user' }),
};

beforeAll(async () => {
  await supergoose.startDB();
  await Promise.all(
    Object.values(roles).map((role) => {
      return new Role(role).save();
    })
  );
  await Promise.all(
    Object.values(users).map((user) => {
      return new User(user).save();
    })
  );
});

afterAll(async () => {
  supergoose.stopDB();
});

describe('The Protected Routes', () => {
  describe('The GET routes', () => {
    it('categories - anyone can access', async () => {
      return mockRequest.get('/categories').expect(200);
    });
    it('products - anyone can access', async () => {
      return mockRequest.get('/products').expect(200);
    });
  });

  describe('The POST routes', () => {
    it('restricts access to route if user isnt authorized', async () => {
      return mockRequest.post('/categories').expect(401);
    });
    it('categories - must have CREATE capability', async () => {
      console.log(users);
      return mockRequest
        .post('/categories')
        .send({
          name: 'Random',
          displayName: 'Random',
          description: 'Category for all random things',
        })
        .set('Authorization', `Bearer ${users.editor.generateToken()}`)
        .expect(200);
    });

    it('products - must have the CREATE capability', async () => {
      console.log(users);
      return mockRequest
        .post('/products')
        .send({
          name: 'PS4',
          displayName: 'PS4',
          description: 'Gaming engine',
          category: 'Games',
        })
        .set('Authorization', `Bearer ${users.editor.generateToken()}`)
        .expect(200);
    });

    describe('The PUT routes', () => {
      it('restricts access to route if user isnt authorized', async () => {
        return mockRequest
          .put('/categories/5d001dd687aef19634d57fdf')
          .expect(401);
      });

      it('categories - must have the UPDATE capability', async () => {
        return mockRequest
          .put('/categories/5d001e1987aef19634d57fe0')
          .send({
            _id: `5d001e1987aef19634d57fe0`,
            name: 'Video Games',
            displayName: 'Video Games',
            description: 'Video Games Category',
          })
          .set('Authorization', `Bearer ${users.editor.generateToken()}`)
          .expect(200);
      });
    });

    describe('The DELETE routes', () => {
      it('restricts access to route if user isnt authorized', async () => {
        return mockRequest
          .delete('/categories/5d001ed387aef19634d57fe1')
          .expect(401);
      });

      it('categories - must have the DELETE capability', async () => {
        return mockRequest
          .delete('/categories/5d001ed387aef19634d57fe1')
          .set('Authorization', `Bearer ${users.admin.generateToken()}`)
          .expect(200);
      });
    });
  });
});
