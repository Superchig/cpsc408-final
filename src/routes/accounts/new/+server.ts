import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';

export const POST: RequestHandler = async (event) => {
    const db = getDB();

    // FIXME(Chris): Share this type with the front-end
    const result: { name: string } = await event.request.json();

    db.prepare("INSERT INTO account(name) VALUES (?);").run(result.name);

    return new Response();
}