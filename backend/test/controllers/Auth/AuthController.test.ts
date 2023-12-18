const request = require('supertest');

const { beforeAction, afterAction } = require('../../helpers/setup');
const { User } = require('../../../api/models');

let api;

beforeAll(async () => {
  api = await beforeAction();
});

afterAll(() => {
  afterAction();
});

test('AuthController | /rest/login', async () => {
  const user = await User.create({
    email: 'herbert@mail.com',
    password: 'securepassword',
  });

  const res = await request(api)
    .post('/rest/login')
    .set('Accept', /json/)
    .send({
      email: 'herbert@mail.com',
      password: 'securepassword',
    })
    .expect(200);

  expect(res.body.token).toBeTruthy();
  expect(user).toBeTruthy();

  await user.destroy();
});

test('AuthController | /rest/validate | isValid === true', async () => {
  const user = await User.create({
    email: 'herbert@mail.com',
    password: 'securepassword',
  });

  const res = await request(api)
    .post('/rest/login')
    .set('Accept', /json/)
    .send({
      email: 'herbert@mail.com',
      password: 'securepassword',
    })
    .expect(200);

  const res2 = await request(api)
    .post('/rest/validate')
    .set('Accept', /json/)
    .send({
      token: res.body.token,
    })
    .expect(200);

  expect(res.body.token).toBeTruthy();
  expect(user).toBeTruthy();

  expect(res2.body.isvalid).toBeTruthy();

  await user.destroy();
});

test('AuthController | /rest/validate | isValid === false', async () => {
  const res = await request(api)
    .post('/rest/validate')
    .set('Accept', /json/)
    .send({
      token: 'Bearer <token>',
    })
    .expect(401);

  expect(res.body.isvalid).toBeFalsy();
});
