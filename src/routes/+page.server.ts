import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import type { Account } from '$lib/account';

export const load: PageServerLoad = async ({ params }) => {
    const db = getDB();

    const results: Account[] = db.prepare('SELECT id, name FROM account;').all();

    return structuredClone({
        accounts: results,
    });
}