import { createStore } from "@reduxjs/toolkit"

const ManagementBase: string = "/management"
const AreaBase: string = "/areas"
const CityBase: string = "/cities"
const StoreBase: string = "/stores"
const StaffBase: string = "/staffs"

const ManagementEndpoint = {
  getCitiesList: `${CityBase}`,
  getAreasByCityId: (cityId: string) => `${AreaBase}/by-city/${cityId}`,
  getStoreByAreaId: (areaId: string) => `${StoreBase}/area/${areaId}`,
  createStore: `${StoreBase}`,
  updateStore: (storeId: string) => `${StoreBase}/${storeId}`,
  getStoreById: (storeId: string) => `${StoreBase}/${storeId}`,
  getStaffById: (staffId: string) => `${StaffBase}/${staffId}`,
  createStaff: `${StaffBase}`,
  getlllStaffs: `${StaffBase}`,
  deleteStaff: (staffId: string) => `${StaffBase}/delete/${staffId}`,
  updateStaff: (staffId: string) => `${StaffBase}/${staffId}`,
}
export default ManagementEndpoint
