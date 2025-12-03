import { createContext, useContext, useState, useEffect } from 'react'

// Create the context
const AuthContext = createContext()

// API Base URL - غيرها حسب السيرفر حقك
const API_URL = '/api'

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('fitzone_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // Register new user (PHP API)
  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      // Save user to state and localStorage
      setUser(data.user)
      localStorage.setItem('fitzone_user', JSON.stringify(data.user))

      return data.user
    } catch (error) {
      throw new Error(error.message || 'Registration failed')
    }
  }

  // Login user (PHP API)
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      // Save user to state and localStorage
      setUser(data.user)
      localStorage.setItem('fitzone_user', JSON.stringify(data.user))

      return data.user
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    }
  }

  // Logout user
  const logout = () => {
    setUser(null)
    localStorage.removeItem('fitzone_user')
  }

  // Update user profile (PHP API)
  const updateProfile = async (updatedData) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          ...updatedData
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      // Update user in state and localStorage
      const updatedUser = { ...user, ...data.user }
      setUser(updatedUser)
      localStorage.setItem('fitzone_user', JSON.stringify(updatedUser))

      return updatedUser
    } catch (error) {
      throw new Error(error.message || 'Update failed')
    }
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext