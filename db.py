from sqlite3 import connect
from pathlib import Path

DATABASE = "database.db"

if __name__ == '__main__':
    db = connect(DATABASE)

    try:
        schema_sql = Path("schema.sql").read_text()
        
        cur = db.cursor()

        cur.executescript(schema_sql)

        db.commit()
    finally:
        db.close()
