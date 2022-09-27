import { Radar as tRadar } from '@prisma/client';

export class Radar implements tRadar {
  id: string;
  fundId: string;
  userId: string;
}
