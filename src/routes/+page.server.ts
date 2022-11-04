import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
    // FIXME(Chris): Only make database connection once
    const db = getDB();

    const results = db.prepare('SELECT id, name FROM account;').all();

    return structuredClone({
        accounts: results,
    });
}