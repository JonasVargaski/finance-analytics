export interface IFii {
  ticker: string;
  sector: string;
  currentPrice: number;
  priceVariation: number;
  dailyLiquidity: number;
  liquidPatrimony: number;
  dividendPrice: number;
  physicalVacancy: number;
  financialVacancy: number;
  amountOfAssets: number;
  accumulatedProfitability: number;
  DY: number;
  DYYear: number;
  DY6M: number;
  DY6MAverage: number;
  DY12M: number;
  DY12MAverage: number;
  VPA: number;
  PVPA: number;
}

export interface IFiiDetail {
  ticker: string;
  provents: Array<{
    dividend: number;
    baseDate: string;
    paymentDate: string;
  }>;
  quotations: Array<{
    price: number;
    date: string;
  }>;
}

export interface IFiiProvider {
  findAllResumed(): Promise<IFii[]>;
  find(ticker: string): Promise<IFiiDetail>;
}
