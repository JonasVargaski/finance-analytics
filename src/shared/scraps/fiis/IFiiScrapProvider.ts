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

export interface IQuotation {
  value: number;
  date: Date;
}

export interface IQuotationHistory {
  from: Date;
  to: Date;
  min: number;
  max: number;
  variationType: 'up' | 'down';
  variation: number;
  variationPercent: number;
  data: Array<{
    value: number;
    date: Date;
  }>;
}

export interface IProvent {
  dividend: number;
  baseDate: Date;
  paymentDate: Date;
}

export interface IFiiScrapProvider {
  findAllResumed(): Promise<IFii[]>;
  findQuotations(ticker: string, start: Date, end: Date): Promise<IQuotation[]>;
  findQuotationsOfDay(ticker: string): Promise<IQuotation[]>;
  findQuotationsLastFiveDays(ticker: string): Promise<IQuotationHistory>;
  findProvents(ticker: string): Promise<IProvent[]>;
}
