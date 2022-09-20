export interface IGenerateDTO {
  value: number;
  startDate: Date;
  endDate: Date;
  actives: {
    ticker: string;
    weight: number;
  }[];
}

export interface IAssembleWalletDTO {
  total: number;
  rest: number;
  quotas: number;
  date?: Date | null;
  itens: {
    ticker: string;
    quotas: number;
    price: number;
    amount: number;
    quotedAt: Date;
  }[];
}
