import {
  addMonths,
  isBefore,
  parseISO,
  lastDayOfMonth,
  isSameDay,
  addDays,
  differenceInMonths,
  isSameMonth,
  format,
} from 'date-fns';
import { ScrapProvider } from '../../../fiis/providers/implementations/ScrapProvider';

interface ITransaction {
  ticker: string;
  sector: string;
  quotas: number;
  price: number;
  tradingDate: string;
}

interface IWalletPerformance {
  amout: number;
  provents: number;
  proventsPercent: number;
  appreciation: number;
  appreciationPercent: number;
  netProfit: number;
  transactions: Array<{
    ticker: string;
    price: number;
    quotas: number;
    date: string;
    amount: number;
    currentPrice: number;
    netProfit: number;
    netProfitPercent: number;
    provents: number;
    percentProvents: number;
    appreciation: number;
    percentAppreciation: number;
    resume: {
      provents: number;
      appreciation: number;
      percentProvents: number;
      percentAppreciation: number;
      received: boolean;
      date: string;
      proventDate: string;
      quotationDate: string;
    }[];
  }>;
  proventsMonth: Array<{
    date: string;
    value: number;
  }>;
  portfolioComposition: Array<{
    sector: string;
    amountPercent: number;
    value: number;
  }>;
}

export class PerformanceTransactionsUseCase {
  private findQuotationOfMonth(
    quotations: Array<{
      price: number;
      date: string;
    }>,
    month: Date,
    days: number,
  ) {
    let quotation = quotations.find((q) => isSameDay(addDays(lastDayOfMonth(month), days), parseISO(q.date)));
    if (days < -31) return undefined;
    if (!quotation) quotation = this.findQuotationOfMonth(quotations, month, days - 1);
    return quotation;
  }

  async execute(transactions: ITransaction[]): Promise<IWalletPerformance> {
    const scrapProvider = new ScrapProvider();
    const fiisData = await Promise.all([...new Set(transactions.map((x) => x.ticker))].map(scrapProvider.find));

    const transactionsResume = transactions
      .sort((a, b) => parseISO(a.tradingDate).getTime() - parseISO(b.tradingDate).getTime())
      .map((transaction) => {
        const fiiDetails = fiisData.find((fiiData) => fiiData.ticker === transaction.ticker);
        const tradingDate = parseISO(transaction.tradingDate);

        const months = [
          tradingDate,
          ...Array.from({ length: differenceInMonths(new Date(), tradingDate) }, (_, i) => {
            const date = addMonths(tradingDate, i + 1);
            date.setDate(1);
            return date;
          }),
        ];

        const groupedResult = months.map((month, i) => {
          const proventsMonth = fiiDetails.provents.find((p) => {
            const itsIncome = isSameMonth(month, parseISO(p.paymentDate));
            if (!itsIncome) return false;
            const isMonthOfTrading = i === 0;
            return isMonthOfTrading ? isBefore(month, parseISO(p.baseDate)) : itsIncome;
          });

          const lastQuotationMonth = this.findQuotationOfMonth(fiiDetails.quotations, month, 0);
          const provents = transaction.quotas * (proventsMonth?.dividend || 0);
          const percentProvents = ((proventsMonth?.dividend || 0) / transaction.price) * 100;
          const appreciation = (lastQuotationMonth.price - transaction.price) * transaction.quotas;
          const percentAppreciation = ((lastQuotationMonth.price - transaction.price) / transaction.price) * 100;

          return {
            date: month.toISOString(),
            received: proventsMonth?.paymentDate ? isBefore(parseISO(proventsMonth?.paymentDate), new Date()) : false,
            proventDate: proventsMonth?.paymentDate || null,
            quotationDate: lastQuotationMonth.date,
            provents,
            appreciation,
            percentProvents,
            percentAppreciation,
          };
        });

        const amount = transaction.quotas * transaction.price;
        const currentPrice = this.findQuotationOfMonth(fiiDetails.quotations, new Date(), 0).price;
        const appreciation = (currentPrice - transaction.price) * transaction.quotas;

        const totalProvents = groupedResult.reduce((acc, cur) => {
          acc += cur.provents;
          return acc;
        }, 0);

        const percentProvents = totalProvents
          ? ((totalProvents / amount) * 100) / groupedResult.filter((x) => x.provents).length
          : 0;

        const transactionResume = {
          ticker: transaction.ticker,
          sector: transaction.sector,
          price: transaction.price,
          quotas: transaction.quotas,
          date: transaction.tradingDate,
          amount,
          currentPrice,
          netProfit: totalProvents + appreciation,
          netProfitPercent: 0,
          provents: totalProvents,
          appreciation,
          percentProvents,
          percentAppreciation: ((currentPrice - transaction.price) / transaction.price) * 100,
          resume: groupedResult,
        };

        transactionResume.netProfitPercent =
          ((transactionResume.provents + transactionResume.appreciation) / transactionResume.amount) * 100;

        return transactionResume;
      });

    const totals = transactionsResume.reduce(
      (acc, cur) => {
        acc.amount += cur.amount;
        acc.provents += cur.provents;
        acc.percentProvents += cur.percentProvents;
        acc.appreciation += cur.appreciation;

        cur.resume
          .filter((r) => r.provents > 0)
          .forEach((monthTransaction) => {
            const formatedDate = format(parseISO(monthTransaction.date), 'MM/yyyy');
            const idx = acc.proventsMonth.findIndex((a) => a.date === formatedDate);
            if (idx === -1) acc.proventsMonth.push({ date: formatedDate, value: monthTransaction.provents });
            else acc.proventsMonth[idx].value += monthTransaction.provents;
          });

        const idxPortfolio = acc.portfolio.findIndex((p) => p.sector === cur.sector);
        if (idxPortfolio === -1) acc.portfolio.push({ sector: cur.sector, amount: cur.amount });
        else acc.portfolio[idxPortfolio].amount += cur.amount;

        return acc;
      },
      { amount: 0, provents: 0, percentProvents: 0, appreciation: 0, proventsMonth: [], portfolio: [] },
    );

    return {
      amout: totals.amount,
      provents: totals.provents,
      appreciation: totals.appreciation,
      transactions: transactionsResume,
      proventsMonth: totals.proventsMonth,
      netProfit: totals.provents + totals.appreciation,
      appreciationPercent: (totals.appreciation / totals.amount) * 100,
      proventsPercent: totals.percentProvents / transactionsResume.filter((t) => t.provents).length || 0,
      portfolioComposition: totals.portfolio.map((p) => ({ ...p, amountPercent: (p.amount / totals.amount) * 100 })),
    };
  }
}
