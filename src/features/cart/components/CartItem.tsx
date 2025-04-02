import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  setDrinkId,
  setDrinkIdCart,
  setIsDrinkDetailOpen,
} from "../../drinks/drinkSlice"
import { IDrink } from "../../drinks/drinkTypes"
import { ITopping } from "../../topping/toppingTypes"
import { Trash } from "lucide-react"
import { removeCartItem, selectIsCartComfirmationOpen } from "../cartSlice"

interface CartItemProps {
  id?: string
  drink?: IDrink | null
  quantity?: number
  note?: string
  price?: number
  toppings?: ITopping[]
}

const CartItem = ({
  id,
  drink,
  toppings,
  price,
  quantity,
  note,
}: CartItemProps) => {
  const isCartComfirmationOpen = useAppSelector(selectIsCartComfirmationOpen)
  const dispatch = useAppDispatch()

  const handleDrinkClick = (id: string) => {
    if (isCartComfirmationOpen) return
    dispatch(setDrinkIdCart(id))
    dispatch(setIsDrinkDetailOpen(true))
  }

  const handleRemoveCartItem = (id: string) => {
    dispatch(removeCartItem({ id }))
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center justify-between w-full pr-2 bg-gray-900 rounded-lg">
          <div
            className="flex items-center justify-between w-full pr-4 bg-gray-900 rounded-lg"
            onClick={() => handleDrinkClick(id!)}
          >
            <img
              src={drink?.thumbnail}
              alt={drink?.shortDescription}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h4 className="text-white">{drink?.name}</h4>
              <p className="text-gray-400">${price}</p>
            </div>
            <div className="flex ml-auto mr-2">
              <p className="text-white w-10 h-10 text-center pt-2 rounded-lg bg-gray-700">
                {quantity}
              </p>
            </div>
          </div>
          <Trash
            className="text-red-300 hover:text-red-400 cursor-pointer "
            onClick={() => handleRemoveCartItem(id!)}
          />
        </div>
      </div>
      <div onClick={() => handleDrinkClick(id!)}>
        {note ? (
          <input
            type="text"
            disabled
            value={note}
            className="bg-gray-700 w-[100%] h-10 py-2 px-2 rounded-lg overflow-hidden"
          />
        ) : (
          ""
        )}
        {toppings
          ? toppings?.map((t, index) => (
              <div key={index} className=" mt-3 ">
                <p className="bg-gray-700 w-[85%] h-10 py-2 px-2 rounded-lg overflow-hidden">
                  {t.name} <span>(+{t.price} VND)</span>
                </p>
              </div>
            ))
          : []}
      </div>
    </div>
  )
}

export default CartItem
