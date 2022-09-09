import { WalletsRepository } from '../../repositories/implementations/WalletRepository';
import { IWalletDTO } from './ListWalletsDTO';

export class ListWalletsUseCase {
  constructor(private walletsRepository: WalletsRepository) {}

  async execute(userId: string): Promise<IWalletDTO[]> {
    return this.walletsRepository.findByUser(userId);
  }
}
