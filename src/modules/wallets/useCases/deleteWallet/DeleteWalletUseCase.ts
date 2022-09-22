/* eslint-disable no-loop-func */
import { inject, injectable } from 'tsyringe';
import { IWalletsRepository } from '../../repositories/IWalletsRepository';

@injectable()
export class DeleteWalletUseCase {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,
  ) {}

  async execute(walletId: string): Promise<void> {
    await this.walletsRepository.delete(walletId);
  }
}
