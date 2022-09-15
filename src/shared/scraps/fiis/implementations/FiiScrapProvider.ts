import axios from 'axios';
import puppeteer from 'puppeteer';
import { format, parse } from 'date-fns';

import { IFiiScrapProvider, IFii, IQuotation, IProvent, IQuotationHistory } from '../IFiiScrapProvider';

export class FiiScrapProvider implements IFiiScrapProvider {
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

  async findQuotations(ticker: string, start: Date, end: Date): Promise<IQuotation[]> {
    type IResultData = {
      data: Array<{
        prices: Array<{
          price: number;
          date: string;
        }>;
      }>;
    };

    const { data } = await axios.get<IResultData>('https://statusinvest.com.br/fii/tickerpricerange', {
      params: { ticker, start: format(start, 'yyyy-MM-dd'), end: format(end, 'yyyy-MM-dd') },
    });

    data.data[0].prices.reverse();
    const currentDate = new Date();

    return data.data[0].prices.map((quotation) => ({
      date: parse(quotation.date, 'dd/MM/yy HH:mm', currentDate),
      value: quotation.price,
    }));
  }

  async findQuotationsOfDay(ticker: string): Promise<IQuotation[]> {
    type IResultData = {
      data: Array<{
        prices: Array<{
          price: number;
          date: string;
        }>;
      }>;
    };

    const { data } = await axios.get<IResultData>('https://statusinvest.com.br/fii/tickerpricerange', {
      params: { ticker, type: -1 },
    });

    data.data[0].prices.reverse();
    const currentDate = new Date();

    return data.data[0].prices.map((quotation) => ({
      date: parse(quotation.date, 'dd/MM/yy HH:mm', currentDate),
      value: quotation.price,
    }));
  }

  async findProvents(ticker: string): Promise<IProvent[]> {
    interface IResult {
      assetEarningsModels: Array<{
        ed: string;
        pd: string;
        et: string;
        v: number;
      }>;
    }

    const { data } = await axios.get<IResult>('https://statusinvest.com.br/fii/companytickerprovents', {
      params: { ticker, chartProventsType: 1 },
    });

    const currentDate = new Date();

    return data.assetEarningsModels
      .filter((x) => x.et === 'Rendimento')
      .map((x) => ({
        dividend: x.v,
        baseDate: parse(x.ed, 'dd/MM/yyyy', currentDate),
        paymentDate: parse(x.pd, 'dd/MM/yyyy', currentDate),
      }));
  }

  async findQuotationsLastFiveDays(ticker: string): Promise<IQuotationHistory> {
    interface IResult {
      quotationsDataArrayResponse: Array<string>;
      dateRangeSelectedStringResponse: {
        from: string;
        to: string;
      };
      dataSourceObject: {
        min: string;
        max: string;
        upDown: 'up' | 'down';
        variation: number;
        variationValue: number;
      };
    }

    const { data } = await axios.post<IResult>('https://www.suno.com.br/fundos-imobiliarios/api/quotations/filter/', {
      ticker,
      range: '5D',
    });

    const currentDate = new Date();
    data.quotationsDataArrayResponse.reverse();

    const filtered = {};
    data.quotationsDataArrayResponse.forEach(([date, value]) => {
      filtered[date] = value;
    });

    return {
      from: parse(data.dateRangeSelectedStringResponse.from, 'dd.MM.yyyy', currentDate),
      to: parse(data.dateRangeSelectedStringResponse.to, 'dd.MM.yyyy', currentDate),
      min: Number(data.dataSourceObject.min),
      max: Number(data.dataSourceObject.max),
      variationType: data.dataSourceObject.upDown,
      variationPercent: data.dataSourceObject.variation,
      variation: data.dataSourceObject.variationValue,
      data: Object.entries(filtered).map(([date, value]) => ({
        date: parse(date, 'dd/MM/yyyy HH:mm', currentDate),
        value: Number(value),
      })),
    };
  }
}
