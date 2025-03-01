import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface ToppingSliceState {
  clickedCategory: string
  searchKey: string
  isDrinkDetailOpen: boolean
  drinkId: string
  id: string
}

const initialState: ToppingSliceState = {
  clickedCategory: "coffee",
  searchKey: "",
  isDrinkDetailOpen: false,
  drinkId: "",
  id: "",
}

export const toppingSlice = createAppSlice({
  name: "topping",
  initialState,
  reducers: create => ({
    setClickedCategory: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.clickedCategory = action.payload
      },
    ),
    updateTopping: create.reducer((state, action: PayloadAction<string>) => {
      state.clickedCategory = action.payload
    }),
  }),

  selectors: {
    selectClickedCategory: drink => drink.clickedCategory,
  },
})

export const { setClickedCategory } = toppingSlice.actions

export const { selectClickedCategory } = toppingSlice.selectors
