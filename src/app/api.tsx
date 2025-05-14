import axios from "axios"
import { toast } from "react-toastify"
import authApi from "../features/authentication/authApi"

const api = axios.create({
  baseURL: "http://localhost:3001/api/v1", // Replace with your API base URL
  timeout: 50000, // Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

interface ShowSessionExpiredModalProps {
  onConfirm: () => void
}

const showSessionExpiredModal = (
  onConfirm: ShowSessionExpiredModalProps["onConfirm"],
) => {
  const toastId = toast(
    <div>
      <p>Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.</p>
      <button
        onClick={() => {
          onConfirm()
          toast.dismiss(toastId) // Đóng toast sau khi xác nhận
        }}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Xác nhận
      </button>
    </div>,
    {
      autoClose: false, // Không tự động đóng
      closeOnClick: false, // Không đóng khi click
      draggable: false,
      position: "top-center",
    },
  )
}

// Response interceptor (e.g., for handling errors globally)
api.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response?.status === 401 &&
      error.response.data.message === "Access token is invalid"
    ) {
      // Hiển thị thông báo với nút xác nhận
      showSessionExpiredModal(async () => {
        try {
          // Gọi API đăng xuất
          authApi.logOut()
        } catch (logoutError) {
          console.error("Logout error:", logoutError)
        }
        // Chuyển hướng đến trang đăng nhập
        window.location.href = "/login"
      })
    }
    return Promise.reject(error)
  },
)

export default api
