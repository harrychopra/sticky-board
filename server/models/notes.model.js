import { v4 as uuid } from 'uuid';
import db from '../db/db.js';

class Note {
  constructor(row) {
    this.id = row.id;
    this.board_id = row.board_id;
    this.text = row.text;
    this.colour = row.colour;
    this.pos_x = row.pos_x;
    this.pos_y = row.pos_y;
    this.width = row.width;
    this.height = row.height;
    this.author = row.author;
    this.tags = row.tags;
    this.created_at = row.created_at;
    this.updated_at = row.updated_at;
  }

  static async findByBoardId(id) {
    const { rows } = await db.query(`select * from notes where board_id = $1`, [
      id
    ]);
    return rows.map(row => new Note(row));
  }

  static async findById(id) {
    const { rows } = await db.query(`select * from notes where id = $1`, [id]);
    return rows.length === 1 ? new Note(rows[0]) : null;
  }

  static async create(
    {
      board_id,
      text = '',
      colour = '#FFEB3B',
      pos_x = 100,
      pos_y = 100,
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
        id, board_id, text, colour, pos_x, pos_y, width, height, author, tags
      ) values (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) returning *
    `,
      [
        id,
        board_id,
        text,
        colour,
        pos_x,
        pos_y,
        width,
        height,
        author,
        tags
      ]
    );
    return rows.length === 1 ? new Note(rows[0]) : null;
  }

  static async deleteById(id) {
    const { rowCount } = await db.query(`DELETE FROM notes WHERE id = $1`, [
      id
    ]);
    return rowCount > 0;
  }

  async update(fields) {
    const allowedFields = [
      'text',
      'color',
      'pos_x',
      'pos_y',
      'width',
      'height',
      'tags'
    ];
    const fieldsToUpdate = {};

    for (const key of allowedFields) {
      if (fields[key] !== undefined) {
        fieldsToUpdate[key] = fields[key];
      }
    }

    const placeholders = [];
    const values = Object.entries(fieldsToUpdate).map(([key, val], i) => {
      placeholders.push(`${key} = $${i + 1}`);
      return val;
    });

    const query = `update notes set ${placeholders.join(', ')} where id = $${
      placeholders.length + 1
    } returning *`;

    values.push(this.id);

    const { rows } = await db.query(query, values);
    return rows.length === 1 ? new Note(rows[0]) : null;
  }

  serialize() {
    return this;
  }
}

export default Note;
