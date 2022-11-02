PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS account (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS money_transaction (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT,
  priority INTEGER
) STRICT;

-- Represents a debit or a credit
CREATE TABLE IF NOT EXISTS debit_credit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER,
  transaction_id INTEGER,
  account_id INTEGER,
  priority INTEGER,
  FOREIGN KEY (transaction_id) REFERENCES money_transaction(id),
  FOREIGN KEY (account_id) REFERENCES account(id)
) STRICT;