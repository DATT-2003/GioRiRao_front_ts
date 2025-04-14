export interface IToppingOrderDetail {
  toppingId: string
  name: string
  price: number
}

export interface IOrderDetail {
  drink: {
    drinkId: string
    drinkName: string
    drinkPrice: number
    size: "S" | "M" | "L"
  }
  quantity: number
  note?: string
  toppings: IToppingOrderDetail[]
  total: number
}

export interface IOrder {
  createdBy?: string
  storeId: string
  items: IOrderDetail[]
  onlineStatus?: "PENDING" | "COMPLETED" | "CANCELLED"
  paymentMethod: "Cash" | "MOBILE_PAYMENT"
  total: number
  createdAt?: Date
  updatedAt?: Date
}
