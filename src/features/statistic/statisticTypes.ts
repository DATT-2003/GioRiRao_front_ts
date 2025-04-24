export interface IStoreRevenue {
  storeId: string
  day?: number
  month?: number
  year?: number
  revenue: number
  createdAt?: Date
  updatedAt?: Date
}

export interface DrinkStatistic {
  drinkId: string
  drinkName: string
  totalQuantity: number
}

export interface PredictedRevenue {
  day: number;
  month: number;
  predicted_revenue: number;
}
