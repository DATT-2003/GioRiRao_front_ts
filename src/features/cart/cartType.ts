import { IDrink } from "../drinks/drinkTypes"
import { ITopping } from "../topping/toppingTypes"

// type
export interface ICarItem {
  drink?: IDrink | null
  quantity?: number
  note?: string
  price?: number
  toppings: ITopping[]
  priceIndex?: number
}
