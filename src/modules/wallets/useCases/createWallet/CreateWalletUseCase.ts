/* eslint-disable no-loop-func */
import { inject, injectable } from 'tsyringe';
import { IWalletsRepository } from '../../repositories/IWalletsRepository';
import { ICreateDTO } from './CreateWalletDTO';

@injectable()
export class CreateWalletUseCase {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,
  ) {}

  async execute(userId: string, data: ICreateDTO): Promise<void> {
    await this.walletsRepository.create(userId, data);
  }
}
