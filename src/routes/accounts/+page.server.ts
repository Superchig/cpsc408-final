import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { getDB } from '$lib/server/db';
import { findAllAccounts } from '$lib/server/accounts';

export const load: PageServerLoad = async ({ params }) => {
  const db = getDB();

  const results = findAllAccounts(db);

  return structuredClone({
    accounts: results
  });
};

export const actions: Actions = {
  create_child_account: async (event) => {
    const data = await event.request.formData();
    const parentAccountId = data.get('parent_account_id');
    const newAccountName = data.get('new_account_name');

    const db = getDB();

    db.transaction(() => {
      const { lastInsertRowid } = db
        .prepare('INSERT INTO account(name) VALUES (?);')
        .run(newAccountName);

      // NOTE(Chris): By using a cross join of the parent and the child, we will
      // place all of our desired ancestor accounts' IDs into p.ancestor_id. We
      // will also place all of the IDs of the descendants of our new account
      // (including the account's own ID) into c.descendant_id.
      // In this specific case, our freshly-made account will have no descendants
      // (besides itself), so its own ID will be its only descendant.
      db.prepare(
        `INSERT INTO account_closure(ancestor_id, descendant_id, depth)
                 SELECT p.ancestor_id, c.descendant_id, p.depth + c.depth + 1
                 FROM account_closure p
                     CROSS JOIN account_closure c
                 WHERE p.descendant_id = ? AND c.ancestor_id = ?`
      ).run(parentAccountId, lastInsertRowid);
    })();
  },
  delete_with_all_children: async (event) => {
    const data = await event.request.formData();
    const accountId = data.get('account_id');

    const db = getDB();

    db.transaction(() => {
      // SQLite can't handle JOINs with DELETEs
      // https://stackoverflow.com/questions/4967135/deleting-rows-from-sqlite-table-when-no-match-exists-in-another-table
      // The RETURNING clause exists in SQLite version 3.35.0 (2021-03-12) and later
      // https://www.sqlite.org/lang_returning.html
      const results: { descendant_id: number }[] = db
        .prepare(
          `DELETE FROM account_closure
			 		 WHERE ROWID IN
			 		 (SELECT link.ROWID
			 		 FROM account_closure p
			 		     CROSS JOIN account_closure c
			 		     CROSS JOIN account_closure link
			 		     CROSS JOIN account_closure to_delete
			 		 WHERE p.ancestor_id = link.ancestor_id AND c.descendant_id = link.descendant_id
			 		     AND p.descendant_id = to_delete.ancestor_id AND c.ancestor_id = to_delete.descendant_id
			 		     AND (to_delete.ancestor_id = $account_id OR to_delete.descendant_id = $account_id))
			 		 RETURNING descendant_id;`
        )
        .all({
          account_id: accountId
        });

      const idsToDeleteWithDuplicates = results.map(({ descendant_id }) => descendant_id);
      const idsToDelete = [...new Set(idsToDeleteWithDuplicates)];

      db.prepare(
        `DELETE FROM account
			     WHERE id IN (${'?,'.repeat(idsToDelete.length - 1)}?)`
      ).run(idsToDelete);
    })();
  }
};
