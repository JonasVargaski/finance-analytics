import { addDays, addMonths } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import { IFiiScrapProvider, IQuotation } from '../../../../shared/scraps/fiis/IFiiScrapProvider';

export type tPeriod = '1D' | '3D' | '5D' | '15D' | '1M' | '3M' | '6M';
@injectable()
export class HistoryQuotationUseCase {
  constructor(
    @inject('FiiScrapProvider')
    private scrapProvider: IFiiScrapProvider,
  ) {}

  private getDiffDateFromPeriod(period) {
    const currentDate = new Date();
    const mapped = {
      '1D': currentDate,
      '3D': addDays(currentDate, -3),
      '5D': addDays(currentDate, -4),
      '15D': addDays(currentDate, -15),
      '1M': addMonths(currentDate, -1),
      '3M': addMonths(currentDate, -3),
      '6M': addMonths(currentDate, -6),
    };
    return mapped[period] ?? mapped['3D'];
  }

  async execute(ticker: string, period: tPeriod): Promise<IQuotation[]> {
    return this.scrapProvider.findQuotationsOfPeriod(ticker, this.getDiffDateFromPeriod(period));
  }
}
