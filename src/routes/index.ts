import { Router } from 'express';
import { walletsRouter } from './wallets.routes';

const appRouter = Router();

appRouter.use('/wallets', walletsRouter);

export { appRouter };
