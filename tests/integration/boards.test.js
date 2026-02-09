import request from 'supertest';
import app from '../../server/app.js';
import db from '../../server/db/db.js';
import createSchema from '../../server/db/migration/create-schema.js';

beforeAll(() => createSchema());
afterAll(() => db.end());

describe('Boards API', () => {
  let boardId;

  test('POST /api/boards - creates a board', async () => {
    const res = await request(app)
      .post('/api/boards')
      .send({ name: 'Test Board', template: 'blank' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test Board');
    expect(res.body.id).toBeDefined();
    expect(res.body.pin).toBeUndefined();
    boardId = res.body.id;
  });

  test('GET /api/boards/:id - returns board', async () => {
    const res = await request(app).get(`/api/boards/${boardId}`);
    expect(res.status).toBe(200);
    expect(res.body.notes).toBeInstanceOf(Array);
  });

  test('DELETE /api/boards/:id - deletes board', async () => {
    const res = await request(app).delete(`/api/boards/${boardId}`);
    expect(res.status).toBe(204);
  });

  test('GET /api/boards/:id - 404 after deletion', async () => {
    const res = await request(app).get(`/api/boards/${boardId}`);
    expect(res.status).toBe(404);
  });
});
