PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS account (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT
) STRICT;

-- https://dirtsimple.org/2010/11/simplest-way-to-do-tree-based-queries.html
CREATE TABLE IF NOT EXISTS account_parent_child (
  parent_id INTEGER,
  child_id INTEGER,
  depth INTEGER,
  PRIMARY KEY (parent_id, child_id),
  FOREIGN KEY (parent_id) REFERENCES account(id),
  FOREIGN KEY (child_id) REFERENCES account(id)
) STRICT;

CREATE TABLE IF NOT EXISTS financial_transaction (
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
  FOREIGN KEY (transaction_id) REFERENCES financial_transaction(id),
  FOREIGN KEY (account_id) REFERENCES account(id)
) STRICT;

CREATE TRIGGER IF NOT EXISTS account_insert_zero_depth
    AFTER INSERT
    ON account
BEGIN
    INSERT INTO account_parent_child (parent_id, child_id, depth)
    VALUES (NEW.id, NEW.id, 0);
end;

CREATE TRIGGER IF NOT EXISTS account_delete_zero_depth
    BEFORE DELETE
    ON account
BEGIN
    DELETE FROM account_parent_child
    WHERE parent_id = OLD.id AND child_id = OLD.id;
end;