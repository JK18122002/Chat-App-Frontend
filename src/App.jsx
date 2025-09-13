import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from './context/AuthContext'
import bgImage from './assets/bgImage.svg'

const App = () => {
  const { authUser } = useContext(AuthContext)

  // Optional: show loader while auth is checking
  if (authUser === undefined) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div
        className="bg-cover bg-center min-h-screen"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />

          {/* Catch-all fallback */}
          <Route
            path="*"
            element={<Navigate to={authUser ? '/' : '/login'} replace />}
          />
        </Routes>
      </div>
    </>
  )
}

export default App
