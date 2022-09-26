import { prisma } from '../../../../database/prismaClient';
import { IFundsRepository, IFundsSelect } from '../IFundsRepository';

export class FundsRepository implements IFundsRepository {
  findAll(): Promise<IFundsSelect[]> {
    return prisma.funds.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        ticker: true,
      },
    });
  }

  findByText(text: string): Promise<IFundsSelect[]> {
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
