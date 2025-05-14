import api from "../../app/api"
import {
  IStoreRevenue,
  DrinkStatistic,
  PredictedRevenue,
} from "./statisticTypes"
import StatisticEndpoint from "./statisticEndpoints"

const statisticApi = {
  async getRevenueDayInRange(
    storeId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<IStoreRevenue[]> {
    const response = await api.post(StatisticEndpoint.getRevenueDayInRange(), {
      storeId,
      fromDate,
      toDate,
    })

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

    console.log("response getTopTenDrinksByDay", response)
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

  async getRevenueNextMonth(storeId: string): Promise<PredictedRevenue[]> {
    const response = await api.get(
      StatisticEndpoint.getRevenueNextMonth(storeId),
    )

    return response.data.predictedRevenue.predictedRevenues
  },

  async trainModel(storeId: string): Promise<string> {
    console.log("storeId", storeId)
    await api.post(StatisticEndpoint.trainModel(storeId))

    return "Model trained successfully"
  },

  async predictRevenue(storeId: string): Promise<string> {
    console.log("storeId", storeId)

    await api.post(StatisticEndpoint.predictRevenue(storeId))

    return "Predicted revenue successfully"
  },
}

export default statisticApi
