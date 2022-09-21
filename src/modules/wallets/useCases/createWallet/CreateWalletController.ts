import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateWalletUseCase } from './CreateWalletUseCase';

export class CreateWalletsController {
  async handle(request: Request, response: Response): Promise<void> {
    try {
      const createWalletUseCase = container.resolve(CreateWalletUseCase);
      const wallet = request.body;
      const { userId } = request;

      const result = await createWalletUseCase.execute(userId, wallet);

      response.json(result);
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }
}
