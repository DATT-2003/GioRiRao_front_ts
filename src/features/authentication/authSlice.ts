import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface AuthSliceState {
  isAuthenticated: boolean
  role: string
  userId: string
  storeId: string
}

const initialState: AuthSliceState = {
  isAuthenticated: false,
  role: "",
  userId: "",
  storeId: "",
}

export const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: create => ({
    setIsAuthenticated: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.isAuthenticated = action.payload
      },
    ),
  }),
  selectors: {
    selectIsAuthenticated: auth => auth.isAuthenticated,
  },
})

export const { setIsAuthenticated } = authSlice.actions

export const { selectIsAuthenticated } = authSlice.selectors

/**
 * Mình sử dụng jwt gồm access token, và refresh token và lưu nó vào cookies khi đăng nhập thành công
 *
 * Các chức năng cần tạo:
 *    tự động log out khi access token hết hạn
 *    bảo vệ các route cần đăng nhập khỏi những người muốn truy cập khi chưa đăng nhập
 *    lưu trữ thông tin của người đăng nhập
 *
 * Triển khai chức năng: tự động log out khi access token hết hạn
 *  ta đánh chặn kết quả trả về của backend trước khi nó vào các hàm phía client
 *  nếu kết quả trả về là 401 unauthorize thì chúng ta hiển thị 1 pop up thông báo phiên đăng nhập đã hết hạn và họ buộc
 *   lòng phải đăng nhập lại
 *
 * Triển khai chức năng: bảo vệ các route cần đăng nhập khỏi những người muốn truy cập khi chưa đăng nhập
 *  sẽ có trường hợp người sử dụng truy cập vào các trang trực tiếp mà không đăng nhập
 *  chúng ta giải quyết vấn đề này bằng cách, bọc các trang bắt buộc phải đăng nhập lại bằng 1 ProtectedRoute
 *  ProtectedRoute có nhiệm vụ kiểm tra xem người dùng đã đăng nhập hay chưa
 *
 * Triển khai chức năng: lưu trữ thông tin của người đăng nhập
 *  sẽ có nhiều chức năng khác trong phần mềm cần phân quyền thể nên chúng ta cần 1 nơi lưu trữ các dữ liệu mô tả họ
 *   là ai: userId, role, storeId
 *  khi hàm đăng nhập được kích hoạt, và đăng nhập thành công, client sẽ gửi thêm 1 request tới cho backend để lấy thông tin mô
 *   tả người dùng và lưu trữ vào authSlice
 *
 * Đã triển khai hoàn chỉnh ở backend, tiếp theo chúng ta làm ở front end
 *
 */
