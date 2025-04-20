import React, { ReactNode, useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import authApi from "../authApi"
import { IUserSession } from "../authTypes"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface ProtectedRouteProps {
  children: ReactNode
  allowRoles: string[]
}

const ProtectedRoute = ({ children, allowRoles }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [role, setRole] = useState<IUserSession | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const isLogin = await authApi.isAuth()
      const roleS = await authApi.getMeInfo()
      setIsAuthenticated(isLogin)
      setRole(roleS)
    }

    checkAuth()
  }, [])

  if (isAuthenticated === null) return <div>Loading...</div>

  if (isAuthenticated) {
    if (role && allowRoles.includes(role.role)) {
      return <>{children}</>
    }
    // Hiển thị toast thông báo lỗi và điều hướng
    toast.error("Bạn không có quyền truy cập trang này", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
    return <Navigate to="/unauthorized" />
  } else {
    return <Navigate to="/login" />
  }

  // return isAuthenticated ? children : <Navigate to="/login" />
}

export default ProtectedRoute
