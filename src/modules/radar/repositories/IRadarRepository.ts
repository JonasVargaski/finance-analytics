export interface IRadar {
  id: string;
  fundId: string;
  ticker: string;
  name: string;
  description: string;
}

export interface ICreateRadar {
  userId: string;
  fundId: string;
}

export interface IRadarRepository {
  create(data: ICreateRadar): Promise<IRadar>;
  findAll(userId: string): Promise<IRadar[]>;
  exclude(id: string): Promise<void>;
}
