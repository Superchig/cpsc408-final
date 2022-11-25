import type { NewTransactionData, Transaction } from '$lib/transaction';
import type { Database } from 'better-sqlite3';

export const insertDebitCredits = (
  db: Database,
  jsonData: NewTransactionData,
  transactionId: number
) => {
  const values_sql = jsonData.debitsCredits.map((_) => '(?, ?, ?)').join(', ');
  const values = jsonData.debitsCredits
    .map((dc) => [dc.amount, transactionId, dc.accountId])
    .flat();

  db.prepare(
    `INSERT INTO debit_credit(amount, transaction_id, account_id)
         VALUES ${values_sql}`
  ).run(values);
};
