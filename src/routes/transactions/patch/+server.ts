import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';
import type { Transaction } from '$lib/transaction';
import { insertDebitCredits } from '$lib/server/transaction';

export const PATCH: RequestHandler = async (event) => {
  const db = getDB();

  const jsonData: Transaction = await event.request.json();

  db.transaction(() => {
    db.prepare(
      `UPDATE financial_transaction
       SET description = ?,
           date = ?
       WHERE id = ?`
    ).run(jsonData.description, jsonData.date, jsonData.id);

    db.prepare('DELETE FROM debit_credit where transaction_id = ?').run(jsonData.id);

    insertDebitCredits(db, jsonData, jsonData.id);
  })();

  return new Response();
};
