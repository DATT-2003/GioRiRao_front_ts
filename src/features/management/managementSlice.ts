import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface ManagementSliceState {
  popUpTab: string
  selectedStoreStaffIds: string[]
  selectedManagerId: string | null // ✅ Thêm field mới
}

// Load và lưu popup tab
const loadPopUpTab = (): string => {
  const state = sessionStorage.getItem("managementState")
  return state ? JSON.parse(state) : "storeManagement"
}
const savePopUpTab = (state: string | "storeManagement") => {
  const stringtifyState = JSON.stringify(state)
  sessionStorage.setItem("managementState", stringtifyState)
}

// ✅ Khởi tạo state với field mới
const initialState: ManagementSliceState = {
  popUpTab: loadPopUpTab(),
  selectedStoreStaffIds: [],
  selectedManagerId: null, // ✅
}

export const managementSlice = createAppSlice({
  name: "management",
  initialState,
  reducers: create => ({
    setPopUpTab: create.reducer((state, action: PayloadAction<string>) => {
      state.popUpTab = action.payload
      savePopUpTab(state.popUpTab)
    }),
    setSelectedStoreStaffInfo: create.reducer(
      (
        state,
        action: PayloadAction<{ staffIds: string[]; managerId: string | null }>,
      ) => {
        state.selectedStoreStaffIds = action.payload.staffIds
        state.selectedManagerId = action.payload.managerId
      },
    ),
  }),
  selectors: {
    selectPopUpTab: management => management.popUpTab,
    selectSelectedStoreStaffIds: management => management.selectedStoreStaffIds,
    selectSelectedManagerId: management => management.selectedManagerId, // ✅
  },
})

// ✅ Export actions và selectors mới
export const { setPopUpTab, setSelectedStoreStaffInfo } =
  managementSlice.actions
export const {
  selectPopUpTab,
  selectSelectedStoreStaffIds,
  selectSelectedManagerId,
} = managementSlice.selectors
