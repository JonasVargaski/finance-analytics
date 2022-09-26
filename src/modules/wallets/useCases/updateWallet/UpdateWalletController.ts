import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdateWalletUseCase } from './UpdateWalletUseCase';

export class UpdateWalletsController {
  async handle(request: Request, response: Response): Promise<void> {
    try {
      const createWalletUseCase = container.resolve(UpdateWalletUseCase);
      const wallet = request.body;

      const result = await createWalletUseCase.execute(wallet);

      response.json(result);
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }
}
