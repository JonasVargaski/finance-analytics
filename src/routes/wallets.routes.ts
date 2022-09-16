import { Router } from 'express';
import { AssembleWalletController } from '../modules/wallets/useCases/assembleWallet/AssembleWalletController';

import { ListWalletsController } from '../modules/wallets/useCases/listWallets/ListWalletsController';
import { PerformanceTransactionsController } from '../modules/wallets/useCases/performanceTransactions/PerformanceTransactionsController';

const walletsRouter = Router();

const listWalletsController = new ListWalletsController();
const performanceTransactionsController = new PerformanceTransactionsController();
const assembleWalletController = new AssembleWalletController();

walletsRouter.get('/', listWalletsController.handle);
walletsRouter.get('/performance', performanceTransactionsController.handle);
walletsRouter.post('/assemble', assembleWalletController.handle);

export { walletsRouter };
