export interface IFundsSelect {
  name: string;
  ticker: string;
  description: string;
}

export interface IFundsRepository {
  findByText(text: string): Promise<IFundsSelect[]>;
}
