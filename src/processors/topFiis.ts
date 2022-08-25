import fs from 'fs';
import path from 'path';

import { IFiiDTO } from '../scraps/foundsExplorer';
import { currency, percent } from '../utils/numberFormat';

interface ISector {
  sector: string;
  DY: number;
  DY12MAverage: number;
  DY6MAverage: number;
  data: IFiiDTO[];
}

export function getTopFiis() {
  const fileDir = path.resolve(__dirname, '..', 'data', 'fiis.json');

  const data = JSON.parse(fs.readFileSync(fileDir, { encoding: 'utf-8' })) as IFiiDTO[];

  const groups: ISector[] = [];

  data.forEach((fii) => {
    const idx = groups.findIndex((x) => x.sector === fii.sector);
    if (idx === -1) groups.push({ sector: fii.sector, data: [fii], DY: 0, DY12MAverage: 0, DY6MAverage: 0 });
    else groups[idx].data.push(fii);
  });

  groups.forEach((group) => {
    const filtered = group.data.filter((x) => x.DY >= 0);
    const filtered6M = group.data.filter((x) => x.DY6MAverage >= 0);
    const filtered12M = group.data.filter((x) => x.DY12MAverage >= 0);

    group.DY =
      filtered.reduce((acc, cur) => {
        acc += cur.DY;
        return acc;
      }, 0) / filtered.length;

    group.DY6MAverage =
      filtered6M.reduce((acc, cur) => {
        acc += cur.DY6MAverage;
        return acc;
      }, 0) / filtered6M.length;

    group.DY12MAverage =
      filtered12M.reduce((acc, cur) => {
        acc += cur.DY12MAverage;
        return acc;
      }, 0) / filtered12M.length;
  });

  const top = data
    .filter(
      (fii) =>
        fii.dailyLiquidity > 5000 &&
        fii.PVPA < 1 &&
        fii.DY12MAverage > groups.find((g) => g.sector === fii.sector).DY12MAverage &&
        fii.DY12MAverage > 0.7 &&
        fii.accumulatedProfitability > -5,
    )
    .map((x) => ({
      Ticker: x.ticker,
      Setor: x.sector,
      Valor: currency.format(x.currentPrice),
      DY: percent.format(x.DY),
      'DY 6m': percent.format(x.DY6MAverage),
      'DY 12m': percent.format(x.DY12MAverage),
      'DY 12m Setor': percent.format(groups.find((g) => g.sector === x.sector).DY12MAverage),
      'P/VPA': percent.format(x.PVPA),
      'Rent. Acumulada': percent.format(x.accumulatedProfitability),
    }));

  return top;
}
