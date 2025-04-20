import api from "../../app/api"
import { IStoreRevenue, DrinkStatistic } from "./statisticTypes"
import StatisticEndpoint from "./statisticEndpoints"

const statisticApi = {
  async getRevenueDayInRange(
    storeId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<IStoreRevenue[]> {
    console.log("storeId statisticApi", storeId)
    console.log("fromDate statisticApi", fromDate)
    console.log("toDate statisticApi", toDate)

    const response = await api.post(StatisticEndpoint.getRevenueDayInRange(), {
      storeId,
      fromDate,
      toDate,
    })

    console.log("response.data.revenues", response.data.revenues)
    console.log("response.data", response.data)
    return response.data.revenues
  },

  async getRevenueMonthOfYear(
    storeId: string,
    year: number,
  ): Promise<IStoreRevenue[]> {
    const response = await api.post(StatisticEndpoint.getRevenueMonthOfYear(), {
      storeId,
      year,
    })
    return response.data.revenues
  },

  async getTopTenDrinksByDay(
    storeId: string,
    day: number,
    year: number,
  ): Promise<DrinkStatistic[]> {
    const response = await api.get(
      StatisticEndpoint.getTopTenDrinksByDay(storeId, day, year),
    )
    return response.data.drinks
  },

  async getTopTenDrinksByMonth(
    storeId: string,
    month: number,
    year: number,
  ): Promise<DrinkStatistic[]> {
    const response = await api.get(
      StatisticEndpoint.getTopTenDrinksByMonth(storeId, month, year),
    )
    return response.data.drinks
  },
}

export default statisticApi
