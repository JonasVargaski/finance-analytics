import { Transactions } from '../entities/Transactions';

export interface ITransactionsRepository {
  findAll(walletId: string): Promise<Transactions[]>;
}
