export interface DebitCredit {
  accountId: number;
  amount: number;
}

export interface Transaction {
  date: string;
  description: string;
  debitsCredits: DebitCredit[];
}
