import api from "../../app/api"
import DrinkEndpoint from "./drinkEndpoints"
import { IDrink } from "./drinkTypes"

const drinkApi = {
  async getCategories(): Promise<string[]> {
    const response = await api.get(DrinkEndpoint.getCategoriesList)
    // console.log("get categories list drinkApi", response)
    return response.data.categories
  },
  async getDrinksByCategory(category: string): Promise<IDrink[]> {
    const response = await api.get(DrinkEndpoint.getDrinksByCategory(category))
    // console.log("get drinks by category drinkApi", response)
    return response.data.drinks.docs
  },
  async searchDrinks(searchValue: string): Promise<IDrink[]> {
    const response = await api.get(DrinkEndpoint.searchDrinks(searchValue))
    // console.log("search drinks by drink name drinkApi", response)
    return response.data.drinks
  },
  async getDrinkDetail(drinkId: string): Promise<IDrink> {
    const response = await api.get(DrinkEndpoint.getDrinkById(drinkId))
    //console.log("search drink by drink id drinkApi", response)
    return response.data.drink
  },
}

export default drinkApi
