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

-- Triggers

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

-- Create view - Represent all of the debit/credits for a transaction,
-- with associated information on the relevant accounts and transactions

CREATE VIEW full_transaction_view AS
SELECT financial_transaction.id AS transaction_id,
       financial_transaction.description AS transaction_description,
       financial_transaction.date AS transaction_date,
       debit_credit.id AS debit_credit_id,
       debit_credit.amount AS debit_credit_amount,
       debit_credit.account_id
FROM financial_transaction
         INNER JOIN debit_credit on financial_transaction.id = debit_credit.transaction_id
         INNER JOIN account on debit_credit.account_id = account.id;

-- Indexes on commonly-queried attributes

CREATE INDEX financial_transaction_date_idx
    ON financial_transaction(date);

-- Indexes on foreign keys

CREATE INDEX debit_credit_financial_transaction_idx
    ON debit_credit(transaction_id);

CREATE INDEX debit_credit_account_idx
    ON debit_credit(account_id);

CREATE INDEX account_closure_ancestor_idx
    ON account_closure(ancestor_id);

CREATE INDEX account_closure_descendant_idx
    ON account_closure(descendant_id);