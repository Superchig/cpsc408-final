import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { getDB } from '$lib/server/db';
import type { Account } from '$lib/account';
import { request } from '@playwright/test';
import { DBUS_SESSION_BUS_ADDRESS } from '$env/static/private';

export const load: PageServerLoad = async ({ params }) => {
	const db = getDB();

	const results: Account[] = db
		.prepare(
			`SELECT child_id AS id, GROUP_CONCAT(account.name, ':') AS full_name
             FROM account_parent_child
                 INNER JOIN account ON account_parent_child.parent_id = account.id
             GROUP BY child_id
             ORDER BY parent_id, full_name;`
		)
		.all();

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
			// place all of our desired ancestor accounts' IDs into p.parent_id. We
			// will also place all of the IDs of the descendants of our new account
			// (including the account's own ID) into c.child_id.
			// In this specific case, our freshly-made account will have no descendants
			// (besides itself), so its own ID will be its only descendant.
			db.prepare(
				`INSERT INTO account_parent_child(parent_id, child_id, depth)
             SELECT p.parent_id, c.child_id, p.depth + c.depth + 1
             FROM account_parent_child p
                 CROSS JOIN account_parent_child c
             WHERE p.child_id = ? AND c.parent_id = ?`
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
			const results: { child_id: number }[] = db
				.prepare(
					`DELETE FROM account_parent_child
			 		 WHERE ROWID IN
			 		 (SELECT link.ROWID
			 		 FROM account_parent_child p
			 		     CROSS JOIN account_parent_child c
			 		     CROSS JOIN account_parent_child link
			 		     CROSS JOIN account_parent_child to_delete
			 		 WHERE p.parent_id = link.parent_id AND c.child_id = link.child_id
			 		     AND p.child_id = to_delete.parent_id AND c.parent_id = to_delete.child_id
			 		     AND (to_delete.parent_id = $account_id OR to_delete.child_id = $account_id))
			 		 RETURNING child_id;`
				)
				.all({
					account_id: accountId
				});

			const idsToDeleteWithDuplicates = results.map(({ child_id }) => child_id);
			const idsToDelete = [...new Set(idsToDeleteWithDuplicates)];

			db.prepare(
				`DELETE FROM account
			     WHERE id IN (${'?,'.repeat(idsToDelete.length - 1)}?)`
			).run(idsToDelete);
		})();
	}
};
