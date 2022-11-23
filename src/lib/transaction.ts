export interface DebitCredit {
  accountId: number;
  amount: number;
}

export interface NewTransactionData {
  date: string;
  description: string;
  debitsCredits: DebitCredit[];
}
