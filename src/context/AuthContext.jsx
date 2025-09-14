import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'

const backendUrl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendUrl

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [authUser, setAuthUser] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      checkAuth()
    }
  }, [token])

  useEffect(() => {
    return () => {
      socket?.disconnect()
    }
  }, [socket])

  const checkAuth = async () => {
    try {
      const { data } = await axios.get('/api/auth/check')
      if (data.success) {
        setAuthUser(data.user)
        connectSocket(data.user)
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        setToken(null)
        setAuthUser(null)
      }
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials)
      if (data.success) {
        setAuthUser(data.userData)
        connectSocket(data.userData)
        const userToken = data.token
        setToken(userToken)
        localStorage.setItem('token', userToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
        toast.success(data.message || 'Login successful')
      } else {
        toast.error(data.message || 'Login failed')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setAuthUser(null)
    setOnlineUsers([])
    delete axios.defaults.headers.common['Authorization']
    socket?.disconnect()
    setSocket(null)
    toast.success('Logged out successfully')
  }

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put('/api/auth/update-profile', body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) {
        setAuthUser(data.user)
        toast.success('Profile updated successfully')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
      autoConnect: true,
    })

    setSocket(newSocket)

    newSocket.on('getOnlineUsers', (userIds) => setOnlineUsers(userIds))
  }

  return (
    <AuthContext.Provider
      value={{
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
