import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListWalletsUseCase } from './ListWalletsUseCase';

class ListWalletsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listWalletsUseCase = container.resolve(ListWalletsUseCase);
      const wallets = await listWalletsUseCase.execute(request.userId);
      return response.json(wallets);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }
}

export { ListWalletsController };
