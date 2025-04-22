const StatisticBase: string = "/statistics"

const StatisticEndpoint = {
  getRevenueDayInRange: () => `${StatisticBase}/revenue/days-in-range`,

  getRevenueMonthOfYear: () => `${StatisticBase}/revenue/months`,

  getTopTenDrinksByDay: (
    storeId: string,
    day: number,
    year: number,
  ) => `${StatisticBase}/topDrinks/day/${storeId}/${day}/${year}`,

  getTopTenDrinksByMonth: (storeId: string, month: number, year: number) =>
    `${StatisticBase}/topDrinks/month/${storeId}/${month}/${year}`,
}

export default StatisticEndpoint
