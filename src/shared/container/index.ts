import { container } from 'tsyringe';

import { ITransactionsRepository } from '../../modules/wallets/repositories/ITransactionsRepository';
import { TransactionsRepository } from '../../modules/wallets/repositories/implementations/TransactionsRepository';

import { IWalletsRepository } from '../../modules/wallets/repositories/IWalletsRepository';
import { WalletsRepository } from '../../modules/wallets/repositories/implementations/WalletsRepository';

import { IFundsRepository } from '../../modules/funds/repositories/IFundsRepository';
import { FundsRepository } from '../../modules/funds/repositories/implementations/FundsRepository';

import { IFiiScrapProvider } from '../scraps/fiis/IFiiScrapProvider';
import { FiiScrapProvider } from '../scraps/fiis/implementations/FiiScrapProvider';

container.registerSingleton<IWalletsRepository>('WalletsRepository', WalletsRepository);
container.registerSingleton<ITransactionsRepository>('TransactionsRepository', TransactionsRepository);
container.registerSingleton<IFundsRepository>('FundsRepository', FundsRepository);

container.registerSingleton<IFiiScrapProvider>('FiiScrapProvider', FiiScrapProvider);
