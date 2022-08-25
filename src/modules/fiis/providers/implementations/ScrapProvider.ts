import axios from 'axios';
import puppeteer from 'puppeteer';
import { parse } from 'date-fns';

import { IFiiProvider, IFii, IFiiDetail } from '../IFiiProvider';

export class ScrapProvider implements IFiiProvider {
  async findAllResumed(): Promise<IFii[]> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on('request', (req) => {
      if (!req.url().includes('https://www.fundsexplorer.com.br/ranking')) req.abort();
      else req.continue();
    });

    await page.goto('https://www.fundsexplorer.com.br/ranking/');

    const result = await page.evaluate(() => {
      const data: Array<IFii> = [];

      document.querySelectorAll('#table-ranking > tbody > tr').forEach((row: HTMLTableRowElement) => {
        data.push({
          ticker: row.cells[0].textContent,
          sector: row.cells[1].textContent || 'Não Informado',
          currentPrice: Number(row.cells[2].getAttribute('data-order')),
          dailyLiquidity: Number(row.cells[3].getAttribute('data-order')),
          dividendPrice: Number(row.cells[4].getAttribute('data-order')),
          DY: Number(row.cells[5].getAttribute('data-order')),
          DY6M: Number(row.cells[7].getAttribute('data-order')),
          DY12M: Number(row.cells[8].getAttribute('data-order')),
          DY6MAverage: Number(row.cells[10].getAttribute('data-order')),
          DY12MAverage: Number(row.cells[11].getAttribute('data-order')),
          DYYear: Number(row.cells[12].getAttribute('data-order')),
          priceVariation: Number(row.cells[13].getAttribute('data-order')),
          liquidPatrimony: Number(row.cells[16].getAttribute('data-order')),
          VPA: Number(row.cells[17].getAttribute('data-order')),
          PVPA: Number(row.cells[18].getAttribute('data-order')),
          accumulatedProfitability: Number(row.cells[15].getAttribute('data-order')),
          physicalVacancy: Number(row.cells[23].getAttribute('data-order')),
          financialVacancy: Number(row.cells[24].getAttribute('data-order')),
          amountOfAssets: Number(row.cells[25].getAttribute('data-order')),
        });
      });

      return data;
    });

    browser.close();
    return result;
  }

  async find(ticker: string): Promise<IFiiDetail> {
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

    const [quotations, provents] = await Promise.all([
      // `https://fii-api.infomoney.com.br/api/v1/fii/cotacao/historico/grafico?Ticker=${ticker}`,
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
}
