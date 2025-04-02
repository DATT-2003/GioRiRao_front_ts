import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { setDrinkId, setIsDrinkDetailOpen } from "../../drinks/drinkSlice"
import { IDrink } from "../../drinks/drinkTypes"
import { ITopping } from "../../topping/toppingTypes"
import { Trash } from "lucide-react"
import { removeCartItem, selectIsCartComfirmationOpen } from "../cartSlice"

interface CartItemProps {
  drink?: IDrink | null
  quantity?: number
  note?: string
  price?: number
  toppings?: ITopping[]
}

const CartItem = ({
  drink,
  toppings,
  price,
  quantity,
  note,
}: CartItemProps) => {
  const isCartComfirmationOpen = useAppSelector(selectIsCartComfirmationOpen)
  const dispatch = useAppDispatch()

  const handleDrinkClick = (drinkId: string) => {
    if (isCartComfirmationOpen) return
    dispatch(setDrinkId(drinkId))
    dispatch(setIsDrinkDetailOpen(true))
  }

  const handleRemoveCartItem = (drinkId: string) => {
    dispatch(removeCartItem({ drinkId }))
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={drink?.thumbnail}
          alt={drink?.shortDescription}
          className="w-12 h-12 rounded-lg object-cover"
          onClick={() => handleDrinkClick(drink?._id!)}
        />
        <div className="flex-1" onClick={() => handleDrinkClick(drink?._id!)}>
          <h4 className="text-white">{drink?.name}</h4>
          <p className="text-gray-400">${price}</p>
        </div>

        <div
          className="flex items-center gap-2"
          onClick={() => handleDrinkClick(drink?._id!)}
        >
          <p className="text-white w-10 h-10 text-center pt-2 rounded-lg bg-gray-700">
            {quantity}
          </p>
          <p className="text-white w-10 h-10 text-center pt-2">{quantity}</p>
        </div>
        <Trash
          className="text-red-300 hover:text-red-400"
          onClick={() => handleRemoveCartItem(drink?._id!)}
        ></Trash>
      </div>
      <div onClick={() => handleDrinkClick(drink?._id!)}>
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
              <div key={index} className=" mt-3">
                <p className="bg-gray-700 w-[75%] h-10 py-2 px-2 rounded-lg overflow-hidden">
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
