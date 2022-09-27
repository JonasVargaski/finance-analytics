import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateRadarUseCase } from './CreateradarUseCase';

export class CreateRadarController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { userId } = request;
      const { fundId } = request.body;

      const createRadarUseCase = container.resolve(CreateRadarUseCase);

      const result = await createRadarUseCase.execute({ fundId, userId });

      return response.json(result);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }
}
