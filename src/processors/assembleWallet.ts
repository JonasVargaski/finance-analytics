/* eslint-disable no-loop-func */
interface IRecomendation {
  ticker: string;
  weight: number;
  price: number;
  tradingDate: string;
}

interface IWallet extends Omit<IRecomendation, 'weight'> {
  amount: number;
  quotas: number;
}

export function assembleWallet(recomentations: IRecomendation[], value: number) {
  let restValue = value;
  const wallet: Array<IWallet> = [];
  let totalQuotas = 0;
  let weightCorrection = 0;

  while (recomentations.some((x) => x.price <= restValue) && weightCorrection < 99) {
    let amountTotal = 0;

    recomentations.forEach((fii) => {
      const partialValue = Math.floor(((fii.weight + weightCorrection) * restValue) / 100);
      const quotas = Math.floor(partialValue / fii.price);
      const amount = quotas * fii.price;

      if (quotas < 1 || restValue - (amountTotal + amount) < 0) return;
      totalQuotas += quotas;
      amountTotal += amount;
      const idx = wallet.findIndex((x) => x.ticker === fii.ticker);
      if (idx === -1)
        wallet.push({
          ticker: fii.ticker,
          quotas,
          price: fii.price,
          amount,
          tradingDate: fii.tradingDate,
        });
      else {
        wallet[idx].amount += amount;
        wallet[idx].quotas += quotas;
      }
    });

    restValue -= amountTotal;
    weightCorrection += 1;
  }

  return { totalValue: value - restValue, restValue, totalQuotas, items: wallet };
}
