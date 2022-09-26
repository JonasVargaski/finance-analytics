import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListFundsUseCase } from './ListFundsUseCase';

export class ListFundsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listFundsUseCase = container.resolve(ListFundsUseCase);
      const result = await listFundsUseCase.execute();

      return response.json(result);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }
}
