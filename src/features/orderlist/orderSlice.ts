import { createAppSlice } from "../../app/createAppSlice";
import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import orderlistApi from "../orderlist/components/orderlistApi";
import { IOrder } from "../orderlist/components/orderlistTypes";

interface OrderListState {
  orders: IOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderListState = {
    orders: [],
    loading: false,
    error: null,
  };
  

  export const fetchOrders = createAsyncThunk(
    "orderlist/fetchOrders",
    async (storeId: string) => {
      const res = await orderlistApi.getPendingOrders(storeId);
      return res; // res phải là array chứa toàn bộ đơn "PENDING"
    }
  );
  
  
export const markAsDone = createAsyncThunk("orderlist/markAsDone", async (orderId: string) => {
  await orderlistApi.markOrderAsDone(orderId);
  return orderId;
});

export const orderlistSlice = createAppSlice({
  name: "orderlist",
  initialState,
  reducers: create => ({}),
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, state => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<IOrder[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load orders";
      })
      .addCase(markAsDone.fulfilled, (state, action: PayloadAction<string>) => {
        const id = action.payload;
        const order = state.orders.find(o => o._id === id);
        if (order) {
            order.status = "COMPLETED";
        }
        state.orders.sort((a, b) => {
            if (a.status === "COMPLETED" && b.status !== "COMPLETED") return 1;
            if (a.status !== "COMPLETED" && b.status === "COMPLETED") return -1;
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });
          
      });
  },
});

export default orderlistSlice.reducer;
