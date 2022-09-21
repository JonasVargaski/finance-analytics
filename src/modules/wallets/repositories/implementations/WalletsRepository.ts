import { prisma } from '../../../../database/prismaClient';
import { Wallets } from '../../entities/Wallet';
import { ICreate, IWalletsRepository } from '../IWalletsRepository';

export class WalletsRepository implements IWalletsRepository {
  async create(userId: string, wallet: ICreate): Promise<void> {
    await prisma.wallets.create({
      data: {
        userId,
        name: wallet.name,
        description: wallet.description,
        transactions: {
          createMany: {
            data: wallet.transactions.map((transaction) => ({
              fundId: transaction.fundId,
              quotas: transaction.quotas,
              price: transaction.price,
              purchaseAt: transaction.purchaseAt,
            })),
          },
        },
      },
    });
  }

  async findByUser(userId: string): Promise<Wallets[]> {
    const wallets = await prisma.wallets.findMany({ where: { userId } });
    return wallets;
  }
}
