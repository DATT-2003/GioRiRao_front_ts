import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface DrinkSliceState {
  clickedCategory: string
  searchKey: string
  isDrinkDetailOpen: boolean
  drinkId: string
  id: string
}

const initialState: DrinkSliceState = {
  clickedCategory: "coffee",
  searchKey: "",
  isDrinkDetailOpen: false,
  drinkId: "",
  id: "",
}

export const drinkSlice = createAppSlice({
  name: "drink",
  initialState,
  reducers: create => ({
    setClickedCategory: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.clickedCategory = action.payload
      },
    ),
    setSearchKey: create.reducer((state, action: PayloadAction<string>) => {
      state.searchKey = action.payload
    }),
    setIsDrinkDetailOpen: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.isDrinkDetailOpen = action.payload
      },
    ),
    setDrinkId: create.reducer((state, action: PayloadAction<string>) => {
      state.drinkId = action.payload
    }),
    setDrinkIdCart: create.reducer((state, action: PayloadAction<string>) => {
      console.log("action.payload", action.payload)
      state.id = action.payload
    }),
  }),
  selectors: {
    selectClickedCategory: drink => drink.clickedCategory,
    selectSearchKey: drink => drink.searchKey,
    selectIsDrinkDetailOpen: drink => drink.isDrinkDetailOpen,
    selectDrinkId: drink => drink.drinkId,
    selectDrinkIdCart: drink => drink.id,
  },
})

export const {
  setClickedCategory,
  setSearchKey,
  setIsDrinkDetailOpen,
  setDrinkId,
  setDrinkIdCart,
} = drinkSlice.actions

export const {
  selectClickedCategory,
  selectSearchKey,
  selectIsDrinkDetailOpen,
  selectDrinkId,
  selectDrinkIdCart,
} = drinkSlice.selectors
