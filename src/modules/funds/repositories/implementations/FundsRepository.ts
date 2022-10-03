import { addHours } from 'date-fns';
import { prisma } from '../../../../database/prismaClient';
import { IFundsRepository, IFundResumed, ITempScrap } from '../IFundsRepository';

export class FundsRepository implements IFundsRepository {
  find(id: string): Promise<IFundResumed> {
    return prisma.funds.findFirst({ where: { id } });
  }

  getTempScrap(fundId: string): Promise<ITempScrap> {
    return prisma.dataScrap.findFirst({ where: { fundId, createdAt: { gte: addHours(new Date(), -1) } } });
  }

  async createOrUpdateTempScrap(scrap: Omit<ITempScrap, 'id' | 'createdAt'>): Promise<void> {
    await prisma.dataScrap.upsert({
      where: { fundId: scrap.fundId },
      update: {
        data: scrap.data,
      },
      create: {
        fundId: scrap.fundId,
        data: scrap.data,
      },
    });
  }

  findAll(): Promise<IFundResumed[]> {
    return prisma.funds.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        ticker: true,
      },
    });
  }

  findByText(text: string): Promise<IFundResumed[]> {
    return prisma.funds.findMany({
      where: {
        OR: [
          {
            name: { contains: text, mode: 'insensitive' },
          },
          {
            ticker: { contains: text, mode: 'insensitive' },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        ticker: true,
      },
      skip: 0,
      take: 4,
    });
  }
}
