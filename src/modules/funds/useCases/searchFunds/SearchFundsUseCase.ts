import { injectable, inject } from 'tsyringe';

import { IFundsRepository, IFundsSelect } from '../../repositories/IFundsRepository';

@injectable()
export class SearchFundsUseCase {
  constructor(
    @inject('FundsRepository')
    private fundsRepository: IFundsRepository,
  ) {}

  async execute(text: string): Promise<IFundsSelect[]> {
    return this.fundsRepository.findByText(text);
  }
}
