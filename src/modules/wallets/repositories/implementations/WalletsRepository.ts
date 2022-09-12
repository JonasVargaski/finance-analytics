import { prisma } from '../../../../database/prismaClient';
import { Wallets } from '../../entities/Wallet';
import { IWalletsRepository } from '../IWalletsRepository';

export class WalletsRepository implements IWalletsRepository {
  async findByUser(userId: string): Promise<Wallets[]> {
    const wallets = await prisma.wallets.findMany({ where: { userId } });
    return wallets;
  }
}
