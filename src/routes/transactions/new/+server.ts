import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';
import type { Transaction } from '$lib/transaction';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
  const db = getDB();

  const jsonData: Transaction = await event.request.json();

  // Validate description

  if (jsonData.description.length <= 0) {
    throw error(422, 'The transaction does not have a description.');
  }

  // Validate account IDs

  for (const debitCredit of jsonData.debitsCredits) {
    if (debitCredit.accountId === 0) {
      throw error(422, 'At least one of the accounts has not been set!');
    }
  }

  // Validate debit/credit amounts

  let netChange = 0;

  for (const debitCredit of jsonData.debitsCredits) {
    netChange += debitCredit.amount;
  }

  if (netChange !== 0) {
    // https://stackoverflow.com/questions/7939137/what-http-status-code-should-be-used-for-wrong-input
    throw error(422, 'The debit/credit amounts do not sum up to 0.');
  }

  // Create actual records in SQL

  db.transaction(() => {
    // TODO(Chris): Set the priority of a financial transaction when creating one
    const info = db
      .prepare(
        `INSERT INTO financial_transaction(date, description)
         VALUES (?, ?)`
      )
      .run(jsonData.date, jsonData.description);

    const values_sql = jsonData.debitsCredits.map((_) => '(?, ?, ?)').join(', ');
    const values = jsonData.debitsCredits
      .map((dc) => [dc.amount, info.lastInsertRowid, dc.accountId])
      .flat();

    db.prepare(
      `INSERT INTO debit_credit(amount, transaction_id, account_id)
       VALUES ${values_sql}`
    ).run(values);
  })();

  return new Response();
};
