export interface IManager {
  _id?: string
  name: string
  email: string
  position: string
  address: string
}
export interface ICity {
  _id?: string // MongoDB tự sinh nếu cần
  name: string
  totalAreas: number
  totalStores: number
  deleted: boolean
  createdAt?: string
  updatedAt?: string
}
export interface IArea {
  _id?: string // MongoDB tự sinh nếu cần
  name: string
  cityId: string
  totalStores: number
  deleted: boolean
  createdAt?: string
  updatedAt?: string
}
export interface IStore {
  _id?: string
  name: string
  address: string
  managerId?: string
  phone?: string
  email?: string
  areaId: string
  cityId: string
  staffs: string[]
  createdAt?: string
  updatedAt?: string
}
export interface IStoreFilter {
  cityId?: string
  areaId?: string
  isActive?: boolean
  deleted?: boolean
}
export interface IStaff {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  avatar?: string
  role:
    | "admin"
    | "storeManager"
    | "staffCashier"
    | "staffBarista"
    | "staffWaiter"
  createdAt?: string
  updatedAt?: string
}
