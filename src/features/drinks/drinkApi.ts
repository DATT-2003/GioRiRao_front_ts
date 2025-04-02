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
  async createDrink(drink: FormData) {
    console.log("create drink drinkApi", drink)
    const response = await api.post(DrinkEndpoint.createDrink(), drink, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },
  async getAllDrinks(): Promise<IDrink[]> {
    const response = await api.get(DrinkEndpoint.getAllDrinks())
    return response.data.docs
  },
  async updateDrink(drinkId: string, drink: FormData) {
    const response = await api.patch(DrinkEndpoint.updateDrink(drinkId), drink)
    return response.data
  },
  async deleteDrink(drinkId: string) {
    const response = await api.patch(DrinkEndpoint.deleteDrink(drinkId))
    return response.data
  },
}

export default drinkApi
