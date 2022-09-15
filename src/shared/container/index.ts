import { container } from 'tsyringe';

import { TransactionsRepository } from '../../modules/wallets/repositories/implementations/TransactionsRepository';
import { WalletsRepository } from '../../modules/wallets/repositories/implementations/WalletsRepository';

import { ITransactionsRepository } from '../../modules/wallets/repositories/ITransactionsRepository';
import { IWalletsRepository } from '../../modules/wallets/repositories/IWalletsRepository';

import { IFiiScrapProvider } from '../scraps/fiis/IFiiScrapProvider';
import { FiiScrapProvider } from '../scraps/fiis/implementations/FiiScrapProvider';

container.registerSingleton<IWalletsRepository>('WalletsRepository', WalletsRepository);
container.registerSingleton<ITransactionsRepository>('TransactionsRepository', TransactionsRepository);
container.registerSingleton<IFiiScrapProvider>('FiiScrapProvider', FiiScrapProvider);
