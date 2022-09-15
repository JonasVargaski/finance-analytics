import { prisma } from '../../../../database/prismaClient';
import { ITransaction, ITransactionsRepository } from '../ITransactionsRepository';

export class TransactionsRepository implements ITransactionsRepository {
  findActives(walletId: string): Promise<ITransaction[]> {
    return prisma.transactions.findMany({
      where: {
        walletId,
        saleAt: null,
      },
      select: {
        id: true,
        quotas: true,
        price: true,
        purchaseAt: true,
        saleAt: true,
        fund: {
          select: {
            id: true,
            ticker: true,
            name: true,
            type: true,
            segment: true,
            mandate: true,
          },
        },
      },
    });
  }
}
