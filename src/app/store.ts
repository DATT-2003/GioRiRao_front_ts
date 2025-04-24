import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"

import { drinkSlice } from "../features/drinks/drinkSlice"
import { authSlice } from "../features/authentication/authSlice"
import { cartSlice } from "../features/cart/cartSlice"
import { settingSlice } from "../features/settings/settingSlice"
import { orderlistSlice } from "../features/orderlist/orderSlice"

import { managementSlice } from "../features/management/managementSlice"
import { orderSlice } from "../features/order/orderSlice"
import { profileSlice } from "../features/profile/profileSlice" // ✅ Thêm dòng này

const rootReducer = combineSlices(
  drinkSlice,
  authSlice,
  cartSlice,
  settingSlice,
  orderlistSlice,
  managementSlice,
  orderSlice,
  profileSlice 
)

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>

// The store setup is wrapped in `makeStore` to allow reuse
export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  })

  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
