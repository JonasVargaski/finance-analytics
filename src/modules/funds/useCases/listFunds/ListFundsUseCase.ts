import { injectable, inject } from 'tsyringe';

import { IFundsRepository, IFundResumed } from '../../repositories/IFundsRepository';

@injectable()
export class ListFundsUseCase {
  constructor(
    @inject('FundsRepository')
    private fundsRepository: IFundsRepository,
  ) {}

  async execute(): Promise<IFundResumed[]> {
    return this.fundsRepository.findAll();
  }
}
