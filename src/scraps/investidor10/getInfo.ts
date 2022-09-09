import puppeteer from 'puppeteer';

interface IData {
  key: string;
  value: string;
}

interface IResult {
  ticker: string;
  details: IData[];
}

export async function getInfo(tickers: string[]): Promise<IResult[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on('request', (req) => {
    if (!/https:\/\/investidor10\.com\.br\/fiis\//gm.test(req.url())) req.abort();
    else req.continue();
  });

  const result: Array<IResult> = [];

  async function queueGetDetail(tickerIdx: number): Promise<void> {
    const ticker = tickers[tickerIdx];
    if (!ticker) return;

    try {
      await page.goto(`https://investidor10.com.br/fiis/${ticker}/`, { waitUntil: 'networkidle2' });

      const data = await page.evaluate(() => {
        const result: IData[] = [];
        const table = document.querySelector('#table-indicators');
        const labels = table.querySelectorAll('.desc');
        const values = table.querySelectorAll('.value');

        labels.forEach((label, i) => {
          result.push({
            key: label
              .querySelector('.name')
              .textContent.replace(/([\n ])/g, '')
              .toLowerCase(),
            value: values[i]?.textContent?.replace(/([\n])/g, ''),
          });
        });
        return result;
      });

      result.push({ ticker, details: data });
    } catch (error) {
      console.log(ticker, '--', error.message);
    } finally {
      console.log(`${tickerIdx + 1} de ${tickers.length}`);
      await queueGetDetail(tickerIdx + 1);
    }
  }

  await queueGetDetail(0);

  browser.close();
  return result;
}
