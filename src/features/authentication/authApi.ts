import api from "../../app/api"
import AuthEndpoint from "./authEndpoints"
import { IUserSession } from "./authTypes"

const authApi = {
  async login(email: string, password: string): Promise<string> {
    const response = await api.post(AuthEndpoint.login, {
      email,
      password,
    })
    console.log("login admin authApi", response)
    return response.data.message
  },
  async getMeInfo(): Promise<IUserSession> {
    const response = await api.get(AuthEndpoint.me)
    return response.data.me
  },
  async isAuth(): Promise<boolean> {
    const response = await api.get(AuthEndpoint.verify)
    console.log("isAUth", response)
    return response.data.isAuth
  },
  async logOut(): Promise<string> {
    const response = await api.post(AuthEndpoint.logOut)
    return response.data.message
  },
}

export default authApi
