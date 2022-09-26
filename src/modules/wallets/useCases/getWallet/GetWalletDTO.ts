export interface IGetWalletDTO {
  id: string;
  name: string;
  description: string;
  transactions: {
    id: string;
    fundId: string;
    price: number;
    quotas: number;
    purchaseAt: Date;
  }[];
}
