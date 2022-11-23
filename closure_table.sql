SELECT COUNT(*) - 1 AS count_children
FROM account_closure
WHERE ancestor_id = 25;

DELETE FROM account_closure
WHERE ancestor_id = 27 OR descendant_id = 27;

DELETE FROM account_closure p, account_closure link, account_closure c, account_closure to_delete
 WHERE p.parent = link.parent      AND c.child = link.child
   AND p.child  = to_delete.parent AND c.parent= to_delete.child
   AND (to_delete.parent=TO_DELETE OR to_delete.child=TO_DELETE)
   AND to_delete.depth < 2;

SELECT DISTINCT link.descendant_id
FROM account_closure p
    CROSS JOIN account_closure c
    CROSS JOIN account_closure link
    CROSS JOIN account_closure to_delete
WHERE p.ancestor_id = link.ancestor_id AND c.descendant_id = link.descendant_id
    AND p.descendant_id = to_delete.ancestor_id AND c.ancestor_id = to_delete.descendant_id
    AND (to_delete.ancestor_id = 34 OR to_delete.descendant_id = 34);

SELECT *
FROM account_closure p
    INNER JOIN account_closure c ON p.descendant_id = c.ancestor_id
    AND (p.ancestor_id = 36 OR c.descendant_id = 36);

-- SQLite can't handle JOINs with DELETEs
-- https://stackoverflow.com/questions/4967135/deleting-rows-from-sqlite-table-when-no-match-exists-in-another-table
-- The RETURNING clause exists in SQLite version 3.35.0 (2021-03-12) and later
-- https://www.sqlite.org/lang_returning.html
-- This query will get rid of all closures involving account 34
DELETE FROM account_closure
WHERE ROWID IN
(SELECT link.ROWID
FROM account_closure p
    CROSS JOIN account_closure c
    CROSS JOIN account_closure link
    CROSS JOIN account_closure to_delete
WHERE p.ancestor_id = link.ancestor_id AND c.descendant_id = link.descendant_id
    AND p.descendant_id = to_delete.ancestor_id AND c.ancestor_id = to_delete.descendant_id
    AND (to_delete.ancestor_id = 36 OR to_delete.descendant_id = 36))
RETURNING descendant_id;

DELETE FROM account
WHERE id IN (40, 41);

SELECT *
FROM account
    LEFT JOIN account_closure ON account.id = account_closure.descendant_id;

DELETE FROM account
WHERE id = 43;

SELECT * FROM account_closure;
SELECT * FROM account;

DELETE FROM account_closure;
DELETE FROM account;

SELECT * FROM financial_transaction;
DELETE FROM financial_transaction;

SELECT * FROM debit_credit
    INNER JOIN account a on debit_credit.account_id = a.id;
DELETE FROM debit_credit;