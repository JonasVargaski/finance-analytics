import { Router } from 'express';
import { SearchFundsController } from '../modules/funds/useCases/searchFunds/SearchFundsController';

const searchFundsController = new SearchFundsController();

const fundsRouter = Router();

fundsRouter.get('/search', searchFundsController.handle);

export { fundsRouter };
