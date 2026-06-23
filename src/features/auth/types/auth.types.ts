export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload extends LoginCredentials {
  name: string
}

export interface UserSession {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  token: string
  user: UserSession
}
