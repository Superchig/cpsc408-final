export interface DebitCredit {
  accountId: 0;
  amount: 0;
}

export interface NewTransactionData {
  date: string;
  description: string;
  debitsCredits: DebitCredit[];
}
