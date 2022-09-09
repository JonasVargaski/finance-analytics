import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { env } from '../config/env';

interface IPayload {
  sub: string;
}

export async function ensureAuthenticate(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) return response.status(401).json({ message: 'Not authorized.' });

  const [, token] = authHeader.split(' ');

  try {
    const { sub } = verify(token, env.APP_SECRET) as IPayload;

    request.userId = sub;

    return next();
  } catch (error) {
    return response.status(401).json({ message: 'Not authorized.' });
  }
}
