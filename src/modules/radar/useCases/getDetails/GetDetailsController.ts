import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetDetailsUseCase } from './GetDetailsUseCase';

export class GetDetailsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { fundId } = request.query;
      const getDetailsUseCase = container.resolve(GetDetailsUseCase);

      const result = await getDetailsUseCase.execute(fundId.toString());

      return response.json(result);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }
}
