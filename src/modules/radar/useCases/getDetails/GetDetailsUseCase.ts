import { injectable, inject } from 'tsyringe';
import { IFiiScrapProvider } from '../../../../shared/scraps/fiis/IFiiScrapProvider';
import { IFundsRepository } from '../../../funds/repositories/IFundsRepository';

interface IResultData {
  [key: string]: any;
}

@injectable()
export class GetDetailsUseCase {
  constructor(
    @inject('FiiScrapProvider')
    private scrapProvider: IFiiScrapProvider,
    @inject('FundsRepository')
    private fundsRepository: IFundsRepository,
  ) {}

  async execute(fundId: string): Promise<IResultData> {
    const fund = await this.fundsRepository.find(fundId);
    if (!fund) throw new Error('Asset not found in database');

    const dataScrap = await this.scrapProvider.findDetails([fund.ticker]);
    return dataScrap[0].data; // replace for cache provider
  }
}
