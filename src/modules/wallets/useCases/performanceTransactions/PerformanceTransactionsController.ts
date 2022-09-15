import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { PerformanceTransactionsUseCase } from './PerformanceTransactionsUseCase';

class PerformanceTransactionsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.query;
      const performanceTransactionsUseCase = container.resolve(PerformanceTransactionsUseCase);

      const result = await performanceTransactionsUseCase.execute(id.toString());
      return response.json(result);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }
}

export { PerformanceTransactionsController };
