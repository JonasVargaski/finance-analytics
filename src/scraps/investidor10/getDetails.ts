import axios from "axios"

interface IDatePrice {
  price: number
  created_at: string
}

type IData = {
  date: string
  value: number
}

export interface IFiiDetailDTO {
  ticker: string
  quotations: IData[]
  dividends: IData[]
  dividendYelds: IData[]
}

const urls = {
  quotations: `https://investidor10.com.br/api/fii/cotacoes/chart/{id}/1825/real`,
  dividends: `https://investidor10.com.br/api/fii/dividendos/chart/{id}/1825/mes`,
  dividendYield: `https://investidor10.com.br/api/fii/dividend-yield/chart/{id}/1825/mes`,
}

export async function getDetails(tickers: string[]): Promise<IFiiDetailDTO[]> {
  const promises = await Promise.all(
    tickers.map(async (ticker) => {
      const { data } = await axios.get(`https://investidor10.com.br/fiis/${ticker}/`)
      const id = /\/chart\/(\d+)\//.exec(data)[1]
      const result = await Promise.all([
        axios.get<{ real: IDatePrice[] }>(urls.quotations.replace("{id}", id)),
        axios.get<IDatePrice[]>(urls.dividends.replace("{id}", id)),
        axios.get<IDatePrice[]>(urls.dividendYield.replace("{id}", id)),
      ])
      return result
    }),
  )

  return promises.map((promise, i) => {
    const quotations = promise[0]?.data?.real?.map((data) => ({ date: data.created_at, value: data.price })) ?? []
    const dividends = promise[1]?.data?.map((data) => ({ date: data.created_at, value: data.price })) ?? []
    const dividendYelds = promise[2]?.data?.map((data) => ({ date: data.created_at, value: data.price })) ?? []
    return { ticker: tickers[i], quotations, dividends, dividendYelds }
  })
}
