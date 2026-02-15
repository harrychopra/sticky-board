import request from 'supertest';
import app from '../../server/app.js';
import db from '../../server/db/db.js';
import resetDB from '../../server/db/migration/resetDB.js';

afterAll(() => db.end());

describe('Notes API', () => {
  let boardId;
  let noteId;

  beforeAll(async () => {
    await resetDB(db);
    const res = await request(app).post('/api/boards').send({
      name: 'Notes Test Board'
    });
    boardId = res.body.id;
  });

  test('POST /api/notes - creates a note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({
        boardId: boardId,
        text: 'Hello world',
        colour: '#FFEB3B',
        author: 'Harry',
        tags: ['#idea']
      });

    expect(res.status).toBe(201);
    expect(res.body.text).toBe('Hello world');
    expect(res.body.tags).toEqual(['#idea']);
    noteId = res.body.id;
  });

  test('PATCH /api/notes/:id - updates note', async () => {
    const res = await request(app).patch(`/api/notes/${noteId}`).send({
      text: 'Updated text',
      posX: 250,
      posY: 300
    });
    expect(res.status).toBe(200);
    expect(res.body.text).toBe('Updated text');
    expect(res.body.posX).toBe(250);
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
