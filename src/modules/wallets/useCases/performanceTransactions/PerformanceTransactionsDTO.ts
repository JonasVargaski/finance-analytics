interface ITransactionResume {
  provents: number;
  appreciation: number;
  percentProvents: number;
  percentAppreciation: number;
  received: boolean;
  date: Date;
  proventDate: Date;
  quotationDate: Date;
}

interface ITransaction {
  id: string;
  ticker: string;
  price: number;
  quotas: number;
  date: Date;
  amount: number;
  currentPrice: number;
  netProfit: number;
  netProfitPercent: number;
  provents: number;
  percentProvents: number;
  appreciation: number;
  percentAppreciation: number;
  resume: ITransactionResume[];
}

interface IGroupedTransaction {
  ticker: string;
  currentPrice: number;
  averagePrice: number;
  averagePricePercent: number;
  amount: number;
  amountPercent: number;
  quotas: number;
  provents: number;
  proventsPercent: number;
  transactions: ITransaction[];
}

export interface IResumeMonth {
  date: Date;
  formatedDate: string;
  value: number;
  amount: number;
  dy: number;
}

interface IPortfolio {
  sector: string;
  tickers: string[];
  amount: number;
  amountPercent: number;
}

export interface IWalletPerformanceDTO {
  amout: number;
  provents: number;
  proventsPercent: number;
  appreciation: number;
  appreciationPercent: number;
  netProfit: number;
  transactions: ITransaction[];
  groupedTransactions: IGroupedTransaction[];
  proventsMonth: IResumeMonth[];
  appreciationMonth: IResumeMonth[];
  portfolioComposition: IPortfolio[];
}
