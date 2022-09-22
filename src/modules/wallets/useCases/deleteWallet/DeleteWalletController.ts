import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { DeleteWalletUseCase } from './DeleteWalletUseCase';

export class DeleteWalletsController {
  async handle(request: Request, response: Response): Promise<void> {
    try {
      const deleteWalletUseCase = container.resolve(DeleteWalletUseCase);
      const { id } = request.query;

      const result = await deleteWalletUseCase.execute(id.toString());

      response.json(result);
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }
}
