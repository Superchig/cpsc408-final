DELETE FROM account_parent_child
WHERE parent_id = 11 AND child_id = 9;

SELECT * FROM account_parent_child;

SELECT * FROM account_parent_child p
CROSS JOIN account_parent_child c
WHERE p.child_id = 12 AND c.parent_id = 13;

-- https://stackoverflow.com/questions/31485457/sqlite-concatenating-column-values
SELECT GROUP_CONCAT(account.name, ':') AS full_name
FROM account_parent_child
INNER JOIN account ON account_parent_child.parent_id = account.id
WHERE child_id = 14
ORDER BY depth;

SELECT account.name AS ancestor_name, account_parent_child.child_id
FROM account_parent_child
INNER JOIN account ON account_parent_child.parent_id = account.id
WHERE child_id = 14
ORDER BY depth;

SELECT child_id AS id, GROUP_CONCAT(account.name, ':') AS full_name
FROM account_parent_child
INNER JOIN account ON account_parent_child.parent_id = account.id
GROUP BY child_id
ORDER BY parent_id, full_name;

DELETE FROM account_parent_child;
DELETE FROM account;