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

export interface IWallet {
  id: string;
  name: string;
  description: string;
  transactions: {
    id: string;
    fundId: string;
    price: number;
    quotas: number;
    purchaseAt: Date;
  }[];
}

export interface IUpdate {
  id: string;
  name: string;
  description: string;
  transactions: {
    id: string;
    fundId: string;
    price: number;
    quotas: number;
    purchaseAt: Date;
    saleAt: Date;
  }[];
}

export interface IWalletsRepository {
  findByUser(userId: string): Promise<Wallets[]>;
  create(userId: string, wallet: ICreate): Promise<void>;
  update(wallet: IUpdate): Promise<void>;
  delete(walletId: string): Promise<void>;
  find(walletId: string): Promise<IWallet>;
}
