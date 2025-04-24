import React, { useEffect, useState } from "react"

import { IDrink } from "../drinkTypes"
import drinkApi from "../drinkApi"
import DrinkItem from "./DrinkItem"
import {
  selectClickedCategory,
  selectSearchKey,
  setDrinkId,
} from "../drinkSlice"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { createCart } from "../../cart/cartSlice"

const DrinksList = () => {
  const clickedCategory = useAppSelector(selectClickedCategory)
  const searchKey = useAppSelector(selectSearchKey)
  const dispatch = useAppDispatch()
  const [drinks, setDrinks] = useState<IDrink[]>([])

  useEffect(() => {
    async function loadDrinksByCategory() {
      const drinks = await drinkApi.getDrinksByCategory(`${clickedCategory}`)
      setDrinks(drinks)
    }
    loadDrinksByCategory()
  }, [clickedCategory])

  useEffect(() => {
    if (!searchKey) return // Skip API call if searchKey is empty

    async function loadDrinksBySearchKey() {
      const drinks = await drinkApi.searchDrinks(`${searchKey}`)
      setDrinks(drinks)
    }
    loadDrinksBySearchKey()
  }, [searchKey])

  const handleDrinkClick = async (drinkId: string) => {
    dispatch(setDrinkId(drinkId))
    //dispatch(setIsDrinkDetailOpen(true))

    const drinkDetail = await drinkApi.getDrinkDetail(drinkId)
    const now = new Date()
    const formattedTime = `${now.getHours()}${now.getMinutes()}${now.getSeconds()}`
    const uniqueId = `${drinkId}-${formattedTime}`
    dispatch(
      createCart({
        id: uniqueId,
        drink: drinkDetail,
        quantity: 1,
        note: "",
        price: drinkDetail.customization[0].price,
        toppings: [],
        priceIndex: 0,
      }),
    )
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-auto-fit gap-6">
      {drinks.map(drink => (
        <DrinkItem
          key={drink._id}
          name={drink.name}
          thumbnail={drink.thumbnail}
          price={drink.customization[0].price}
          onClick={() => handleDrinkClick(drink._id)}
        />
      ))}
    </div>
  )
}

export default DrinksList

/**
 * Problem
 * When we dispatch updateCart we send quantity = 1, note ="", price= drinkDetail.customization[0].price
 * which mean, when we go to DrinkDetail and update data, and go outside, click to the DrinkItem again
 * the data will be reset
 */
