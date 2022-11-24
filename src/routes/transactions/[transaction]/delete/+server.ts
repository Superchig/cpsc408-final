import type { RequestHandler } from './$types';
import type { Account } from '$lib/account';
import { getDB } from '$lib/server/db';

export const DELETE: RequestHandler = async (event) => {
  const db = getDB();

  const transactionId = Number(event.params.transaction);

  console.log(transactionId);

  db.transaction(() => {
    // NOTE(Chris): We delete the debit/credits manually, rather than using an
    // ON DELETE CASCADE clause. This prevents us from accidentally deleting
    // transactions with debits/credits elsewhere.
    db.prepare('DELETE FROM debit_credit WHERE transaction_id = ?').run(transactionId);

    db.prepare('DELETE FROM financial_transaction WHERE id = ?').run(transactionId);
  })();

  return new Response();
};
