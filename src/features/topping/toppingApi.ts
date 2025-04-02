import api from "../../app/api"
import { ITopping } from "./toppingTypes"
import ToppingEndpoint from "./toppingEndpoints"

const toppingApi = {
  async getAllToppings(): Promise<ITopping[]> {
    const response = await api.get(ToppingEndpoint.getAllToppings())
    return response.data.toppings
  },

  async createTopping(topping: FormData) {
    const response = await api.post(ToppingEndpoint.createTopping(), topping, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },

  async updateTopping(id: string, updatedTopping: Partial<ITopping>) {
    const response = await api.put(
      `${ToppingEndpoint.updateTopping(id)}`,
      updatedTopping,
    )
    return response.data
  },
  async deleteTopping(id: string) {
    const response = await api.put(ToppingEndpoint.updateTopping(id), {
      deleted: true,
    })
    return response.data
  },
}

export default toppingApi
