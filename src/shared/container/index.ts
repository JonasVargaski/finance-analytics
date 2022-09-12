import { container } from 'tsyringe';
import { WalletsRepository } from '../../modules/wallets/repositories/implementations/WalletsRepository';
import { IWalletsRepository } from '../../modules/wallets/repositories/IWalletsRepository';

container.registerSingleton<IWalletsRepository>('WalletsRepository', WalletsRepository);
