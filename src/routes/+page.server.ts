import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { getDB } from '$lib/server/db';
import type { Account } from '$lib/account';

export const load: PageServerLoad = async ({ params }) => {
    const db = getDB();

    const results: Account[] = db.prepare('SELECT id, name FROM account;').all();

    return structuredClone({
        accounts: results,
    });
}

export const actions: Actions = {
    default: async (event) => {
        console.log(event);
    },
    childaccount: async (event) => {
        console.log(event);
    }
};