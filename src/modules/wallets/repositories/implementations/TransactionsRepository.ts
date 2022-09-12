import { prisma } from '../../../../database/prismaClient';
import { Transactions } from '../../entities/Transactions';
import { ITransactionsRepository } from '../ITransactionsRepository';

export class TransactionsRepository implements ITransactionsRepository {
  findAll(walletId: string): Promise<Transactions[]> {
    return prisma.transactions.findMany({ where: { walletId } });
  }
}
