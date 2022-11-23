import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';
import type { NewTransactionData } from '$lib/transaction';

export const POST: RequestHandler = async (event) => {
  const db = getDB();

  const jsonData: NewTransactionData = await event.request.json();

  let netChange = 0;

  for (const debitCredit of jsonData.debitsCredits) {
    netChange += debitCredit.amount;
  }

  if (netChange != 0) {
    // https://stackoverflow.com/questions/7939137/what-http-status-code-should-be-used-for-wrong-input
    return new Response(null, {
      status: 422,
      statusText: 'The debit/credit amounts do not sum up to 0.'
    });
  }

  db.transaction(() => {
    // TODO(Chris): Set the priority of a financial transaction when creating one
    const info = db
      .prepare(
        `INSERT INTO financial_transaction(date)
       VALUES (?)`
      )
      .run(jsonData.date);

    const values_sql = jsonData.debitsCredits.map((_) => '(?, ?, ?)').join(', ');
    const values = jsonData.debitsCredits.map((dc) => [
      dc.amount,
      info.lastInsertRowid,
      dc.accountId
    ]).flat();

    db.prepare(
      `INSERT INTO debit_credit(amount, transaction_id, account_id)
       VALUES ${values_sql}`
    ).run(values);
  })();

  return new Response();
};
