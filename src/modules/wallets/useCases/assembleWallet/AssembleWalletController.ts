import { Request, Response } from 'express';
import { AssembleWalletUseCase } from './AssembleWalletUseCase';

export class AssembleWalletController {
  constructor(private assembleWalletUseCase: AssembleWalletUseCase) {}

  handle(request: Request, response: Response): void {
    const { wallet, value } = request.body;
    try {
      this.assembleWalletUseCase.execute(wallet, value);
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }
}
