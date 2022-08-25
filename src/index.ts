import myWallet from "./data/itauMes8"
import { assembleWallet } from "./processors/assembleWallet"
import * as walletProcessor from "./processors/getWalletDetails"

async function walletProcess() {
  const result = await walletProcessor.run(myWallet)
  const resume = result.reduce(
    (acc, cur) => {
      acc.amount += cur.amount
      acc.provents += cur.provents
      acc.appreciation += cur.appreciation
      acc.netProfit += cur.netProfit
      acc.percentProvents += cur.percentProvents
      acc.percentAppreciation += cur.percentAppreciation
      acc.percentNetProfit += cur.netProfitPercentAverage
      return acc
    },
    {
      amount: 0,
      provents: 0,
      appreciation: 0,
      netProfit: 0,
      percentProvents: 0,
      percentAppreciation: 0,
      percentNetProfit: 0,
    },
  )

  resume.percentProvents /= result.filter((x) => x.percentProvents).length
  resume.percentAppreciation /= result.length
  resume.percentNetProfit /= result.length

  console.log(JSON.stringify([...result, resume], null, 2))
}

async function generateWallet() {
  // RICO
  const result = assembleWallet(
    [
      { ticker: "HGRU11", weight: 10.0, price: 0, tradingDate: "07/06/2022" },
      { ticker: "HSML11", weight: 5.0, price: 0, tradingDate: "07/06/2022" },
      { ticker: "VILG11", weight: 10.0, price: 0, tradingDate: "07/06/2022" },
      { ticker: "BRCO11", weight: 10.0, price: 0, tradingDate: "07/06/2022" },
      { ticker: "LVBI11", weight: 10.0, price: 0, tradingDate: "07/06/2022" },
      { ticker: "PVBI11", weight: 5.0, price: 0, tradingDate: "07/06/2022" },
      { ticker: "RBRP11", weight: 5.0, price: 0, tradingDate: "07/06/2022" },
      { ticker: "KNIP11", weight: 11.25, price: 0, tradingDate: "07/06/2022" },
      { ticker: "HGCR11", weight: 11.25, price: 0, tradingDate: "07/06/2022" },
      { ticker: "KNHY11", weight: 11.25, price: 0, tradingDate: "07/06/2022" },
      { ticker: "KNCR11", weight: 11.25, price: 0, tradingDate: "07/06/2022" },
    ],
    3000,
  )

  console.log(JSON.stringify(result, null, 2))
}

walletProcess()
// generateWallet()
