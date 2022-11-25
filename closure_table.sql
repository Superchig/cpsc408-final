SELECT a.id,
       (SELECT GROUP_CONCAT(ordered_ancestor.name, ':')
        FROM (SELECT account.name AS name
              FROM account_closure
                  INNER JOIN account ON account.id = account_closure.ancestor_id
              WHERE descendant_id = a.id
              ORDER BY depth DESC) AS ordered_ancestor) AS full_name
FROM account a
ORDER BY full_name;

SELECT GROUP_CONCAT(ordered_ancestor.name, ':') AS full_name
FROM (SELECT account.name AS name
      FROM account_closure
         INNER JOIN account ON account.id = account_closure.ancestor_id
      WHERE descendant_id = 7
      ORDER BY depth DESC) AS ordered_ancestor;

SELECT *
FROM account_closure
    INNER JOIN account ON account.id = account_closure.ancestor_id
WHERE descendant_id = 7
ORDER BY depth DESC;

SELECT *
FROM account_closure;

SELECT *
FROM account;