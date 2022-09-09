import { Request, Response, Router } from 'express';
import { WalletsRepository } from '../modules/wallets/repositories/implementations/WalletRepository';
import { ListWalletsUseCase } from '../modules/wallets/useCases/listWalletsUseCase/ListWalletsUseCase';

const walletsRouter = Router();

walletsRouter.get('/', async (request: Request, response: Response) => {
  const wallets = await new ListWalletsUseCase(new WalletsRepository()).execute(request.userId);
  return response.json(wallets);
});

export { walletsRouter };
