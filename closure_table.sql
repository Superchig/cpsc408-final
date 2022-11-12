SELECT COUNT(*) - 1 AS count_children
FROM account_parent_child
WHERE parent_id = 25;

DELETE FROM account_parent_child
WHERE parent_id = 27 OR child_id = 27;

DELETE FROM account_parent_child p, account_parent_child link, account_parent_child c, account_parent_child to_delete
 WHERE p.parent = link.parent      AND c.child = link.child
   AND p.child  = to_delete.parent AND c.parent= to_delete.child
   AND (to_delete.parent=TO_DELETE OR to_delete.child=TO_DELETE)
   AND to_delete.depth < 2;

SELECT DISTINCT link.child_id
FROM account_parent_child p
    CROSS JOIN account_parent_child c
    CROSS JOIN account_parent_child link
    CROSS JOIN account_parent_child to_delete
WHERE p.parent_id = link.parent_id AND c.child_id = link.child_id
    AND p.child_id = to_delete.parent_id AND c.parent_id = to_delete.child_id
    AND (to_delete.parent_id = 34 OR to_delete.child_id = 34);

SELECT *
FROM account_parent_child p
    INNER JOIN account_parent_child c ON p.child_id = c.parent_id
    AND (p.parent_id = 36 OR c.child_id = 36);

-- SQLite can't handle JOINs with DELETEs
-- https://stackoverflow.com/questions/4967135/deleting-rows-from-sqlite-table-when-no-match-exists-in-another-table
-- The RETURNING clause exists in SQLite version 3.35.0 (2021-03-12) and later
-- https://www.sqlite.org/lang_returning.html
-- This query will get rid of all closures involving account 34
DELETE FROM account_parent_child
WHERE ROWID IN
(SELECT link.ROWID
FROM account_parent_child p
    CROSS JOIN account_parent_child c
    CROSS JOIN account_parent_child link
    CROSS JOIN account_parent_child to_delete
WHERE p.parent_id = link.parent_id AND c.child_id = link.child_id
    AND p.child_id = to_delete.parent_id AND c.parent_id = to_delete.child_id
    AND (to_delete.parent_id = 36 OR to_delete.child_id = 36))
RETURNING child_id;

DELETE FROM account
WHERE id IN (40, 41);

SELECT *
FROM account
    LEFT JOIN account_parent_child ON account.id = account_parent_child.child_id;

DELETE FROM account
WHERE id = 43;

SELECT * FROM account_parent_child;
SELECT * FROM account;

DELETE FROM account_parent_child;
DELETE FROM account;