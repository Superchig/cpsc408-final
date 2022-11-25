import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';
import type { NewTransactionData } from '$lib/transaction';
import { error } from '@sveltejs/kit';
import { insertDebitCredits } from '$lib/server/transaction';

export const POST: RequestHandler = async (event) => {
  const db = getDB();

  const jsonData: NewTransactionData = await event.request.json();

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

    insertDebitCredits(db, jsonData, info.lastInsertRowid);
  })();

  return new Response();
};
