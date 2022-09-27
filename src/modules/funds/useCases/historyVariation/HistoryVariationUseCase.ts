import { isAfter, isBefore } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import { IFiiScrapProvider, IVariation } from '../../../../shared/scraps/fiis/IFiiScrapProvider';

@injectable()
export class HistoryVariationUseCase {
  constructor(
    @inject('FiiScrapProvider')
    private scrapProvider: IFiiScrapProvider,
  ) {}

  async execute(ticker: string, startDate: Date, endDate: Date): Promise<IVariation[]> {
    if (isBefore(endDate, startDate)) throw new Error('The end date cannot be greater than the start date');
    if (isAfter(endDate, new Date())) throw new Error('The end date cannot be greater than the current date');

    return this.scrapProvider.findHistoryVariation(ticker, startDate, endDate);
  }
}
