export class Wallet {
  public readonly id: string;

  public name: string;
  public description: string;

  constructor(props: Omit<Wallet, 'id'>) {
    Object.assign(this, props);
  }
}
