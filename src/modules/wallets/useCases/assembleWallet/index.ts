import { AssembleWalletController } from './AssembleWalletController';
import { AssembleWalletUseCase } from './AssembleWalletUseCase';

const assembleWalletUseCase = new AssembleWalletUseCase();
const assembleWalletController = new AssembleWalletController(assembleWalletUseCase);

export { assembleWalletUseCase, assembleWalletController };
