import type { Account } from "$lib/account";
import type { Database } from "better-sqlite3";

export function findAllAccounts(db: Database): Account[] {
  const results: Account[] = db
    .prepare(
      `SELECT descendant_id AS id, GROUP_CONCAT(account.name, ':') AS full_name
             FROM account_closure
                 INNER JOIN account ON account_closure.ancestor_id = account.id
             GROUP BY descendant_id
             ORDER BY ancestor_id, full_name;`
    )
    .all();

    return results;
}