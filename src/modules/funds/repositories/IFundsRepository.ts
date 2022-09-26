export interface IFundsSelect {
  id: string;
  name: string;
  ticker: string;
  description: string;
}

export interface IFundsRepository {
  findByText(text: string): Promise<IFundsSelect[]>;
  findAll(): Promise<IFundsSelect[]>;
}
