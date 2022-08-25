import puppeteer from 'puppeteer';

export interface IFiiDTO {
  ticker: string;
  sector: string;
  currentPrice: number;
  priceVariation: number;
  dailyLiquidity: number;
  liquidPatrimony: number;
  dividendPrice: number;
  physicalVacancy: number;
  financialVacancy: number;
  amountOfAssets: number;
  accumulatedProfitability: number;
  DY: number;
  DYYear: number;
  DY6M: number;
  DY6MAverage: number;
  DY12M: number;
  DY12MAverage: number;
  VPA: number;
  PVPA: number;
}

export async function getFIIs(): Promise<IFiiDTO[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on('request', (req) => {
    if (['stylesheet', 'font', 'image'].includes(req.resourceType())) req.abort();
    else req.continue();
  });

  await page.goto('https://www.fundsexplorer.com.br/ranking/', {
    waitUntil: 'networkidle2',
  });

  const result = await page.evaluate(() => {
    const data: Array<IFiiDTO> = [];

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
