import {
  addMonths,
  isBefore,
  parseISO,
  lastDayOfMonth,
  isSameDay,
  addDays,
  differenceInMonths,
  isSameMonth,
} from 'date-fns';

import { getDetails } from '../scraps/statusInvest/getDetail';

interface IWallet {
  ticker: string;
  quotas: number;
  price: number;
  tradingDate: string;
}

export async function getWalletDetails(wallet: IWallet[]) {
  const fiisDetails = await Promise.all([...new Set(wallet.map((x) => x.ticker))].map(getDetails));

  return wallet
    .sort((a, b) => parseISO(a.tradingDate).getTime() - parseISO(b.tradingDate).getTime())
    .map((fii) => {
      const fiiDetails = fiisDetails.find((fiiDetailed) => fiiDetailed.ticker === fii.ticker);

      const tradingDate = parseISO(fii.tradingDate);

      const months = [
        tradingDate,
        ...Array.from({ length: differenceInMonths(new Date(), tradingDate) }, (_, i) => {
          const date = addMonths(tradingDate, i + 1);
          date.setDate(1);
          return date;
        }),
      ];

      const getQuotation = (month, days) => {
        let quotation = fiiDetails.quotations.find((q) =>
          isSameDay(addDays(lastDayOfMonth(month), days), parseISO(q.date)),
        );

        if (days < -31) return undefined;
        if (!quotation) quotation = getQuotation(month, days - 1);
        return quotation;
      };

      const groupedResult = months.map((month, i) => {
        const proventsMonth = fiiDetails.provents.find((p) => {
          const itsIncome = isSameMonth(month, parseISO(p.paymentDate));
          if (!itsIncome) return false;
          const isMonthOfTrading = i === 0;
          return isMonthOfTrading ? isBefore(month, parseISO(p.baseDate)) : itsIncome;
        });

        const lastQuotationMonth = getQuotation(month, 0);
        const provents = fii.quotas * (proventsMonth?.dividend || 0);
        const percentProvents = ((proventsMonth?.dividend || 0) / fii.price) * 100;
        const appreciation = (lastQuotationMonth.price - fii.price) * fii.quotas;
        const percentAppreciation = ((lastQuotationMonth.price - fii.price) / fii.price) * 100;

        return {
          date: month,
          proventDate: proventsMonth?.paymentDate || null,
          quotationDate: lastQuotationMonth.date,
          provents,
          percentProvents,
          appreciation,
          percentAppreciation,
        };
      });

      const amount = fii.quotas * fii.price;
      const currentPrice = getQuotation(new Date(), 0).price;
      const appreciation = (currentPrice - fii.price) * fii.quotas;

      const totalProvents = groupedResult.reduce((acc, cur) => {
        acc += cur.provents;
        return acc;
      }, 0);

      const percentProvents = totalProvents
        ? ((totalProvents / amount) * 100) / groupedResult.filter((x) => x.provents).length
        : 0;

      const transactionResume = {
        ticker: fii.ticker,
        price: fii.price,
        quotas: fii.quotas,
        date: fii.tradingDate,
        amount,
        currentPrice,
        netProfit: totalProvents + appreciation,
        netProfitPercent: 0,
        provents: totalProvents,
        percentProvents,
        appreciation,
        percentAppreciation: ((currentPrice - fii.price) / fii.price) * 100,
        resume: groupedResult,
      };

      transactionResume.netProfitPercent =
        ((transactionResume.provents + transactionResume.appreciation) / transactionResume.amount) * 100;

      return transactionResume;
    });
}
