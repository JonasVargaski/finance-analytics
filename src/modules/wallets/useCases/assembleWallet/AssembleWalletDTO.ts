export interface IGenerateAssembleWalletDTO {
  ticker: string;
  weight: number;
  price: number;
  tradingDate: string;
}

export interface IAssembleWalletDTO {
  totalValue: number;
  restValue: number;
  totalQuotas: number;
  items: Array<{
    ticker: string;
    quotas: number;
    price: number;
    tradingDate: string;
  }>;
}
