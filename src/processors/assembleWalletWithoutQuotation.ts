import { addDays, isSameDay, lastDayOfMonth, parse, parseISO } from 'date-fns';
import { AssembleWalletUseCase } from '../modules/wallets/useCases/assembleWallet/AssembleWalletUseCase';
import { getDetails } from '../scraps/statusInvest/getDetail';

interface IItem {
  ticker: string;
  weight: number;
  tradingDate: string;
}

function parseISODate(date) {
  return parse(date, 'dd/MM/yyyy', new Date()).toISOString();
}

export async function assembleWalletWithoutQuotation(items: IItem[], value: number) {
  const dataFiis = await Promise.all(items.map((x) => getDetails(x.ticker)));

  const mapped = items.map((x) => {
    const date = parseISODate(x.tradingDate);
    const fii = dataFiis.find((y) => y.ticker === x.ticker);

    const getQuotation = (month, days) => {
      let quotation = fii.quotations.find((q) => isSameDay(addDays(lastDayOfMonth(month), days), parseISO(q.date)));

      if (days < -31) return undefined;
      if (!quotation) quotation = getQuotation(month, days - 1);
      return quotation;
    };

    console.log();
    const quotation = getQuotation(parseISO(date), 0);

    return { ticker: x.ticker, weight: x.weight, price: quotation?.price, tradingDate: date };
  });

  return new AssembleWalletUseCase().execute(mapped, value);
}
