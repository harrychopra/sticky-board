import db from '../db/db.js';

class Note {
  constructor(row) {
    this.id = row.id;
    this.board_id = row.board_id;
    this.contents = row.contents;
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

  serialize() {
    return this;
  }
}

export default Note;
