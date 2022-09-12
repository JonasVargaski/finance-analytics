import { Wallets } from '../entities/Wallet';

export interface IWalletsRepository {
  findByUser(userId: string): Promise<Wallets[]>;
}
