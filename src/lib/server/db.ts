import DatabaseConstructor, { type Database } from "better-sqlite3";

// This allows us to cache a database connection
let db: Database | null = null;

export function getDB(): Database {
    if (db == null) {
        db = new DatabaseConstructor('database.db');
        console.log('Database opened.');
    }

    return db;
}

// TODO(Chris): Move this to hooks.server.ts
// https://stackoverflow.com/questions/74020726/how-to-shutdown-gracefully-in-sveltekit
process.on('exit', (code) => {
    closeDB();
});

process.on('SIGINT', () => {
    process.exit();
});

function closeDB() {
    if (db == null) {
        return;
    }

    db.close();

    console.log('Database closed.');
}