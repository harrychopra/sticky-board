import { v4 as uuid } from 'uuid';
import db from '../db/db.js';
import Notes from './notes.model.js';

class Note {
  constructor(row) {
    this.id = row.id;
    this.boardId = row.board_id;
    this.text = row.text;
    this.color = row.color;
    this.posX = row.pos_x;
    this.posY = row.pos_y;
    this.zIndex = row.z_index;
    this.width = row.width;
    this.height = row.height;
    this.author = row.author;
    this.tags = row.tags;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }

  static async findByBoardId(id) {
    const { rows } = await db.query(`select * from notes where board_id = $1`, [
      id
    ]);
    return new Notes(rows);
  }

  static async findById(id) {
    const { rows } = await db.query(`select * from notes where id = $1`, [id]);
    return rows.length === 1 ? new Note(rows[0]) : null;
  }

  static async create(
    {
      boardId,
      text = '',
      color = '#FFEB3B',
      posX = 100,
      posY = 100,
      zIndex = 0,
      width = 200,
      height = 200,
      author = 'Anonymous',
      tags = []
    }
  ) {
    const id = uuid();
    const { rows } = await db.query(
      `--sql
      insert into notes (
        id, board_id, text, color, pos_x, pos_y, z_index, width, height, author, tags
      ) values (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) returning *
    `,
      [
        id,
        boardId,
        text,
        color,
        posX,
        posY,
        zIndex,
        width,
        height,
        author,
        tags
      ]
    );
    return rows.length === 1 ? new Note(rows[0]) : null;
  }

  async update(fields) {
    const allowedFields = {
      text: 'text',
      color: 'color',
      posX: 'pos_x',
      posY: 'pos_y',
      zIndex: 'z_index',
      width: 'width',
      height: 'height',
      tags: 'tags'
    };

    const setClause = ['updated_at = NOW()'];
    const values = [];

    let placeholderIdx = 0;

    Object.entries(allowedFields).forEach(([field, column]) => {
      const value = fields[field];
      if (value === undefined) return;

      setClause.push(`${column} = $${++placeholderIdx}`);
      values.push(value);
    });

    const query = `--sql
      update notes
      set ${setClause.join(', ')}
      where id = $${++placeholderIdx}
      returning *
    `;

    values.push(this.id);

    const { rows } = await db.query(query, values);
    return rows.length === 1 ? new Note(rows[0]) : null;
  }

  delete() {
    return db.query(`DELETE FROM notes WHERE id = $1`, [this.id]);
  }

  toJSON() {
    return this;
  }
}

export default Note;
