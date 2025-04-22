const ProfileBase = "/staffs";

const ProfileEndpoints = {
  getById: (staffId: string) => `${ProfileBase}/${staffId}`,
  updateById: (staffId: string) => `${ProfileBase}/${staffId}`,
};

export default ProfileEndpoints;
