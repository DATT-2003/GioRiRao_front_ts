import { I } from "vitest/dist/reporters-yx5ZTtEV.js"
import api from "../../app/api"
import ManagementEndpoint from "./managementEndpoints"
import { IStaff, ICity, IArea, IStore } from "./managementTypes"

const managementApi = {
  async getCities(): Promise<ICity[]> {
    const response = await api.get(ManagementEndpoint.getCitiesList)
    // console.log("get cities list managementApi", response)
    return response.data.cities
  },
  async getAreasByCityId(cityId: string): Promise<IArea[]> {
    const response = await api.get(ManagementEndpoint.getAreasByCityId(cityId))
    // console.log("get areas by city id managementApi", response)
    return response.data.areas
  },
  async getStoresByAreaId(areaId: string): Promise<IStore[]> {
    const response = await api.get(ManagementEndpoint.getStoreByAreaId(areaId))
    // console.log("get stores by area id managementApi", response)
    return response.data.stores
  },
  async getStaffById(staffId: string): Promise<IStaff> {
    const response = await api.get(ManagementEndpoint.getStaffById(staffId))
    // console.log("get staff by id managementApi", response.data.data)
    return response.data.data
  },
  async createStaff(data: FormData): Promise<IStaff> {
    const response = await api.post(ManagementEndpoint.createStaff, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    // console.log("create staff managementApi", response.data.data)
    return response.data.data
  },
  async createStore(data: Partial<IStore>): Promise<IStore> {
    const response = await api.post(ManagementEndpoint.createStore, data)
    return response.data.data
  },
  async updateStore(storeId: string, data: Partial<IStore>): Promise<IStore> {
    const response = await api.put(
      ManagementEndpoint.updateStore(storeId),
      data,
    )
    return response.data.data
  },
  async getStoreById(storeId: string): Promise<IStore> {
    console.log("storeId", storeId)
    const response = await api.get(ManagementEndpoint.getStoreById(storeId))
    console.log("get store by id managementApi", response.data.store)
    return response.data.store
  },
  async getAllStaffs(): Promise<IStaff[]> {
    const response = await api.get(ManagementEndpoint.getlllStaffs)
    // console.log("get all staffs managementApi", response.data.data)
    return response.data.data
  },
  async deleteStaff(staffId: string): Promise<void> {
    await api.delete(ManagementEndpoint.deleteStaff(staffId))
  },
  async updateStaff(staffId: string, data: Partial<IStaff>): Promise<IStaff> {
    const response = await api.put(
      ManagementEndpoint.updateStaff(staffId),
      data,
    )
    return response.data.data
  },
}
export default managementApi
