SELECT COUNT(*) - 1 AS count_children
FROM account_parent_child
WHERE parent_id = 25;

DELETE FROM account_parent_child;
DELETE FROM account;