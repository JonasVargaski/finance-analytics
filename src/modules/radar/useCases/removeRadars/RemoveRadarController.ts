import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { RemoveRadarUseCase } from './RemoveRadarUseCase';

export class RemoveRadarController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const removeRadarUseCase = container.resolve(RemoveRadarUseCase);
      const { id } = request.query;

      const result = await removeRadarUseCase.execute(id.toString());

      return response.json(result);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }
}
