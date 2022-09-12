import { injectable, inject } from 'tsyringe';
import { Wallets } from '../../entities/Wallet';

import { IWalletsRepository } from '../../repositories/IWalletsRepository';

@injectable()
export class ListWalletsUseCase {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,
  ) {}

  async execute(userId: string): Promise<Wallets[]> {
    return this.walletsRepository.findByUser(userId);
  }
}
