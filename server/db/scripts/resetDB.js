import db from '../db.js';
import resetDB from '../migration/resetDB.js';

try {
  await resetDB(db);
} catch (err) {
  console.error(err);
} finally {
  db.end();
}
