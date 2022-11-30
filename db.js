import { readFileSync, unlinkSync, existsSync } from 'fs';
import Database from 'better-sqlite3';

const DATABASE_PATH = 'database.db';

// The first two items in process.argv are the node binary and the script path
const args = process.argv.slice(2);

const createDB = () => {
  const db = new Database(DATABASE_PATH);

  const schema_sql = readFileSync('schema.sql').toString();
  // https://github.com/WiseLibs/better-sqlite3/blob/HEAD/docs/api.md#execstring---this
  db.exec(schema_sql);

  console.log('Database created.');

  db.close();
};

const insertDB = () => {
  const db = new Database(DATABASE_PATH);

  db.prepare(
    `INSERT INTO account(name)
     VALUES ('assets'), ('liabilities'), ('equity'), ('revenue'), ('expenses');`
  ).run();

  console.log('Data inserted.');

  db.close();
};

if (args[0] == 'create') {
  createDB();
} else if (args[0] == 'insert') {
  insertDB();
} else if (args[0] == 'reset') {
  if (existsSync(DATABASE_PATH)) {
    unlinkSync(DATABASE_PATH);

    console.log('Database deleted.');
  }

  createDB();
  insertDB();
} else {
  console.log('Usage: npm run db create/insert/reset');
}
