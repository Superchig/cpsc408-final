import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { findAllAccounts } from '$lib/server/accounts';
import type { DebitCredit } from '$lib/transaction';

export const load: PageServerLoad = async ({ params }) => {
  const db = getDB();

  const accounts = findAllAccounts(db);
  const transactionRows: {
    transaction_id: number;
    transaction_date: string;
    transaction_description: string,
    debit_credit_id: number;
    debit_credit_amount: number;
    account_id: number;
    account_full_name: string;
  }[] = db
    .prepare(
      `SELECT financial_transaction.id AS transaction_id,
              financial_transaction.description AS transaction_description,
              financial_transaction.date AS transaction_date,
              debit_credit.id AS debit_credit_id,
              debit_credit.amount AS debit_credit_amount,
              debit_credit.account_id,
              (SELECT GROUP_CONCAT(account.name, ':')
               FROM account_closure
                    INNER JOIN account ON account_closure.ancestor_id = account.id
               WHERE account_closure.descendant_id = account_id) AS account_full_name
       FROM financial_transaction
           INNER JOIN debit_credit on financial_transaction.id = debit_credit.transaction_id
           INNER JOIN account on debit_credit.account_id = account.id
       ORDER BY financial_transaction.date;`
    )
    .all();

  let transactions: {
    id: number;
    date: string;
    description: string;
    debitsCredits: DebitCredit[];
  }[] = [];

  for (const row of transactionRows) {
    if (transactions.length <= 0) {
      transactions.push({
        id: row.transaction_id,
        date: row.transaction_date,
        description: row.transaction_description,
        debitsCredits: []
      });
    }

    let lastTransaction = transactions[transactions.length - 1];

    if (lastTransaction.id != row.transaction_id) {
      transactions.push({
        id: row.transaction_id,
        date: row.transaction_date,
        description: row.transaction_description,
        debitsCredits: []
      });
      lastTransaction = transactions[transactions.length - 1];
    }

    lastTransaction.debitsCredits.push({
      accountId: row.account_id,
      amount: row.debit_credit_amount
    });
  }

  return structuredClone({
    accounts,
    transactions
  });
};
