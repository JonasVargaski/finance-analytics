import { Router } from 'express';

import { fundsRouter } from './funds.routes';
import { walletsRouter } from './wallets.routes';

const appRouter = Router();

appRouter.use('/funds', fundsRouter);
appRouter.use('/wallets', walletsRouter);

export { appRouter };
