import { Router } from 'express';
import { AssembleWalletController } from '../modules/wallets/useCases/assembleWallet/AssembleWalletController';

import { ListWalletsController } from '../modules/wallets/useCases/listWallets/ListWalletsController';
import { CreateWalletsController } from '../modules/wallets/useCases/createWallet/CreateWalletController';
import { PerformanceTransactionsController } from '../modules/wallets/useCases/performanceTransactions/PerformanceTransactionsController';
import { DeleteWalletsController } from '../modules/wallets/useCases/deleteWallet/DeleteWalletController';
import { GetWalletsController } from '../modules/wallets/useCases/getWallet/GetWalletController';
import { UpdateWalletsController } from '../modules/wallets/useCases/updateWallet/UpdateWalletController';

const walletsRouter = Router();

const getWalletController = new GetWalletsController();
const updateWalletController = new UpdateWalletsController();
const listWalletsController = new ListWalletsController();
const createWalletsController = new CreateWalletsController();
const deleteWalletsController = new DeleteWalletsController();
const performanceTransactionsController = new PerformanceTransactionsController();
const assembleWalletController = new AssembleWalletController();

walletsRouter.get('/all', listWalletsController.handle);
walletsRouter.get('/', getWalletController.handle);
walletsRouter.post('/', createWalletsController.handle);
walletsRouter.put('/', updateWalletController.handle);
walletsRouter.delete('/', deleteWalletsController.handle);
walletsRouter.get('/performance', performanceTransactionsController.handle);
walletsRouter.post('/assemble', assembleWalletController.handle);

export { walletsRouter };
