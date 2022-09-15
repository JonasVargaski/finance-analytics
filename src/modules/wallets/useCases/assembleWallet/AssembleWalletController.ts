import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AssembleWalletUseCase } from './AssembleWalletUseCase';

export class AssembleWalletController {
  handle(request: Request, response: Response): void {
    try {
      const { wallet, value } = request.body;
      const performanceTransactionsUseCase = container.resolve(AssembleWalletUseCase);

      performanceTransactionsUseCase.execute(wallet, value);
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }
}
