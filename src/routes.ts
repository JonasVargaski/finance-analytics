import { Router } from 'express';
import { AssembleWalletUseCase } from './modules/wallets/useCases/assembleWallet/AssembleWalletUseCase';
import { wallets } from './data/mockData';
import { getWalletDetails } from './processors/getWalletDetails';
import { assembleWalletWithoutQuotation } from './processors/assembleWalletWithoutQuotation';
import { PerformanceTransactionsUseCase } from './modules/wallets/useCases/performanceTransactionsUseCase/PerformanceTransactionsUseCase';
import fiis from './data/fiis';

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
  const { id } = req.query;
  const wallet = wallets.find((x) => x.id === id);
  if (!id) return res.status(400).send('Not found');
  const itemsWithSector = wallet.items.map((x) => ({ ...x, sector: fiis.find((y) => y.ticker === x.ticker).sector }));
  const result = await new PerformanceTransactionsUseCase().execute(itemsWithSector);
  return res.status(200).json(result);
});

router.get('/wallet/performance/:id', async (req, res) => {
  const { id } = req.params;
  const { items } = wallets.find((x) => x.id === id);

  const result = await getWalletDetails(items);
  res.status(200).json(result);
});

router.get('/wallet', (req, res) => {
  res.status(200).json(wallets);
});

export { router };
