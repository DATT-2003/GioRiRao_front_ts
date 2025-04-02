import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import { ITopping } from "../topping/toppingTypes"
import { ICarItem } from "./cartType"

export interface CartSliceState {
  cartItems: ICarItem[]
  isCartComfirmationOpen: boolean
  isPaymentSuccessOpen: boolean
}

const loadCartState = () => {
  const state = sessionStorage.getItem("cartState")
  return state ? JSON.parse(state) : null
}

const saveCartState = (state: ICarItem[] | null) => {
  const stringtifyState = JSON.stringify(state)
  sessionStorage.setItem("cartState", stringtifyState)
}

const initialState: CartSliceState = {
  cartItems: loadCartState(),
  isCartComfirmationOpen: false,
  isPaymentSuccessOpen: false,
}

export const cartSlice = createAppSlice({
  name: "cart",
  initialState,
  reducers: create => ({
    createCart: create.reducer((state, action: PayloadAction<ICarItem>) => {
      if (!state.cartItems) {
        state.cartItems = [action.payload]
        saveCartState(state.cartItems)
        return
      }
      state.cartItems.push(action.payload)

      saveCartState(state.cartItems)
    }),
    updateQuantity: create.reducer(
      (
        state,
        action: PayloadAction<{
          drinkId: string
          quantity: number
          priceIndex: number
        }>,
      ) => {
        const { drinkId, quantity, priceIndex } = action.payload

        const existingItemIndex = state.cartItems?.findIndex(
          item => item.drink?._id === drinkId,
        )

        state.cartItems[existingItemIndex].quantity = quantity

        state.cartItems[existingItemIndex].price =
          state.cartItems[existingItemIndex].drink!.customization[priceIndex!]
            .price * quantity!

        if (state.cartItems[existingItemIndex].toppings) {
          state.cartItems[existingItemIndex].toppings.map(t => {
            state.cartItems[existingItemIndex].price! += t.price
          })
        }
        saveCartState(state.cartItems)
      },
    ),
    updatePriceIndex: create.reducer(
      (
        state,
        action: PayloadAction<{ drinkId: string; priceIndex: number }>,
      ) => {
        const { drinkId, priceIndex } = action.payload

        const existingItemIndex = state.cartItems?.findIndex(
          item => item.drink?._id === drinkId,
        )

        state.cartItems[existingItemIndex].priceIndex = priceIndex
        state.cartItems[existingItemIndex].price =
          state.cartItems[existingItemIndex].drink!.customization[priceIndex!]
            .price * state.cartItems[existingItemIndex].quantity!

        if (state.cartItems[existingItemIndex].toppings) {
          state.cartItems[existingItemIndex].toppings.map(t => {
            state.cartItems[existingItemIndex].price! += t.price
          })
        }

        saveCartState(state.cartItems)
      },
    ),
    addTopping: create.reducer(
      (state, action: PayloadAction<{ id: string; topping: ITopping }>) => {
        const { id, topping } = action.payload

        const existingItemIndex = state.cartItems?.findIndex(
          item => item.id === id,
        )
        if (existingItemIndex === -1 || existingItemIndex === undefined) return
        // is topping already exist
        const existTopping = state.cartItems[existingItemIndex].toppings?.some(
          t => t._id === topping!._id,
        )
        if (existTopping) return

        state.cartItems[existingItemIndex].toppings?.push(topping!)

        state.cartItems[existingItemIndex].price! += topping.price

        saveCartState(state.cartItems)
      },
    ),
    removeTopping: create.reducer(
      (state, action: PayloadAction<{ id: string; topping: ITopping }>) => {
        const { id, topping } = action.payload

        const existingItemIndex = state.cartItems?.findIndex(
          item => item.id === id,
        )

        state.cartItems[existingItemIndex].price! -= topping.price
        // filter the topping out by its id
        state.cartItems[existingItemIndex].toppings = state.cartItems[
          existingItemIndex
        ].toppings.filter(t => t._id !== topping._id)

        saveCartState(state.cartItems)
      },
    ),
    updateNote: create.reducer(
      (state, action: PayloadAction<{ id: string; note: string }>) => {
        const { id, note } = action.payload

        const existingItemIndex = state.cartItems?.findIndex(
          item => item.id === id,
        )

        state.cartItems[existingItemIndex].note = note

        saveCartState(state.cartItems)
      },
    ),
    removeCartItem: create.reducer(
      (state, action: PayloadAction<{ id: string }>) => {
        const { id } = action.payload
        state.cartItems = state.cartItems.filter(t => t.id !== id)

        saveCartState(state.cartItems)
      },
    ),
    addConfirmpayment: create.reducer(state => {}),
    setIsCartComfirmationOpen: create.reducer(
      (state, action: PayloadAction<{ isOpen: boolean }>) => {
        const { isOpen } = action.payload

        state.isCartComfirmationOpen = isOpen

        // console.log(
        //   "payload setIsCartComfirmationOpen",
        //   state.isCartComfirmationOpen,
        // )
      },
    ),
    setIsPaymentSuccessOpen: create.reducer(
      (state, action: PayloadAction<{ isOpen: boolean }>) => {
        const { isOpen } = action.payload

        state.isPaymentSuccessOpen = isOpen

        // console.log(
        //   "payload isPaymentSuccessOpen",
        //   state.isPaymentSuccessOpen,
        // )
      },
    ),
    removeCartList: create.reducer(state => {
      state.cartItems = []
      saveCartState(state.cartItems)
    }),
  }),
  selectors: {
    selectCartItems: cart => {
      console.log("Select cart items", cart.cartItems)
      return cart.cartItems
    },

    selectCartItem: (cart, drinkId) =>
      cart.cartItems?.find(item => item.drink?._id === drinkId) || null,

    selectCartItemPriceIndex: (cart, drinkId) => {
      const item =
        cart.cartItems?.find(item => item.drink?._id === drinkId) || null
      return item?.priceIndex
    },

    selectToppings: (cart, id) => {
      // console.log("cart.cartItems", cart.cartItems)
      const existingItemIndex = cart.cartItems?.findIndex(
        item => item.id === id,
      )

      // console.log("existingItemIndex selectToppings", existingItemIndex)

      if (existingItemIndex === undefined || existingItemIndex === -1) {
        return []
      }

      // console.log(
      //   "cart.cartItems[existingItemIndex].toppings",
      //   cart.cartItems[existingItemIndex].toppings,
      // )

      return cart.cartItems[existingItemIndex].toppings
    },

    selectCartTotalPrice: cart => {
      if (!Array.isArray(cart.cartItems)) {
        console.log("cart.cartItems", cart.cartItems)
        return []
      }

      return cart.cartItems
        ? cart.cartItems.reduce((totalP, cartItem) => {
            return totalP + (cartItem.price ?? 0) // Ensure price is not undefined
          }, 0)
        : 0
    },

    selectIsCartComfirmationOpen: cart => cart.isCartComfirmationOpen,
    selectIsPaymentSuccessOpen: cart => cart.isPaymentSuccessOpen,
  },
})

export const {
  createCart,
  updateQuantity,
  updatePriceIndex,
  addTopping,
  removeTopping,
  updateNote,
  removeCartItem,
  setIsCartComfirmationOpen,
  setIsPaymentSuccessOpen,
  removeCartList,
} = cartSlice.actions

export const {
  selectCartItems,
  selectCartItem,
  selectCartItemPriceIndex,
  selectToppings,
  selectCartTotalPrice,
  selectIsCartComfirmationOpen,
  selectIsPaymentSuccessOpen,
} = cartSlice.selectors
