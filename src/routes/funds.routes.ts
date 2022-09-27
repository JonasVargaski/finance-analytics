import { Router } from 'express';
import { HistoryQuotationController } from '../modules/funds/useCases/historyQuotation/HistoryQuotationController';
import { HistoryVariationController } from '../modules/funds/useCases/historyVariation/HistoryVariationController';
import { ListFundsController } from '../modules/funds/useCases/listFunds/ListFundsController';
import { SearchFundsController } from '../modules/funds/useCases/searchFunds/SearchFundsController';

const searchFundsController = new SearchFundsController();
const listFundsController = new ListFundsController();
const historyVariationController = new HistoryVariationController();
const historyQuotationController = new HistoryQuotationController();

const fundsRouter = Router();

fundsRouter.get('/search', searchFundsController.handle);
fundsRouter.get('/history', historyVariationController.handle);
fundsRouter.get('/quotations', historyQuotationController.handle);
fundsRouter.get('/', listFundsController.handle);

export { fundsRouter };
