import { injectable, inject } from 'tsyringe';
import { IRadarRepository, IRadar } from '../../repositories/IRadarRepository';

@injectable()
export class RemoveRadarUseCase {
  constructor(
    @inject('RadarRepository')
    private radarRepository: IRadarRepository,
  ) {}

  async execute(id: string): Promise<void> {
    return this.radarRepository.exclude(id);
  }
}
