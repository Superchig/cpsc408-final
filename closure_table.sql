-- This should allow us to create a parent-child relationship, but it requires account_parent_child to be set up
INSERT INTO account_parent_child(parent_id, child_id, depth)
SELECT p.parent_id, c.child_id, p.depth + c.depth + 1
  FROM account_parent_child p, account_parent_child c
 WHERE p.child_id = 7 and c.parent_id = 5;

DELETE FROM account_parent_child
WHERE child_id = 5 AND parent_id = 7;

INSERT INTO account_parent_child(parent_id, child_id, depth)
SELECT id, id, 0
FROM account;

SELECT * FROM account_parent_child;