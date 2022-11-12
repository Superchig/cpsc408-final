import type { RequestHandler } from './$types';
import type { Account } from '$lib/account';
import { getDB } from '$lib/server/db';

export const POST: RequestHandler = async (event) => {
    const db = getDB();

    const result: Account = await event.request.json();

    db.prepare("INSERT INTO account(name) VALUES (?);").run(result.full_name);

    return new Response();
}