import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { getDB } from '$lib/server/db';
import type { Account } from '$lib/account';
import { request } from '@playwright/test';

export const load: PageServerLoad = async ({ params }) => {
	const db = getDB();

	const results: Account[] = db.prepare('SELECT id, name FROM account;').all();

	return structuredClone({
		accounts: results
	});
};

export const actions: Actions = {
	childaccount: async (event) => {
		const data = await event.request.formData();
		const parentAccountId = data.get('parent_account_id');
		const newAccountName = data.get('new_account_name');

		console.log('parentAccountId: ' + parentAccountId);
		console.log('newAccountName: ' + newAccountName);

		// FIXME(Chris): Use some kind of transaction

		const db = getDB();

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
	}
};
