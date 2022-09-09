import { Request, Response, NextFunction } from 'express';

export async function mockUserId(request: Request, response: Response, next: NextFunction) {
  request.userId = 'ae39530b-ed46-4c9b-aff2-8971195e3b5f';
  return next();
}
