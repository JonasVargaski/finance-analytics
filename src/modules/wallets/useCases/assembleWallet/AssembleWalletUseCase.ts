/* eslint-disable no-loop-func */
import { addDays, addMonths, differenceInMonths, isAfter, isBefore, isSameDay } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import { IFiiScrapProvider } from '../../../../shared/scraps/fiis/IFiiScrapProvider';
import { IGenerateDTO, IAssembleWalletDTO } from './AssembleWalletDTO';

@injectable()
export class AssembleWalletUseCase {
  constructor(
    @inject('FiiScrapProvider')
    private scrapProvider: IFiiScrapProvider,
  ) {}

  private findQuotation(quotations: Array<{ value: number; date: Date }>, date: Date, days: number) {
    let quotation = quotations.find((q) => isSameDay(addDays(date, days), q.date));
    if (days <= -7) return undefined;
    if (!quotation) quotation = this.findQuotation(quotations, date, days - 1);
    return quotation;
  }

  async execute({ actives, startDate, endDate, value }: IGenerateDTO): Promise<IAssembleWalletDTO[]> {
    if (isBefore(endDate, startDate)) throw new Error('The end date cannot be greater than the start date');
    if (isAfter(endDate, new Date())) throw new Error('The end date cannot be greater than the current date');

    const dataScrap = await Promise.all(
      actives.map(async ({ ticker }) => {
        const quotations = await this.scrapProvider.findQuotations(ticker, addDays(startDate, -7), endDate);
        return { ticker, quotations };
      }),
    );

    const monthDates = [
      startDate,
      ...Array.from({ length: differenceInMonths(endDate, startDate) }, (_, i) => addMonths(startDate, i + 1)),
    ];

    const result = monthDates.map<IAssembleWalletDTO>((date) => {
      const activesWithCotations = actives.map((active) => {
        const scrap = dataScrap.find((x) => x.ticker === active.ticker);
        const quotation = this.findQuotation(scrap.quotations, date, 0);
        return { ...active, price: quotation?.value || 9999, date: quotation?.date || date };
      });

      let restValue = value;
      const wallet: IAssembleWalletDTO['itens'] = [];
      let totalQuotas = 0;
      let weightCorrection = 0;
      let quotedAt = null;

      while (activesWithCotations.some((x) => x.price <= restValue) && weightCorrection < 99) {
        let amountTotal = 0;

        activesWithCotations.forEach((active) => {
          const partialValue = Math.floor(((active.weight + weightCorrection) * restValue) / 100);
          const quotas = Math.floor(partialValue / active.price);
          const amount = quotas * active.price;

          if (quotas < 1 || restValue - (amountTotal + amount) < 0) return;
          totalQuotas += quotas;
          amountTotal += amount;
          const idx = wallet.findIndex((x) => x.ticker === active.ticker);
          if (idx === -1) {
            wallet.push({
              quotas,
              amount,
              fundId: active.fundId,
              ticker: active.ticker,
              price: active.price,
              quotedAt: active.date,
            });
            if (!quotedAt) {
              quotedAt = active.date;
            }
          } else {
            wallet[idx].amount += amount;
            wallet[idx].quotas += quotas;
          }
        });

        restValue -= amountTotal;
        weightCorrection += 1;
      }

      return { total: value - restValue, rest: restValue, quotas: totalQuotas, date: quotedAt, itens: wallet };
    });

    result.reverse();
    return result;
  }
}
