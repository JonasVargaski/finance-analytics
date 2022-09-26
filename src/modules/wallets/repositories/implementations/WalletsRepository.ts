import { prisma } from '../../../../database/prismaClient';
import { Wallets } from '../../entities/Wallet';
import { ICreate, IUpdate, IWallet, IWalletsRepository } from '../IWalletsRepository';

export class WalletsRepository implements IWalletsRepository {
  async update(wallet: IUpdate): Promise<void> {
    const transactions = await prisma.transactions.findMany({ where: { walletId: wallet.id } });

    const updateWallet = prisma.wallets.update({
      where: {
        id: wallet.id,
      },
      data: {
        name: wallet.name,
        description: wallet.description,
        transactions: {
          connectOrCreate: wallet.transactions.map((transaction) => ({
            where: { id: transaction.id },
            create: {
              id: transaction.id,
              fundId: transaction.fundId,
              price: transaction.price,
              quotas: transaction.quotas,
              purchaseAt: transaction.purchaseAt,
              saleAt: transaction.saleAt,
            },
          })),
        },
      },
    });

    const toRemove = transactions.filter((t) => !wallet.transactions.some((x) => x.id === t.id)).map((t) => t.id);

    const deleteTransactions = prisma.transactions.deleteMany({ where: { id: { in: toRemove } } });
    const updateTransactions = wallet.transactions.map((transaction) =>
      prisma.transactions.update({
        where: { id: transaction.id },
        data: {
          fundId: transaction.fundId,
          quotas: transaction.quotas,
          price: transaction.price,
          purchaseAt: transaction.purchaseAt,
          saleAt: transaction.saleAt,
        },
      }),
    );

    await prisma.$transaction([updateWallet, deleteTransactions, ...updateTransactions]);
  }

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
