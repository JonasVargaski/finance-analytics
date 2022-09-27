import { differenceInMonths } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import { IFiiScrapProvider, IQuotation } from '../../../../shared/scraps/fiis/IFiiScrapProvider';

@injectable()
export class HistoryQuotationUseCase {
  constructor(
    @inject('FiiScrapProvider')
    private scrapProvider: IFiiScrapProvider,
  ) {}

  async execute(ticker: string, startDate: Date): Promise<IQuotation[]> {
    if (differenceInMonths(startDate, new Date()) < -6) throw new Error('The interval cannot be longer than 6 months.');

    return this.scrapProvider.findQuotationsOfPeriod(ticker, startDate);
  }
}
