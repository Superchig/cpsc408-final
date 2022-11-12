import type { RequestHandler } from './$types';
import type { Account } from '$lib/account';
import { getDB } from '$lib/server/db';

export const DELETE: RequestHandler = async (event) => {
  const db = getDB();

  const accountId = Number(event.params.account);

  db.prepare('DELETE FROM account WHERE id = ?').run(accountId);

  return new Response();
};
