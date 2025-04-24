import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Home from "./pages/home/Home"
import Navigation from "./features/common/Navigation"
import LoginPage from "./pages/authentication/LoginPage"
import ProtectedRoute from "./features/authentication/components/ProtectedRoute"
import SettingsPage from "./pages/setting/SettingsPage"
import OrderListPage from "./pages/orderchecklist/OrderListPage"
import StatisticPage from "./pages/statistic/StatisticPage"
import ProfilePage from "./pages/profile/ProfilePage"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import InventoryPage from "./pages/inventory/InventoryPage"

const App = () => {
  return (
    <BrowserRouter>
      <MainContent />
      <ToastContainer />
    </BrowserRouter>
  )
}

const MainContent = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === "/login"

  return (
    <div className="min-h-screen bg-gray-800 text-white flex">
      {!isLoginPage && <Navigation />}
      <div className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowRoles={["admin","storeManager","staffCashier","staffBarista"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute
                allowRoles={["storeManager", "staffCashier", "admin"]}
              >
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute allowRoles={["storeManager", "staffCashier"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowRoles={["admin", "storeManager"]}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <ProtectedRoute allowRoles={["admin", "storeManager"]}>
                <StatisticPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Orderlist"
            element={
              <ProtectedRoute
                allowRoles={["storeManager", "staffBarista", "admin"]}
              >
                <OrderListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventories"
            element={
              <ProtectedRoute allowRoles={["storeManager", "admin"]}>
                <InventoryPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
