import { Request, Response } from 'express';
import { AuthenticateUseCase } from './AuthenticateUseCase';

export class AuthenticateClientController {
  async handle(request: Request, response: Response) {
    const { email, password } = request.body;

    const authenticateUseCase = new AuthenticateUseCase();
    const result = await authenticateUseCase.execute({
      email,
      password,
    });

    return response.json(result);
  }
}
