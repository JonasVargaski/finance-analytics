import axios from 'axios';
import puppeteer from 'puppeteer';
import { format, parse } from 'date-fns';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';

import { IFiiScrapProvider, IFii, IQuotation, IProvent, IFiiDetail, IVariation } from '../IFiiScrapProvider';

export class FiiScrapProvider implements IFiiScrapProvider {
  private parseToCamelCase(str) {
    return String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/([()./])/g, '')
      .trim()
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
      .replace(/\s+/g, '');
  }

  private mapKeyValueToObject(array: { key: string; value: any }[]) {
    return array.reduce((acc, cur) => {
      acc[this.parseToCamelCase(cur.key)] = cur.value;
      return acc;
    }, {});
  }

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

  async findDetails(tickers: string[]): Promise<IFiiDetail[]> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on('request', (req) => {
      if (
        !(
          req.url().match(/https:\/\/fiis.com.br\/.*\/?scrap=true/i) ||
          req.url().match(/https:\/\/www.fundsexplorer.com.br\/ranking.*\?scrap=true/i)
        )
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const result: IFiiDetail[] = [];

    const process = async (index: number) => {
      const ticker = tickers[index];
      if (!ticker) return;

      try {
        await page.goto(`https://fiis.com.br/${ticker}/?scrap=true`, { waitUntil: 'networkidle2' });

        const scrapData = await page.evaluate(() => {
          const data = [];

          const keys = [];

          const basic = document.querySelector('#informations--basic');

          if (basic) {
            basic.querySelectorAll('.title').forEach((node) => keys.push(node.textContent.trim()));
            const values = basic.querySelectorAll('.value');
            keys.forEach((key, i) => data.push({ key, value: values[i].textContent }));
          }

          const notes = document.querySelector('.notas p');
          if (notes) {
            notes.querySelectorAll('br').forEach((node) => node.replaceWith('\n'));
            data.push({
              key: 'notes',
              value: notes.textContent
                .split('\n')
                .map((x) => x.trim())
                .filter(Boolean),
            });
          }

          return data;
        });

        result.push({
          ticker: ticker.toUpperCase(),
          status: 'success',
          error: null,
          data: this.mapKeyValueToObject(scrapData),
        });
      } catch (error) {
        result.push({ ticker: ticker.toUpperCase(), status: 'error', error: error.message, data: null });
      } finally {
        const nextIndex = index + 1;
        if (tickers[nextIndex]) {
          await process(nextIndex);
        }
      }
    };

    await process(0);

    await page.goto('https://www.fundsexplorer.com.br/ranking?scrap=true');

    const explorerResult = await page.evaluate(() => {
      const data = [];

      const table = document.querySelector('#table-ranking');
      if (table) {
        const keys = [];
        table
          .querySelector('thead tr')
          .querySelectorAll('th')
          .forEach((node) => {
            node.querySelectorAll('br').forEach((n) => n.replaceWith(' '));
            keys.push(node.textContent.replace(/([()./])/g, ''));
          });

        table.querySelectorAll('tbody tr').forEach((row: HTMLTableRowElement) => {
          data.push({
            ticker: row.cells[0].textContent.toUpperCase(),
            value: keys
              .map((key, i) => {
                let value = row.cells[i].getAttribute('data-order') || row.cells[i].textContent;
                // eslint-disable-next-line no-restricted-globals
                if (!isNaN(Number(value)) && Number(value) < -99) {
                  value = null;
                }
                return { key, value };
              })
              .filter((x) => x.value),
          });
        });
      }
      return data;
    });

    result.forEach((result) => {
      if (result.status === 'success') {
        explorerResult
          ?.find((x) => x.ticker === result.ticker)
          ?.value?.forEach((x) => {
            result.data[this.parseToCamelCase(x.key)] = x.value;
          });
      }
    });

    await browser.close();
    return result;
  }

  async findQuotationsOfPeriod(ticker: string, startDate: Date): Promise<IQuotation[]> {
    type IResultData = [number, number, number, number, number, number];

    const { data } = await axios.get<IResultData[]>('https://grafique.enfoque.com.br/ri/wsEmpresas/cotacoes.asmx/ID2', {
      params: { ATIVO: ticker, DATAINICIO: format(startDate, 'yyyy-MM-dd'), MPB: 1, VNOM: 'ON' },
    });

    return data.map((d) => ({ date: zonedTimeToUtc(new Date(d[0]), 'America/Sao_Paulo'), value: d[4] }));
  }

  async findHistoryVariation(ticker: string, startDate: Date, endDate: Date): Promise<IVariation[]> {
    type IResultData = {
      Data: string;
      Abertura: string;
      Maxima: string;
      Minima: string;
      Fechamento: string;
      Media: string;
      Variacao: string;
      Negocios: string;
      Volume: string;
      QuantidadeTitulos: string;
    };

    const { data } = await axios.get<IResultData[]>(
      'https://ri.enfoque.com.br/RIWeb/Empresas/Home/GetHistoricalData/CotacaoHistorica',
      {
        params: {
          ticker,
          startDate: format(startDate, 'dd/MM/yyyy'),
          endDate: format(endDate, 'dd/MM/yyyy'),
          adjsment: true,
          idioma: 1,
        },
      },
    );

    function strToNumber(str: string): number {
      return Number(str.replace(/,/g, '.').replace('%', ''));
    }

    return data.map((d) => ({
      date: parse(d.Data, 'dd/MM/yy', new Date()),
      open: strToNumber(d.Abertura),
      close: strToNumber(d.Fechamento),
      max: strToNumber(d.Maxima),
      min: strToNumber(d.Minima),
      average: strToNumber(d.Media),
      volume: Number(d.Volume.replace(/\./g, '')),
      variation: strToNumber(d.Variacao),
      negotiation: strToNumber(d.Negocios),
      titles: strToNumber(d.QuantidadeTitulos),
    }));
  }
}
