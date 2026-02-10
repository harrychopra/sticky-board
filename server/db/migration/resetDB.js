const schemaQueries = [
  `DROP INDEX IF EXISTS idx_snapshots_board_id`,

  `DROP INDEX IF EXISTS idx_notes_board_id`,

  `DROP TABLE IF EXISTS snapshots`,

  `DROP TABLE IF EXISTS notes`,

  `DROP TABLE IF EXISTS boards`,

  `CREATE TABLE IF NOT EXISTS boards (
      id text PRIMARY KEY,
      name text NOT NULL,
      pin text,
      template text NOT NULL DEFAULT 'blank',
      created_at timestamp DEFAULT current_timestamp,
      updated_at timestamp DEFAULT current_timestamp
    )`,

  `CREATE TABLE IF NOT EXISTS notes (
      id text PRIMARY KEY,
      board_id text NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
      text text NOT NULL DEFAULT '',
      colour text NOT NULL DEFAULT '#FFEB3B',
      pos_x int NOT NULL DEFAULT 100,
      pos_y int NOT NULL DEFAULT 100,
      width int NOT NULL DEFAULT 200,
      height int NOT NULL DEFAULT 200,
      author text NOT NULL DEFAULT 'Anonymous',
      tags text[] NOT NULL DEFAULT '{}',
      created_at timestamp DEFAULT current_timestamp,
      updated_at timestamp DEFAULT current_timestamp
    )`,

  `CREATE TABLE IF NOT EXISTS snapshots (
      id text PRIMARY KEY,
      board_id text NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
      name text NOT NULL,
      state text NOT NULL,
      created_at timestamp DEFAULT current_timestamp
    )`,

  `CREATE INDEX idx_notes_board_id ON notes (board_id)`,

  `CREATE INDEX idx_snapshots_board_id ON snapshots (board_id)`
];

const resetDB = async db => {
  try {
    for (const query of schemaQueries) {
      await db.query(query);
    }
  } catch (err) {
    console.error('Schema creation failed:', err);
    throw err;
  }
};

export default resetDB;
