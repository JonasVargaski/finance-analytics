import { inject, injectable } from 'tsyringe';
import {
  addMonths,
  isBefore,
  lastDayOfMonth,
  isSameDay,
  addDays,
  differenceInMonths,
  isSameMonth,
  format,
} from 'date-fns';

import { IWalletPerformanceDTO } from './PerformanceTransactionsDTO';
import { IFiiScrapProvider } from '../../../../shared/scraps/fiis/IFiiScrapProvider';
import { ITransactionsRepository } from '../../repositories/ITransactionsRepository';

@injectable()
export class PerformanceTransactionsUseCase {
  constructor(
    @inject('FiiScrapProvider')
    private scrapProvider: IFiiScrapProvider,
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
  ) {}

  private findQuotationOfMonth(quotations: Array<{ value: number; date: Date }>, month: Date, days: number) {
    let quotation = quotations.find((q) => isSameDay(addDays(lastDayOfMonth(month), days), q.date));
    if (days < -31) return undefined;
    if (!quotation) quotation = this.findQuotationOfMonth(quotations, month, days - 1);
    return quotation;
  }

  async execute(walletId: string): Promise<IWalletPerformanceDTO> {
    const transactions = await this.transactionsRepository.findActives(walletId);

    const firstTransactionDate = new Date(Math.min(...transactions.map((x) => x.purchaseAt.getTime())));

    const dataScrap = await Promise.all(
      [...new Set(transactions.map((x) => x.fund.ticker))].map(async (ticker) => {
        const quotations = await this.scrapProvider.findQuotations(ticker, firstTransactionDate, new Date());
        const provents = await this.scrapProvider.findProvents(ticker);

        return { ticker, quotations, provents };
      }),
    );

    const transactionsResume = transactions
      .sort((a, b) => a.purchaseAt.getTime() - b.purchaseAt.getTime())
      .map((transaction) => {
        const scrap = dataScrap.find((scrap) => scrap.ticker === transaction.fund.ticker);

        const monthsForDetailedResumeResume = [
          transaction.purchaseAt,
          ...Array.from({ length: differenceInMonths(lastDayOfMonth(new Date()), transaction.purchaseAt) }, (_, i) => {
            const date = addMonths(transaction.purchaseAt, i + 1);
            date.setDate(1);
            return date;
          }),
        ];

        const resumedTransactionMonth = monthsForDetailedResumeResume.map((month, i) => {
          const proventsOfMonth = scrap.provents.find((p) => {
            const itsIncome = isSameMonth(month, p.paymentDate);
            if (!itsIncome) return false;
            const isMonthOfPurchase = i === 0;
            return isMonthOfPurchase ? isBefore(month, p.baseDate) : itsIncome;
          });

          const lastQuotationMonth = this.findQuotationOfMonth(scrap.quotations, month, 0);
          const provents = transaction.quotas * (proventsOfMonth?.dividend || 0);
          const percentProvents = ((proventsOfMonth?.dividend || 0) / transaction.price) * 100;
          const appreciation = (lastQuotationMonth.value - transaction.price) * transaction.quotas;
          const percentAppreciation = ((lastQuotationMonth.value - transaction.price) / transaction.price) * 100;

          return {
            date: month,
            received: proventsOfMonth?.paymentDate ? isBefore(proventsOfMonth.paymentDate, new Date()) : false,
            proventDate: proventsOfMonth?.paymentDate || null,
            quotationDate: lastQuotationMonth.date,
            provents,
            appreciation,
            percentProvents,
            percentAppreciation,
          };
        });

        const amount = transaction.quotas * transaction.price;
        const currentPrice = this.findQuotationOfMonth(scrap.quotations, new Date(), 0)?.value;
        const appreciation = (currentPrice - transaction.price) * transaction.quotas;

        const totalProvents = resumedTransactionMonth.reduce((acc, cur) => {
          acc += cur.provents;
          return acc;
        }, 0);

        const percentProvents = totalProvents
          ? ((totalProvents / amount) * 100) / resumedTransactionMonth.filter((x) => x.provents).length
          : 0;

        const transactionResume = {
          id: transaction.id,
          ticker: transaction.fund.ticker,
          sector: `${transaction.fund.type} - ${transaction.fund.segment}`,
          price: transaction.price,
          quotas: transaction.quotas,
          date: transaction.purchaseAt,
          amount,
          currentPrice,
          netProfit: totalProvents + appreciation,
          netProfitPercent: 0,
          provents: totalProvents,
          appreciation,
          percentProvents,
          percentAppreciation: ((currentPrice - transaction.price) / transaction.price) * 100,
          resume: resumedTransactionMonth,
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
            const formatedDate = format(monthTransaction.date, 'MM/yyyy');
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
        if (idxPortfolio === -1) {
          acc.portfolio.push({ sector: cur.sector, amount: cur.amount, amountPercent: 0, tickers: [cur.ticker] });
        } else {
          acc.portfolio[idxPortfolio].amount += cur.amount;
          if (!acc.portfolio[idxPortfolio].tickers.some((t) => t === cur.ticker))
            acc.portfolio[idxPortfolio].tickers.push(cur.ticker);
        }

        return acc;
      },
      {
        amount: 0,
        provents: 0,
        percentProvents: 0,
        appreciation: 0,
        proventsMonth: [] as IWalletPerformanceDTO['proventsMonth'],
        portfolio: [] as IWalletPerformanceDTO['portfolioComposition'],
      },
    );

    totals.proventsMonth.forEach((p) => {
      const proventMonthDate = lastDayOfMonth(p.date);
      let amount = 0;
      let provent = 0;

      transactionsResume.forEach((t) => {
        if (isBefore(t.date, proventMonthDate)) {
          const tProvents = t.resume.reduce((acc, cur) => {
            if (cur.provents > 0 && isSameMonth(cur.proventDate, proventMonthDate)) {
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

    totals.proventsMonth = totals.proventsMonth.sort((a, b) => (isBefore(a.date, b.date) ? -1 : 1));

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
    }, [] as IWalletPerformanceDTO['groupedTransactions']);

    const totalsProvents = totals.proventsMonth.reduce(
      (acc, cur) => {
        acc.sum += cur.dy * cur.value;
        acc.weight += cur.value;
        return acc;
      },
      { sum: 0, weight: 0 },
    );

    return {
      amout: totals.amount,
      provents: totals.provents,
      appreciation: totals.appreciation,
      transactions: transactionsResume,
      groupedTransactions,
      proventsMonth: totals.proventsMonth,
      netProfit: totals.provents + totals.appreciation,
      appreciationPercent: (totals.appreciation / totals.amount) * 100,
      proventsPercent: totalsProvents.sum / totalsProvents.weight,
      portfolioComposition: totals.portfolio
        .map((p) => ({ ...p, amountPercent: (p.amount / totals.amount) * 100 }))
        .sort((a, b) => a.amount - b.amount),
    };
  }
}
