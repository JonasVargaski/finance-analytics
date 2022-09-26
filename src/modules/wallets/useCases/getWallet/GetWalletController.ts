import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetWalletUseCase } from './GetWalletUseCase';

export class GetWalletsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const getWalletUseCase = container.resolve(GetWalletUseCase);
      const { id } = request.query;

      const result = await getWalletUseCase.execute(id.toString());

      return response.json(result);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }
}
