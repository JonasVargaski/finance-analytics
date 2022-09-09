import { Router } from 'express';
import { AssembleWalletUseCase } from './modules/wallets/useCases/assembleWallet/AssembleWalletUseCase';
import { wallets } from './data/mockData';
import { getWalletDetails } from './processors/getWalletDetails';
import { assembleWalletWithoutQuotation } from './processors/assembleWalletWithoutQuotation';
import { PerformanceTransactionsUseCase } from './modules/wallets/useCases/performanceTransactionsUseCase/PerformanceTransactionsUseCase';
import fiis from './data/fiis';
import colors from './data/colors';
import { ScrapProvider } from './modules/fiis/providers/implementations/ScrapProvider';

const router = Router();

router.post('/wallet/assemble2', async (req, res) => {
  const { items, value } = req.body;
  const result = await assembleWalletWithoutQuotation(items, value);
  res.status(200).json(result);
});

router.post('/wallet/assemble', (req, res) => {
  const { items, value } = req.body;
  const result = new AssembleWalletUseCase().execute(items, value);
  res.status(200).json(result);
});

router.get('/wallet/performance2', async (req, res) => {
  const scrapProvider = new ScrapProvider();

  const { id } = req.query;
  const wallet = wallets.find((x) => x.id === id);
  if (!id) return res.status(400).send('Not found');
  const itemsWithSector = wallet.items.map((x, i) => ({
    ...x,
    id: i.toString(),
    sector: fiis.find((y) => y.ticker === x.ticker).sector,
  }));
  const result = await new PerformanceTransactionsUseCase(scrapProvider).execute(itemsWithSector);
  return res.status(200).json(result);
});

router.get('/wallet/performance/:id', async (req, res) => {
  const { id } = req.params;
  const { items } = wallets.find((x) => x.id === id);

  const result = await getWalletDetails(items);
  res.status(200).json(result);
});

router.get('/wallet', (req, res) => {
  res.status(200).json(
    wallets.map((x) => {
      const amount = x.items.reduce((acc, cur) => {
        acc += cur.quotas * cur.price;
        return acc;
      }, 0);

      return {
        ...x,
        amount,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        items: x.items.map((y, i) => ({
          ...y,
          id: y.ticker + y.tradingDate,
          color: colors[i],
          percent: ((y.price * y.quotas) / amount) * 100,
        })),
      };
    }),
  );
});

export { router };
