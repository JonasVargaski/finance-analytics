import { Wallets } from '../entities/Wallet';

export interface ICreate {
  name: string;
  description: string;
  transactions: {
    fundId: string;
    price: number;
    quotas: number;
    purchaseAt: Date;
  }[];
}
export interface IWalletsRepository {
  findByUser(userId: string): Promise<Wallets[]>;
  create(userId: string, wallet: ICreate): Promise<void>;
  delete(walletId: string): Promise<void>;
}
