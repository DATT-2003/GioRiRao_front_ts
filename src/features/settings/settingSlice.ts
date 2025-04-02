import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface SettingSliceState {
  popUpTab: string
}

const loadPopUpTab = () => {
  const state = sessionStorage.getItem("settingState")
  return state ? JSON.parse(state) : "drinkManagement"
}

const savePopUpTab = (state: string | "drinkManagement") => {
  const stringtifyState = JSON.stringify(state)
  sessionStorage.setItem("settingState", stringtifyState)
}

const initialState: SettingSliceState = {
  popUpTab: loadPopUpTab(),
}

export const settingSlice = createAppSlice({
  name: "setting",
  initialState,
  reducers: create => ({
    setPopUpTab: create.reducer((state, action: PayloadAction<string>) => {
      state.popUpTab = action.payload
      savePopUpTab(state.popUpTab)
    }),
  }),
  selectors: {
    selectPopUpTab: setting => setting.popUpTab,
  },
})

export const { setPopUpTab } = settingSlice.actions

export const { selectPopUpTab } = settingSlice.selectors
