import { Router } from 'express';
import { CreateRadarController } from '../modules/radar/useCases/createRadar/CreateRadarController';
import { GetDetailsController } from '../modules/radar/useCases/getDetails/GetDetailsController';
import { ListRadarController } from '../modules/radar/useCases/listRadars/ListRadarController';
import { RemoveRadarController } from '../modules/radar/useCases/removeRadars/RemoveRadarController';

const listRadarController = new ListRadarController();
const createRadarController = new CreateRadarController();
const removeRadarController = new RemoveRadarController();
const getDetailsController = new GetDetailsController();

const radarRouter = Router();

radarRouter.get('/', listRadarController.handle);
radarRouter.get('/details', getDetailsController.handle);
radarRouter.post('/', createRadarController.handle);
radarRouter.delete('/', removeRadarController.handle);

export { radarRouter };
