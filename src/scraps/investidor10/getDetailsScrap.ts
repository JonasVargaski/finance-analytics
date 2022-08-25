/* eslint-disable no-underscore-dangle */
import puppeteer from "puppeteer"

interface IWindow {
  echarts: {
    getInstanceByDom(el: HTMLElement): {
      _model: {
        option: {
          xAxis: {
            data: string[]
          }[]
          series: {
            data: number[]
          }[]
        }
      }
    }
  }
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

export async function getDetailsScrap(tickers: string[]): Promise<IFiiDetailDTO[]> {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.setRequestInterception(true)

  const blockUrls = [
    "securepubads",
    "google",
    "widget",
    "sendinblue",
    "sendinblue",
    "sibautomation",
    "font-awesome",
    "images",
    "cdn-cgi",
    "cloudflareinsights",
    "autocomplete",
    "typeahead",
    "bootstrap",
    "comparador-mesmo-segmento",
    "wow",
    "lozad",
    "global-modules",
    "jquery-maskmoney",
    "jquery_mask",
    "datatables",
    "readmore",
  ]

  page.on("request", (req) => {
    if (["stylesheet", "font", "image"].includes(req.resourceType()) || blockUrls.some((x) => req.url().includes(x)))
      req.abort()
    else {
      console.log(req.method(), " - ", req.url())
      req.continue()
    }
  })

  const result: Array<IFiiDetailDTO> = []

  async function queueGetDetail(tickerIdx: number): Promise<void> {
    const ticker = tickers[tickerIdx]
    if (!ticker) return

    try {
      await page.goto(`https://investidor10.com.br/fiis/${ticker}/`, { waitUntil: "networkidle2" })
      await page.waitForTimeout(600)

      const detail = await page.evaluate(() => {
        const { echarts } = window as unknown as IWindow

        const quotation = echarts.getInstanceByDom(document.querySelector("#chart-quotation"))
        const quotationLabels = quotation._model.option.xAxis[0].data
        const quotationValues = quotation._model.option.series[0].data

        const dividend = echarts.getInstanceByDom(document.querySelector("#chart-dividends"))
        const dividendLabels = dividend._model.option.xAxis[0].data
        const dividendValues = dividend._model.option.series[0].data

        const dividendYeld = echarts.getInstanceByDom(document.querySelector("#chart-dividend-yield"))
        const dividendYeldLabels = dividendYeld._model.option.xAxis[0].data
        const dividendYeldValues = dividendYeld._model.option.series[0].data

        const data: IFiiDetailDTO = {
          ticker: "",
          quotations: quotationLabels.map((date, i) => ({ date, value: quotationValues[i] })),
          dividends: dividendLabels.map((date, i) => ({ date, value: dividendValues[i] })),
          dividendYelds: dividendYeldLabels.map((date, i) => ({ date, value: dividendYeldValues[i] })),
        }

        return data
      })

      detail.ticker = ticker
      result.push(detail)
    } catch (error) {
      console.log(error)
    } finally {
      await queueGetDetail(tickerIdx + 1)
    }
  }

  await queueGetDetail(0)

  browser.close()
  return result
}
