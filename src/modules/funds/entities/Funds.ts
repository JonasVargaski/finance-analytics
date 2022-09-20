import { Funds as tFunds } from '@prisma/client';

export class Funds implements tFunds {
  id: string;
  ticker: string;
  name: string;
  description: string;
  type: string;
  segment: string;
  mandate: string;
  createdAt: Date;
  updatedAt: Date;
}
