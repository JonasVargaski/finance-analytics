/* eslint-disable no-loop-func */
import { inject, injectable } from 'tsyringe';
import { IWalletsRepository } from '../../repositories/IWalletsRepository';
import { IUpdateDTO } from './UpdateWalletDTO';

@injectable()
export class UpdateWalletUseCase {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,
  ) {}

  async execute(data: IUpdateDTO): Promise<void> {
    await this.walletsRepository.update(data);
  }
}
