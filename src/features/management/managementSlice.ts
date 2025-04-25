import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface ManagementSliceState {
  popUpTab: string
  selectedStoreStaffIds: string[]
  selectedManagerId: string | null
  selectedCity: string
  selectedArea: string
  selectedStore: string
}

// Khôi phục dữ liệu filter từ localStorage
const loadFilterFromLocalStorage = () => {
  const filterData = localStorage.getItem("storeFilter")
  return filterData
    ? JSON.parse(filterData)
    : { selectedCity: "", selectedArea: "", selectedStore: "" }
}

// Lưu dữ liệu filter vào localStorage
const saveFilterToLocalStorage = (filter: {
  selectedCity: string
  selectedArea: string
  selectedStore: string
}) => {
  localStorage.setItem("storeFilter", JSON.stringify(filter))
}

// Khởi tạo state
const initialState: ManagementSliceState = {
  popUpTab: "storeManagement",
  selectedStoreStaffIds: [],
  selectedManagerId: null,
  ...loadFilterFromLocalStorage(), // Load filter từ localStorage khi khởi tạo state
}

export const managementSlice = createAppSlice({
  name: "management",
  initialState,
  reducers: create => ({
    setPopUpTab: create.reducer((state, action: PayloadAction<string>) => {
      state.popUpTab = action.payload
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
    setStoreFilter: create.reducer(
      (
        state,
        action: PayloadAction<{
          selectedCity: string
          selectedArea: string
          selectedStore: string
        }>,
      ) => {
        const { selectedCity, selectedArea, selectedStore } = action.payload
        state.selectedCity = selectedCity
        state.selectedArea = selectedArea
        state.selectedStore = selectedStore
        saveFilterToLocalStorage(action.payload) // Lưu filter vào localStorage
      },
    ),
  }),
  selectors: {
    selectPopUpTab: management => management.popUpTab,
    selectSelectedStoreStaffIds: management => management.selectedStoreStaffIds,
    selectSelectedManagerId: management => management.selectedManagerId,
    selectStoreFilter: management => ({
      selectedCity: management.selectedCity,
      selectedArea: management.selectedArea,
      selectedStore: management.selectedStore,
    }),
  },
})

export const { setPopUpTab, setSelectedStoreStaffInfo, setStoreFilter } =
  managementSlice.actions

export const {
  selectPopUpTab,
  selectSelectedStoreStaffIds,
  selectSelectedManagerId,
  selectStoreFilter,
} = managementSlice.selectors
