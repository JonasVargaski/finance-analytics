import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { SearchFundsUseCase } from './SearchFundsUseCase';

export class SearchFundsController {
  async handle(request: Request, response: Response): Promise<void> {
    try {
      const searchFundsUseCase = container.resolve(SearchFundsUseCase);
      const { text } = request.query;

      const result = await searchFundsUseCase.execute(text.toString());

      response.json(result);
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }
}
