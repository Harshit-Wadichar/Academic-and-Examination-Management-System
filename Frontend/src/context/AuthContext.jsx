import { createContext, useState } from 'react'
import PropTypes from 'prop-types'
import { getUser, setUser as storeUser, clearAll, getToken } from '../services/storage.service.js'
import * as authService from '../services/auth.service.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = getUser()
    const storedToken = getToken()
    return storedUser && storedToken ? storedUser : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (credentials) => {
    setLoading(true)
    try {
      const res = await authService.login(credentials)
      if (res?.user) {
        setUser(res.user)
      }
      return res
    } catch (error) {
      setLoading(false)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearAll()
    setUser(null)
  }

  const value = {
    user,
    setUser,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = { children: PropTypes.node }

AuthProvider.propTypes = { children: PropTypes.node }
