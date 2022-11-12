import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';

export const GET: RequestHandler = async (event) => {
	const db = getDB();

	const accountId = Number(event.params.account);

	// NOTE(Chris): We subtract 1 from COUNT(*) because of the zero-depth parent-child
	// relationship from an account to itself.
	const { count_children } = db
		.prepare(
			`SELECT COUNT(*) - 1 AS count_children
             FROM account_parent_child
             WHERE parent_id = ?`
		)
		.get(accountId);

	return new Response(count_children);
};
