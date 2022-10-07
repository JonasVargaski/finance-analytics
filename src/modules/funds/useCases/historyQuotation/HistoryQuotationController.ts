import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HistoryQuotationUseCase, tPeriod } from './HistoryQuotationUseCase';

export class HistoryQuotationController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { ticker, period } = request.query;
      const historyQuotationUseCase = container.resolve(HistoryQuotationUseCase);

      const result = await historyQuotationUseCase.execute(ticker.toString(), period as tPeriod);

      return response.json(result);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }
}
