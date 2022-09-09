import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { env } from '../../../../config/env';
import { prisma } from '../../../../database/prismaClient';

interface IAuthenticateClient {
  email: string;
  password: string;
}

export class AuthenticateUseCase {
  async execute({ email, password }: IAuthenticateClient) {
    const user = await prisma.users.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });

    if (!user) {
      throw new Error('Username or password invalid!');
    }

    const passwordMatch = await compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new Error('Username or password invalid!');
    }

    const token = sign({ email }, env.APP_SECRET, { subject: user.id, expiresIn: '3d' });
    return token;
  }
}
