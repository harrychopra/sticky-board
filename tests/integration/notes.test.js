import request from 'supertest';
import app from '../../server/app.js';
import db from '../../server/db/db.js';
import createSchema from '../../server/db/migration/create-schema.js';

afterAll(() => db.end());

describe('Notes API', () => {
  let boardId;
  let noteId;

  beforeAll(async () => {
    await createSchema();
    const res = await request(app).post('/api/boards').send({
      name: 'Notes Test Board'
    });
    boardId = res.body.id;
  });

  test('POST /api/notes - creates a note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({
        board_id: boardId,
        contents: 'Hello world',
        colour: '#FFEB3B',
        author: 'Harry',
        tags: ['#idea']
      });

    expect(res.status).toBe(201);
    expect(res.body.contents).toBe('Hello world');
    expect(res.body.tags).toEqual(['#idea']);
    noteId = res.body.id;
  });

  test('DELETE /api/notes/:id - deletes note', async () => {
    const res = await request(app).delete(`/api/notes/${noteId}`);
    expect(res.status).toBe(204);
  });

  test('GET /api/notes/:id - 404 after deletion', async () => {
    const res = await request(app).get(`/api/notes/${noteId}`);
    expect(res.status).toBe(404);
  });
});
