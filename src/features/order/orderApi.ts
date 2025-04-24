import api from "../../app/api"
import OrderEndpoint from "./orderEndpoints"
import { IOrder } from "./orderTypes"

const orderApi = {
  async createOrder(order: IOrder): Promise<IOrder> {
    const response = await api.post(OrderEndpoint.createOrder(), order)
    return response.data.newOrder // đúng là kiểu IOrder
  },
}

export default orderApi
