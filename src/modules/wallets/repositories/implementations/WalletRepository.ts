import { Wallet } from '../../entities/Wallet';
import { IWalletsRepository } from '../IWalletRepository';

export class WalletsRepository implements IWalletsRepository {
  private wallets: Wallet[] = [];

  async findAll(): Promise<Wallet[]> {
    return Promise.resolve(this.wallets);
  }

  async save(wallet: Wallet): Promise<string> {
    this.wallets.push(wallet);
    return '12345';
  }
}
