export interface DebitCredit {
  accountId: number;
  amount: number;
}

export interface Transaction extends NewTransactionData {
  id: number;
}

export interface NewTransactionData {
  date: string;
  description: string;
  debitsCredits: DebitCredit[];
}
