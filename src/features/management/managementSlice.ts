import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface ManagementSliceState {
  popUpTab: string
}
const loadPopUpTab = () => {
  const state = sessionStorage.getItem("managementState")
  return state ? JSON.parse(state) : "storeManagement"
}
const savePopUpTab = (state: string | "storeManagement") => {
  const stringtifyState = JSON.stringify(state)
  sessionStorage.setItem("managementState", stringtifyState)
}
const initialState: ManagementSliceState = {
  popUpTab: loadPopUpTab(),
}
export const managementSlice = createAppSlice({
  name: "management",
  initialState,
  reducers: create => ({
    setPopUpTab: create.reducer((state, action: PayloadAction<string>) => {
      state.popUpTab = action.payload
      savePopUpTab(state.popUpTab)
    }),
  }),
  selectors: {
    selectPopUpTab: management => management.popUpTab,
  },
})
export const { setPopUpTab } = managementSlice.actions
export const { selectPopUpTab } = managementSlice.selectors
