import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListRadarUseCase } from './ListRadarUseCase';

export class ListRadarController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listRadarUseCase = container.resolve(ListRadarUseCase);

      const result = await listRadarUseCase.execute(request.userId);

      return response.json(result);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }
}
