import { Transactions as tTransactions, Funds } from '@prisma/client';

export class Transactions implements tTransactions {
  id: string;
  quotas: number;
  price: number;
  purchaseAt: Date;
  saleAt: Date;
  createdAt: Date;
  updatedAt: Date;
  walletId: string;
  fundId: string;
  fund: Funds;
}
