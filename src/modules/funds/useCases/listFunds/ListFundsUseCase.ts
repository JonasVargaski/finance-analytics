import { injectable, inject } from 'tsyringe';

import { IFundsRepository, IFundsSelect } from '../../repositories/IFundsRepository';

@injectable()
export class ListFundsUseCase {
  constructor(
    @inject('FundsRepository')
    private fundsRepository: IFundsRepository,
  ) {}

  async execute(): Promise<IFundsSelect[]> {
    return this.fundsRepository.findAll();
  }
}
