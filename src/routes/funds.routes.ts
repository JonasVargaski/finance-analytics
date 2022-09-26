import { Router } from 'express';
import { ListFundsController } from '../modules/funds/useCases/listFunds/ListFundsController';
import { SearchFundsController } from '../modules/funds/useCases/searchFunds/SearchFundsController';

const searchFundsController = new SearchFundsController();
const listFundsController = new ListFundsController();

const fundsRouter = Router();

fundsRouter.get('/search', searchFundsController.handle);
fundsRouter.get('/', listFundsController.handle);

export { fundsRouter };
