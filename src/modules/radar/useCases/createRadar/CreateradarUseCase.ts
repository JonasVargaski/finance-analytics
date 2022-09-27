import { injectable, inject } from 'tsyringe';
import { IRadar, IRadarRepository } from '../../repositories/IRadarRepository';
import { ICreateRadar } from './CreateRadarDTO';

@injectable()
export class CreateRadarUseCase {
  constructor(
    @inject('RadarRepository')
    private radarRepository: IRadarRepository,
  ) {}

  async execute(data: ICreateRadar): Promise<IRadar> {
    const all = await this.radarRepository.findAll(data.userId);

    if (all.some((x) => x.fundId === data.fundId)) throw new Error('The fund is already registered on the radar');

    return this.radarRepository.create(data);
  }
}
