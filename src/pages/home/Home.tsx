import React, { useEffect } from "react"
import CategoriesList from "../../features/drinks/components/CategoriesList"
import DrinksList from "../../features/drinks/components/DrinksList"
import SearchBar from "./components/SearchBar"
import formattedDate from "../../utils/getCurrentDate"
import { useAppSelector } from "../../app/hooks"
import { selectIsDrinkDetailOpen } from "../../features/drinks/drinkSlice"
import DrinkDetail from "../../features/drinks/components/DrinkDetail"
import CartList from "../../features/cart/components/CartList"
import {
  selectIsCartComfirmationOpen,
  selectIsPaymentSuccessOpen,
} from "../../features/cart/cartSlice"
import CartComfirmation from "../../features/cart/components/CartComfirmation"
import PaymentSuccess from "../../features/cart/components/PaymentSuccess"

const Home = () => {
  const isDrinkDetailOpen = useAppSelector(selectIsDrinkDetailOpen)
  const isCartComfirmationOpen = useAppSelector(selectIsCartComfirmationOpen)
  const isPaymentSuccessOpen = useAppSelector(selectIsPaymentSuccessOpen)

  return (
    <div className="p-6 ">
      <div className="max-w-7xl mx-auto grid grid-cols-[1fr,400px] gap-8">
        <div>
          <header className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Gio Ri Rao</h1>
            <p className="text-gray-400">{formattedDate}</p>

            <div className="mt-4 mb-6">
              <SearchBar />
            </div>

            <CategoriesList />
          </header>

          <div className="">
            <DrinksList />
          </div>
        </div>

        {isDrinkDetailOpen && <DrinkDetail />}
        {isCartComfirmationOpen && <CartComfirmation />}
        {isPaymentSuccessOpen && <PaymentSuccess />}

        <CartList />
      </div>
    </div>
  )
}

export default Home
