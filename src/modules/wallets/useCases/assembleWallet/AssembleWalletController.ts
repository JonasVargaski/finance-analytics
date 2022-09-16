import { parseISO } from 'date-fns';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AssembleWalletUseCase } from './AssembleWalletUseCase';

export class AssembleWalletController {
  async handle(request: Request, response: Response): Promise<void> {
    try {
      const performanceTransactionsUseCase = container.resolve(AssembleWalletUseCase);
      const { actives, startDate, endDate, value } = request.body;

      const result = await performanceTransactionsUseCase.execute({
        value,
        actives,
        startDate: parseISO(startDate),
        endDate: parseISO(endDate),
      });

      response.json(result);
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }
}
