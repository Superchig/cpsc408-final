import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { findAllAccounts } from '$lib/server/accounts';

export const load: PageServerLoad = async ({ params }) => {
  const db = getDB();

  const results = findAllAccounts(db);

  return structuredClone({
    accounts: results
  });
};