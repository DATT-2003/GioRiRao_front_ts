import api from "../../../app/api"
import ProfileEndpoints from "./profileEndpoints"
import { IProfile } from "../types/profileTypes"

const profileApi = {
  async getById(staffId: string): Promise<IProfile> {
    const response = await api.get(ProfileEndpoints.getById(staffId))
    return response.data.data
  },

  async updateById(
    staffId: string,
    data: Partial<IProfile>,
  ): Promise<IProfile> {
    const response = await api.put(ProfileEndpoints.updateById(staffId), data)
    return response.data.data
  },
}

export default profileApi
