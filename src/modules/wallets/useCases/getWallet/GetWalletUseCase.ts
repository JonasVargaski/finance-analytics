/* eslint-disable no-loop-func */
import { inject, injectable } from 'tsyringe';
import { IWalletsRepository } from '../../repositories/IWalletsRepository';
import { IGetWalletDTO } from './GetWalletDTO';

@injectable()
export class GetWalletUseCase {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,
  ) {}

  async execute(walletId: string): Promise<IGetWalletDTO> {
    return this.walletsRepository.find(walletId);
  }
}
