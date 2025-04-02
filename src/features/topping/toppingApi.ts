import api from "../../app/api"
import { ITopping } from "./toppingTypes"
import ToppingEndpoint from "./toppingEndpoints"

const toppingApi = {
  async getAllToppings(): Promise<ITopping[]> {
    const response = await api.get(ToppingEndpoint.getAllToppings())
    // console.log("get all toppings drinkApi", response)
    return response.data.toppings
  },
}

export default toppingApi
