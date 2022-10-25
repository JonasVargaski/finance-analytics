import { container } from 'tsyringe';

import { ITransactionsRepository } from '../../modules/wallets/repositories/ITransactionsRepository';
import { TransactionsRepository } from '../../modules/wallets/repositories/implementations/TransactionsRepository';

import { IWalletsRepository } from '../../modules/wallets/repositories/IWalletsRepository';
import { WalletsRepository } from '../../modules/wallets/repositories/implementations/WalletsRepository';

import { IFundsRepository } from '../../modules/funds/repositories/IFundsRepository';
import { FundsRepository } from '../../modules/funds/repositories/implementations/FundsRepository';

import { IRadarRepository } from '../../modules/radar/repositories/IRadarRepository';
import { RadarRepository } from '../../modules/radar/repositories/implementations/RadarRepository';

import { IFiiScrapProvider } from '../scraps/fiis/IFiiScrapProvider';
import { FiiScrapProvider } from '../scraps/fiis/implementations/FiiScrapProvider';

import { ICacheProvider } from '../cache/ICacheProvider';
import { CacheProvider } from '../cache/implementations/CacheProvider';

container.registerSingleton<IWalletsRepository>('WalletsRepository', WalletsRepository);
container.registerSingleton<ITransactionsRepository>('TransactionsRepository', TransactionsRepository);
container.registerSingleton<IFundsRepository>('FundsRepository', FundsRepository);
container.registerSingleton<IRadarRepository>('RadarRepository', RadarRepository);

container.registerSingleton<IFiiScrapProvider>('FiiScrapProvider', FiiScrapProvider);
container.registerSingleton<ICacheProvider>('CacheProvider', CacheProvider);
