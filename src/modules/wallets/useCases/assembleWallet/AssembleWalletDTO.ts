export interface IGenerateDTO {
  value: number;
  startDate: Date;
  endDate: Date;
  actives: {
    fundId?: string;
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
    fundId: string;
    ticker: string;
    quotas: number;
    price: number;
    amount: number;
    quotedAt: Date;
  }[];
}
