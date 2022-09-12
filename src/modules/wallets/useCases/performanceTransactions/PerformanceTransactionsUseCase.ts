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
import colors from '../../../../data/colors';
import { ScrapProvider } from '../../../fiis/providers/implementations/ScrapProvider';

interface ITransaction {
  id: string;
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
    id: string;
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
  groupedTransactions: Array<{
    ticker: string;
    currentPrice: number;
    averagePrice: number;
    averagePricePercent: number;
    amount: number;
    color: string;
    amountPercent: number;
    quotas: number;
    provents: number;
    proventsPercent: number;
    transactions: IWalletPerformance['transactions'];
  }>;
  proventsMonth: Array<{
    date: string;
    formatedDate: string;
    value: number;
    amount: number;
    dy: number;
  }>;
  portfolioComposition: Array<{
    sector: string;
    color: string;
    amount: number;
    amountPercent: number;
  }>;
}

export class PerformanceTransactionsUseCase {
  constructor(private scrapProvider: ScrapProvider) {}

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
    const fiisData = await Promise.all([...new Set(transactions.map((x) => x.ticker))].map(this.scrapProvider.find));

    const transactionsResume = transactions
      .sort((a, b) => parseISO(a.tradingDate).getTime() - parseISO(b.tradingDate).getTime())
      .map((transaction) => {
        const fiiDetails = fiisData.find((fiiData) => fiiData.ticker === transaction.ticker);
        const tradingDate = parseISO(transaction.tradingDate);

        const months = [
          tradingDate,
          ...Array.from({ length: differenceInMonths(lastDayOfMonth(new Date()), tradingDate) }, (_, i) => {
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
          id: transaction.id,
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
            const idx = acc.proventsMonth.findIndex((a) => a.formatedDate === formatedDate);

            if (idx === -1) {
              acc.proventsMonth.push({
                date: monthTransaction.date,
                formatedDate,
                value: monthTransaction.provents,
                amount: 0,
                dy: 0,
              });
            } else {
              acc.proventsMonth[idx].value += monthTransaction.provents;
            }
          });

        const idxPortfolio = acc.portfolio.findIndex((p) => p.sector === cur.sector);
        if (idxPortfolio === -1)
          acc.portfolio.push({ sector: cur.sector, amount: cur.amount, amountPercent: 0, color: '' });
        else acc.portfolio[idxPortfolio].amount += cur.amount;

        return acc;
      },
      {
        amount: 0,
        provents: 0,
        percentProvents: 0,
        appreciation: 0,
        proventsMonth: [] as IWalletPerformance['proventsMonth'],
        portfolio: [] as IWalletPerformance['portfolioComposition'],
      },
    );

    totals.proventsMonth.forEach((p) => {
      const proventMonthDate = lastDayOfMonth(parseISO(p.date));
      let amount = 0;
      let provent = 0;

      transactionsResume.forEach((t) => {
        if (isBefore(parseISO(t.date), proventMonthDate)) {
          const tProvents = t.resume.reduce((acc, cur) => {
            if (cur.provents > 0 && isSameMonth(parseISO(cur.proventDate), proventMonthDate)) {
              acc += cur.provents;
            }
            return acc;
          }, 0);
          if (tProvents > 0) {
            amount += t.amount;
            provent += tProvents;
          }
        }
      });

      if (provent === p.value) {
        p.amount = amount;
        p.dy = (provent / amount) * 100;
      }
    });

    const groupedTransactions = transactionsResume.reduce((acc, cur) => {
      const idx = acc.findIndex((x) => x.ticker === cur.ticker);

      if (idx === -1) {
        const group = transactionsResume.filter((t) => t.ticker === cur.ticker);
        const groupResume = group.reduce(
          (acc, cur) => {
            acc.amount += cur.amount;
            acc.quotas += cur.quotas;
            acc.provents += cur.provents;
            acc.percentProvents += cur.percentProvents;
            return acc;
          },
          { amount: 0, quotas: 0, provents: 0, percentProvents: 0 },
        );

        const averagePrice = groupResume.amount / groupResume.quotas;

        acc.push({
          color: colors[Math.floor(Math.random() * (400 - 1 + 1)) + 1],
          ticker: cur.ticker,
          transactions: [cur],
          currentPrice: cur.currentPrice,
          amount: groupResume.amount,
          quotas: groupResume.quotas,
          provents: groupResume.provents,
          proventsPercent: groupResume.percentProvents / group.filter((x) => x.provents).length || 0,
          averagePrice,
          amountPercent: (groupResume.amount / totals.amount) * 100,
          averagePricePercent: ((cur.currentPrice - averagePrice) / averagePrice) * 100,
        });
      } else {
        acc[idx].transactions.push(cur);
      }
      return acc;
    }, [] as IWalletPerformance['groupedTransactions']);

    return {
      amout: totals.amount,
      provents: totals.provents,
      appreciation: totals.appreciation,
      transactions: transactionsResume,
      groupedTransactions,
      proventsMonth: totals.proventsMonth,
      netProfit: totals.provents + totals.appreciation,
      appreciationPercent: (totals.appreciation / totals.amount) * 100,
      proventsPercent: totals.percentProvents / transactionsResume.filter((t) => t.provents).length || 0,
      portfolioComposition: totals.portfolio
        .map((p, i) => ({ ...p, amountPercent: (p.amount / totals.amount) * 100, color: colors[i + 31] }))
        .sort((a, b) => a.amount - b.amount),
    };
  }
}
