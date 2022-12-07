import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { findAllAccounts } from '$lib/server/accounts';
import type { DebitCredit, Transaction } from '$lib/transaction';

export const load: PageServerLoad = async (event) => {
  const db = getDB();

  const accounts = findAllAccounts(db);

  // Obtain relevant transactions

  const searchParams = {
    date: event.url.searchParams.get('date'),
    accountId: Number(event.url.searchParams.get('account_id')),
    description: event.url.searchParams.get('description')
  };

  let bindParams: any = {};
  let sqlConditions = [];

  if (searchParams.date) {
    bindParams.date = searchParams.date;
    sqlConditions.push('financial_transaction.date = $date');
  }

  if (searchParams.accountId) {
    bindParams.account_id = searchParams.accountId;
    // FIXME(Chris): Use table view for triple-join here
    sqlConditions.push(`financial_transaction.id IN
                            (SELECT DISTINCT transaction_id
                             FROM financial_transaction
                                      INNER JOIN debit_credit on financial_transaction.id = debit_credit.transaction_id
                                      INNER JOIN account on debit_credit.account_id = account.id
                             WHERE account_id = $account_id -- ID
                          ORDER BY financial_transaction.date)`);
  }

  if (searchParams.description) {
    bindParams.description = searchParams.description;
    sqlConditions.push("financial_transaction.description LIKE '%' || $description || '%'");
  }

  let sqlBeforeSubstitution = `SELECT financial_transaction.id AS transaction_id,
                                      financial_transaction.description AS transaction_description,
                                      financial_transaction.date AS transaction_date,
                                      debit_credit.id AS debit_credit_id,
                                      debit_credit.amount AS debit_credit_amount,
                                      debit_credit.account_id
                               FROM financial_transaction
                                   INNER JOIN debit_credit on financial_transaction.id = debit_credit.transaction_id
                                   INNER JOIN account on debit_credit.account_id = account.id`;

  if (sqlConditions.length > 0) {
    sqlBeforeSubstitution += '\n';
    
    sqlBeforeSubstitution += 'WHERE ' + sqlConditions.join('\n  AND ');
  }

  sqlBeforeSubstitution += '\nORDER BY financial_transaction.date';

  const transactionRows: {
    transaction_id: number;
    transaction_date: string;
    transaction_description: string;
    debit_credit_id: number;
    debit_credit_amount: number;
    account_id: number;
  }[] = db.prepare(sqlBeforeSubstitution).all(bindParams);

  // Convert transactionRows into Transaction[]

  let transactions: Transaction[] = [];

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
