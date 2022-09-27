import { injectable, inject } from 'tsyringe';
import { IRadarRepository, IRadar } from '../../repositories/IRadarRepository';

@injectable()
export class ListRadarUseCase {
  constructor(
    @inject('RadarRepository')
    private radarRepository: IRadarRepository,
  ) {}

  async execute(userId: string): Promise<IRadar[]> {
    return this.radarRepository.findAll(userId);
  }
}
