export interface Ingredient {
  name: string
  quantity: number
}

export interface Inventory {
  _id?: string // nếu bạn dùng MongoDB ObjectId
  storeId: string
  ingredients: Ingredient[]
  createdAt?: string
  updatedAt?: string
}
