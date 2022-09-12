import { Transactions as tTransactions } from '@prisma/client';

export class Transactions implements tTransactions {
  id: string;
  quotas: number;
  value: number;
  purchaseAt: Date;
  saleAt: Date;
  createdAt: Date;
  updatedAt: Date;
  fundId: string;
  walletId: string;
}
