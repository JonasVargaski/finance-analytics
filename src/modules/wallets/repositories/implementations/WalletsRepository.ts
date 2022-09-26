import { prisma } from '../../../../database/prismaClient';
import { Wallets } from '../../entities/Wallet';
import { ICreate, IWallet, IWalletsRepository } from '../IWalletsRepository';

export class WalletsRepository implements IWalletsRepository {
  find(walletId: string): Promise<IWallet> {
    return prisma.wallets.findUniqueOrThrow({
      where: {
        id: walletId,
      },
      include: {
        transactions: {
          orderBy: {
            purchaseAt: 'asc',
          },
        },
      },
    });
  }

  async delete(walletId: string): Promise<void> {
    await prisma.transactions.deleteMany({ where: { walletId } });
    await prisma.wallets.delete({ where: { id: walletId } });
  }

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
