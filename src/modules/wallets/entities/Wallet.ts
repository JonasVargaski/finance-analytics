import { Wallets as tWallets } from '@prisma/client';

export class Wallets implements tWallets {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
