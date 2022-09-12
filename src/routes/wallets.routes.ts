import { Router } from 'express';
import { ListWalletsController } from '../modules/wallets/useCases/listWallets/ListWalletsController';

const walletsRouter = Router();

const listWalletsController = new ListWalletsController();

walletsRouter.get('/', listWalletsController.handle);

export { walletsRouter };
