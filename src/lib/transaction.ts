export interface DebitCredit {
  accountId: number;
  amount: number;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  debitsCredits: DebitCredit[];
}

export interface NewTransactionData {
  date: string;
  description: string;
  debitsCredits: DebitCredit[];
}
