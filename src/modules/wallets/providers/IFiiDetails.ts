export interface IFiiDetails {
  ticker: string;
  price: number;
}

export interface IFiiDetailsProvider {
  find(ticker: string): Promise<IFiiDetails>;
}
