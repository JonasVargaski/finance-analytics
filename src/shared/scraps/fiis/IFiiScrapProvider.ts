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

export interface IProvent {
  dividend: number;
  baseDate: Date;
  paymentDate: Date;
}

export interface IFiiDetail {
  ticker: string;
  status: 'success' | 'error';
  error: string | null;
  data: { [key: string]: string } | null;
}

export interface IVariation {
  date: Date;
  open: number;
  max: number;
  min: number;
  average: number;
  close: number;
  volume: number;
  variation: number;
  negotiation: number;
  titles: number;
}

export interface IFiiScrapProvider {
  findAllResumed(): Promise<IFii[]>;
  findQuotations(ticker: string, start: Date, end: Date): Promise<IQuotation[]>;
  findProvents(ticker: string): Promise<IProvent[]>;
  findDetails(tickers: string[]): Promise<IFiiDetail[]>;
  findQuotationsOfPeriod(ticker: string, startDate: Date): Promise<IQuotation[]>;
  findHistoryVariation(ticker: string, startDate: Date, endDate: Date): Promise<IVariation[]>;
}
