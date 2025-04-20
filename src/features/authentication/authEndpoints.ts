const AuthBase: string = "/auth"

const AuthEndpoint = {
  login: `${AuthBase}/login`,
  me: `${AuthBase}/me`,
  verify: `${AuthBase}/verify`,
  logOut: `${AuthBase}/logout`
}

export default AuthEndpoint
