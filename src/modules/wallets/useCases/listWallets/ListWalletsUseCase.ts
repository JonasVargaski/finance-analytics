import { injectable, inject } from 'tsyringe';

import { IWalletsRepository } from '../../repositories/IWalletsRepository';
import { IListWalletResultDTO } from './ListWalletsDTO';

@injectable()
export class ListWalletsUseCase {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,
  ) {}

  async execute(userId: string): Promise<IListWalletResultDTO[]> {
    return this.walletsRepository.findByUser(userId);
  }
}
