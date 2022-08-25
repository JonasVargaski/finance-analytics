import axios from 'axios';
import { parse } from 'date-fns';

interface IQuotation {
  prices: Array<{
    price: number;
    date: string;
  }>;
}

interface IProvent {
  assetEarningsModels: Array<{
    ed: string;
    pd: string;
    et: string;
    v: number;
  }>;
}

export interface IFiiDetailDTO {
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

export async function getDetails(ticker: string): Promise<IFiiDetailDTO> {
  const [quotations, provents] = await Promise.all([
    axios.get<IQuotation[]>(`https://statusinvest.com.br/fii/tickerprice?ticker=${ticker}&type=4`),
    axios.get<IProvent>(`https://statusinvest.com.br/fii/companytickerprovents?ticker=${ticker}&chartProventsType=1`),
  ]);

  quotations.data[0].prices.reverse();
  const currentDate = new Date();

  const formattedQuotations = quotations.data[0].prices.map((x) => {
    const date = parse(x.date, 'dd/MM/yy HH:mm', currentDate);
    return { date: date.toISOString(), price: x.price };
  });

  const formattedProvents = provents.data.assetEarningsModels
    .filter((x) => x.et === 'Rendimento')
    .map((x) => {
      const baseDate = parse(x.ed, 'dd/MM/yyyy', currentDate);
      const paymentdDate = parse(x.pd, 'dd/MM/yyyy', currentDate);
      return {
        dividend: x.v,
        baseDate: baseDate.toISOString(),
        paymentDate: paymentdDate.toISOString(),
      };
    });

  return { ticker, provents: formattedProvents, quotations: formattedQuotations };
}
