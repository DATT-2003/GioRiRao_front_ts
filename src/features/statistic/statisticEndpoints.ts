const StatisticBase: string = "/statistics"
const AIBase: string = "/ai"

const StatisticEndpoint = {
  getRevenueDayInRange: () => `${StatisticBase}/revenue/days-in-range`,

  getRevenueMonthOfYear: () => `${StatisticBase}/revenue/months`,

  getTopTenDrinksByDay: (storeId: string, day: number, year: number) =>
    `${StatisticBase}/topDrinks/day/${storeId}/${day}/${year}`,

  getTopTenDrinksByMonth: (storeId: string, month: number, year: number) =>
    `${StatisticBase}/topDrinks/month/${storeId}/${month}/${year}`,

  getRevenueNextMonth: (storeId: string) => `${AIBase}/month/${storeId}`,

  trainModel: (storeId: string) => `${AIBase}/train/${storeId}`,

  predictRevenue: (storeId: string) => `${AIBase}/predict/${storeId}`
}

export default StatisticEndpoint
