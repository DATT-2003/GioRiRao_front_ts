import api from "../../app/api"
import InventoryEndpoint from "./inventoryEndpoints"
import { Ingredient, Inventory } from "./inventoryTypes"

const inventoryApi = {
  // Lấy danh sách hàng tồn kho của store
  async getInventoryByStore(storeId: string): Promise<Ingredient[]> {
    const response = await api.get(
      InventoryEndpoint.getInventoryByStore(storeId),
    )
    return response.data.inventory.ingredients
  },

  // Upload file Excel để nhập hàng vào kho
  async importGoods(storeId: string, file: File): Promise<Inventory> {
    const formData = new FormData()
    formData.append("file", file)

    const response = await api.post(
      InventoryEndpoint.importGoods(storeId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    )

    return response.data.inventory
  },
}

export default inventoryApi
