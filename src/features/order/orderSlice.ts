// orderSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IOrder } from "./orderTypes"

interface OrderState {
  newOrder: IOrder | null
}

const initialState: OrderState = {
  newOrder: null,
}

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setNewOrder: (state, action: PayloadAction<IOrder>) => {
      state.newOrder = action.payload
    },
    clearNewOrder: state => {
      state.newOrder = null
    },
  },
})

// 👇 Xuất selector để lấy dữ liệu từ state
export const selectNewOrder = (state: any) => state.order.newOrder

// 👇 Xuất các action
export const { setNewOrder, clearNewOrder } = orderSlice.actions

export default orderSlice.reducer
