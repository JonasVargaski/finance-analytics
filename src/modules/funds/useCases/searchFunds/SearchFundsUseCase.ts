import { injectable, inject } from 'tsyringe';

import { IFundsRepository, IFundResumed } from '../../repositories/IFundsRepository';

@injectable()
export class SearchFundsUseCase {
  constructor(
    @inject('FundsRepository')
    private fundsRepository: IFundsRepository,
  ) {}

  async execute(text: string): Promise<IFundResumed[]> {
    return this.fundsRepository.findByText(text);
  }
}
