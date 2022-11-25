import { readFileSync } from 'fs';
import Database from 'better-sqlite3';

const db = new Database('database.db');

// The first two items in process.argv are the node binary and the script path
const args = process.argv.slice(2);

if (args[0] == 'create') {
  console.log('Database created.');

  const schema_sql = readFileSync('schema.sql').toString();

  // https://github.com/WiseLibs/better-sqlite3/blob/HEAD/docs/api.md#execstring---this
  db.exec(schema_sql);
} else if (args[0] == 'insert') {
  db.prepare(
    `INSERT INTO account(name)
     VALUES ('assets'), ('liabilities'), ('equity'), ('revenue'), ('expenses');`
  ).run();

  console.log('Data inserted.');
} else {
  console.log('Usage: npm run db insert/create');
}
