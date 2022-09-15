export interface ITransaction {
  id: string;
  quotas: number;
  price: number;
  purchaseAt: Date;
  saleAt: Date;
  fund: {
    id: string;
    ticker: string;
    name: string;
    type: string;
    segment: string;
    mandate: string;
  };
}

export interface ITransactionsRepository {
  findActives(walletId: string): Promise<ITransaction[]>;
}
