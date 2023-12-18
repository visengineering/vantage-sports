const request = require('supertest');

import { beforeAction, afterAction } from '../../helpers/setup';
const { getAccessToken } = require('../../helpers/getAccessToken');

let api: any;
let token: any;

beforeAll(async () => {
  api = await beforeAction();
  token = await getAccessToken();
});

afterAll(() => {
  afterAction();
});

test('User | query', async () => {
  const query = `
    {
      user {
        id
        username
        notes {
          id
          note
        }
      }
    }
  `;

  const res = await request(api)
    .post('/graphql')
    .set('Accept', /json/)
    .set({
      Authorization: `Bearer ${token}`,
    })
    .send({ query })
    .expect(200)
    .expect('Content-Type', /json/);

  expect(res.body.data.user[0].username).toBe('test');
  expect(res.body.data.user[0].notes).toEqual([]);
});
