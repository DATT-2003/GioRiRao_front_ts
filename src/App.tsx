import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Home from "./pages/home/Home"
import Navigation from "./features/common/Navigation"
import LoginPage from "./pages/authentication/LoginPage"
import ProtectedRoute from "./features/authentication/components/ProtectedRoute"
import SettingsPage from "./pages/setting/SettingsPage"
import ManagemenrPage from "./pages/management/ManagementPage"
import InformationPage from "./features/management/components/InformationPage"
import AddStaffForm from "./features/management/components/AddStaff"
import AddStoreForm from "./features/management/components/AddStore"
import UpdateStore from "./features/management/components/UpdateStore"
import UpdateStaff from "./features/management/components/UpdateStaff"

const App = () => {
  return (
    <BrowserRouter>
      <MainContent />
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
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/management">
              <Route index element={<ManagemenrPage />} />
              <Route path="information/:id" element={<InformationPage />} />
              <Route path="addstaff" element={<AddStaffForm />} />
              <Route path="editstaff/:id" element={<UpdateStaff />} />
              <Route path="addstore" element={<AddStoreForm />} />
              <Route path="editstore/:id" element={<UpdateStore />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
