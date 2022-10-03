export interface IFundResumed {
  id: string;
  name: string;
  ticker: string;
  description: string;
}

export interface ITempScrap {
  id: string;
  fundId: string;
  data: string;
  createdAt: Date;
}

export interface IFundsRepository {
  getTempScrap(fundId: string): Promise<ITempScrap | null>;
  createOrUpdateTempScrap(scrap: Omit<ITempScrap, 'id' | 'createdAt'>): Promise<void>;
  findByText(text: string): Promise<IFundResumed[]>;
  findAll(): Promise<IFundResumed[]>;
  find(id: string): Promise<IFundResumed>;
}
