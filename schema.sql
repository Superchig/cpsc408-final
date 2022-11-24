PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS account (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT
) STRICT;

-- https://dirtsimple.org/2010/11/simplest-way-to-do-tree-based-queries.html
CREATE TABLE IF NOT EXISTS account_closure (
  ancestor_id INTEGER,
  descendant_id INTEGER,
  depth INTEGER,
  PRIMARY KEY (ancestor_id, descendant_id),
  FOREIGN KEY (ancestor_id) REFERENCES account(id),
  FOREIGN KEY (descendant_id) REFERENCES account(id)
) STRICT;

CREATE TABLE IF NOT EXISTS financial_transaction (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT,
  description TEXT,
  priority INTEGER
) STRICT;

-- Represents a debit or a credit
CREATE TABLE IF NOT EXISTS debit_credit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER,
  transaction_id INTEGER,
  account_id INTEGER,
  priority INTEGER,
  FOREIGN KEY (transaction_id) REFERENCES financial_transaction(id),
  FOREIGN KEY (account_id) REFERENCES account(id)
) STRICT;

CREATE TRIGGER IF NOT EXISTS account_insert_zero_depth
    AFTER INSERT
    ON account
BEGIN
    INSERT INTO account_closure (ancestor_id, descendant_id, depth)
    VALUES (NEW.id, NEW.id, 0);
end;

CREATE TRIGGER IF NOT EXISTS account_delete_zero_depth
    BEFORE DELETE
    ON account
BEGIN
    DELETE FROM account_closure
    WHERE ancestor_id = OLD.id AND descendant_id = OLD.id;
end;