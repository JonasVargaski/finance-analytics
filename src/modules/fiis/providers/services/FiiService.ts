import { IFii } from '../IFiiProvider';
import { ScrapProvider } from '../implementations/ScrapProvider';

export class FiiServic {
  constructor(private scrapProvider: ScrapProvider) {}

  async getAll(): Promise<IFii[]> {
    return this.scrapProvider.findAllResumed();
  }
}
