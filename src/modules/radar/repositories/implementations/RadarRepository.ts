import { prisma } from '../../../../database/prismaClient';
import { ICreateRadar, IRadar, IRadarRepository } from '../IRadarRepository';

export class RadarRepository implements IRadarRepository {
  async exclude(id: string): Promise<void> {
    prisma.radar.delete({
      where: {
        id,
      },
    });
  }

  async create(data: ICreateRadar): Promise<IRadar> {
    const result = await prisma.radar.create({
      data: {
        fundId: data.fundId,
        userId: data.userId,
      },
      select: {
        id: true,
        fundId: true,
        fund: {
          select: {
            ticker: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return { id: result.id, fundId: result.fundId, ...result.fund };
  }

  async findAll(userId: string): Promise<IRadar[]> {
    const result = await prisma.radar.findMany({
      where: {
        userId,
      },
      include: {
        fund: {
          select: {
            ticker: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return result.map((x) => ({
      id: x.id,
      fundId: x.fundId,
      name: x.fund.name,
      description: x.fund.description,
      ticker: x.fund.ticker,
    }));
  }
}
