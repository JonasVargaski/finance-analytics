import { Router } from 'express';

import { fundsRouter } from './funds.routes';
import { walletsRouter } from './wallets.routes';
import { radarRouter } from './radar.routes';

const appRouter = Router();

appRouter.use('/funds', fundsRouter);
appRouter.use('/wallets', walletsRouter);
appRouter.use('/radar', radarRouter);

export { appRouter };
