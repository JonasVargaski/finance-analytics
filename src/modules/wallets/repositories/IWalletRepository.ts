import { Wallet } from '../entities/Wallet';

export interface IWalletsRepository {
  findAll(): Promise<Wallet[]>;
  save(wallet: Wallet): Promise<string>;
}
