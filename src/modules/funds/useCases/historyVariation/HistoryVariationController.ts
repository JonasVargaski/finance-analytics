import { parseISO } from 'date-fns';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HistoryVariationUseCase } from './HistoryVariationUseCase';

export class HistoryVariationController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { ticker, startDate, endDate } = request.query;
      const historyVariationUseCase = container.resolve(HistoryVariationUseCase);

      const result = await historyVariationUseCase.execute(
        ticker.toString(),
        parseISO(startDate.toString()),
        parseISO(endDate.toString()),
      );

      return response.json(result);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }
}
