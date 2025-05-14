import React, { useState } from "react"
import authApi from "../../features/authentication/authApi"
import { useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"

interface IFormData {
  email: string
  password: string
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<IFormData>({
    email: "dbh.hcm@gmail.com",
    password: "matkhau",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await authApi.login(formData.email, formData.password)
      const roleS = await authApi.getMeInfo()
      //Nếu roleS == storeManager thì lưu lại id của manager
      //Mở popup ManagementById
      if (roleS.role === "admin" || roleS.role === "storeManager") {
        navigate("/management")
      } else if (roleS.role === "staffCashier") {
        navigate("/")
      } else {
        navigate("/profile")
      }
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <ShoppingCart className="w-24 h-24 text-white" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-8 mt-10  ">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            ></label>
            <input
              className="shadow appearance-none border border-white rounded w-full py-2 px-3 bg-gray-800 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white"
              id="email"
              name="email"
              type="text"
              placeholder="EMAIL"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-10">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            ></label>
            <input
              className="shadow appearance-none border border-white rounded w-full py-2 px-3 bg-gray-800 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white"
              id="password"
              name="password"
              type="password"
              placeholder="PASSWORD"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-4">
            <button
              className="w-full bg-white text-black font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-300 hover:bg-gray-200"
              type="submit"
            >
              LOGIN
            </button>
            <div className="flex justify-end">
              <a
                className="font-bold text-sm text-white hover:text-gray-300"
                href="#"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

/**
 * When people go to my website, the system will check if they are login or not
 * If they are not login, they will redirect to the login page
 * Otherwise, they will see the home page
 *
 * How to check if they are login or not?
 * Maybe I can check the request header to see if they have access token or not
 *
 * If they have it mean they logged in
 * When they have it, I need to check if the token is valid or not
 *
 * So the first thing I need to do is to create a protected route
 * then wrap routes need to be protected inside it
 *
 * How do this protected route works?
 * It will check one value from the auth slice: isAuthenticated
 * If it is true, then it return the outlet
 * Else, it will redirect to the login page
 *
 * So the protected route will take the isAuthenticated from the auth slice
 * How the auth slice check if the user is authenticated or not?
 * Auth slice will take the access token from the memory, for specific from the auth slice itslef
 *
 * You wonder how this happen?
 * Let me explain!!
 *
 * We will create a access token value inside auth slice
 * When the user login, and backend send back the access token, front end will save it to the auth slice access token state
 *
 */
