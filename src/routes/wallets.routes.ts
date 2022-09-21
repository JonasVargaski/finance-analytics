import { Router } from 'express';
import { AssembleWalletController } from '../modules/wallets/useCases/assembleWallet/AssembleWalletController';

import { ListWalletsController } from '../modules/wallets/useCases/listWallets/ListWalletsController';
import { CreateWalletsController } from '../modules/wallets/useCases/createWallet/CreateWalletController';
import { PerformanceTransactionsController } from '../modules/wallets/useCases/performanceTransactions/PerformanceTransactionsController';

const walletsRouter = Router();

const listWalletsController = new ListWalletsController();
const createWalletsController = new CreateWalletsController();
const performanceTransactionsController = new PerformanceTransactionsController();
const assembleWalletController = new AssembleWalletController();

walletsRouter.get('/', listWalletsController.handle);
walletsRouter.post('/', createWalletsController.handle);
walletsRouter.get('/performance', performanceTransactionsController.handle);
walletsRouter.post('/assemble', assembleWalletController.handle);

export { walletsRouter };
