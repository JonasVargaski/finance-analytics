export interface ICreateDTO {
  name: string;
  description: string;
  transactions: {
    fundId: string;
    price: number;
    quotas: number;
    purchaseAt: Date;
  }[];
}
