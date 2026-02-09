import { v4 as uuid } from 'uuid';
import db from '../db/db.js';

class Board {
  constructor(
    { id, name, pin = null, template = 'blank', created_at, updated_at }
  ) {
    this.id = id;
    this.name = name;
    this.pin = pin;
    this.template = template;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static async findById(id) {
    const { rows } = await db.query(`select * from boards where id = $1`, [id]);
    return rows.length === 1 ? new Board(rows[0]) : null;
  }

  static async findAll() {
    const { rows } = await db.query(
      `select * from boards ORDER BY created_at DESC`
    );
    return rows.map(row => new Board(row));
  }

  static async create({ name, pin = null, template = 'blank' }) {
    const id = uuid();
    const { rows } = await db.query(
      `--sql
      insert into boards (
        id, name, pin, template
      ) values (
        $1, $2, $3, $4
      ) returning *
    `,
      [id, name, pin, template]
    );
    return rows.length === 1 ? new Board(rows[0]) : null;
  }

  static async deleteById(id) {
    const { rowCount } = await db.query(`DELETE FROM boards WHERE id = $1`, [
      id
    ]);
    return rowCount > 0;
  }

  serialize() {
    const { pin, ...safe } = this;
    return safe;
  }
}

export default Board;
