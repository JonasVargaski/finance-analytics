import { Router } from 'express';

import { ListWalletsController } from '../modules/wallets/useCases/listWallets/ListWalletsController';
import { PerformanceTransactionsController } from '../modules/wallets/useCases/performanceTransactions/PerformanceTransactionsController';

const walletsRouter = Router();

const listWalletsController = new ListWalletsController();
const performanceTransactionsController = new PerformanceTransactionsController();

walletsRouter.get('/', listWalletsController.handle);
walletsRouter.get('/performance', performanceTransactionsController.handle);

export { walletsRouter };
