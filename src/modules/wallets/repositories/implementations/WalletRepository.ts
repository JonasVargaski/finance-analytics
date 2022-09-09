import { prisma } from '../../../../database/prismaClient';
import { Wallet } from '../../entities/Wallet';
import { IWalletsRepository } from '../IWalletRepository';

export class WalletsRepository implements IWalletsRepository {
  async findByUser(userId: string): Promise<Wallet[]> {
    const wallets = await prisma.wallets.findMany({ where: { userId } });
    return wallets;
  }
}
