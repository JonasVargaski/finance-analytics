import { Wallet } from '../entities/Wallet';

export interface IWalletsRepository {
  findByUser(userId: string): Promise<Wallet[]>;
}
