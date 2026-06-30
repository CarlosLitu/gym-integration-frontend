const TOKEN_KEY = 'gym_auth_token'
const USER_KEY = 'gym_auth_user'
const SELECTED_TENANT_KEY = 'gym_selected_tenant'

export const storage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY)
  },

  getUser<T>(): T | null {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as T) : null
  },

  setUser<T>(user: T): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  removeUser(): void {
    localStorage.removeItem(USER_KEY)
  },

  getSelectedTenant<T>(): T | null {
    const raw = localStorage.getItem(SELECTED_TENANT_KEY)
    return raw ? (JSON.parse(raw) as T) : null
  },

  setSelectedTenant<T>(tenant: T): void {
    localStorage.setItem(SELECTED_TENANT_KEY, JSON.stringify(tenant))
  },

  clearSelectedTenant(): void {
    localStorage.removeItem(SELECTED_TENANT_KEY)
  },

  clearSession(): void {
    this.removeToken()
    this.removeUser()
    this.clearSelectedTenant()
  },
}
