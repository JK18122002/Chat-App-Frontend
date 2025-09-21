import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext'

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { login } = useContext(AuthContext)

  const resetForm = () => {
    setFullName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setBio("")
    setIsDataSubmitted(false)
    setAgreed(false)
    setLoading(false)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (currentState === "Sign up" && isDataSubmitted && password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    if (currentState === "Sign up" && !agreed) {
      alert("You must agree to the terms before continuing.")
      return
    }

    if (currentState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }

    const payload =
      currentState === "Sign up"
        ? { fullName, email, password, bio }
        : { email, password }

    try {
      setLoading(true)
      await login(currentState === "Sign up" ? "signup" : "login", payload)
    } finally {
      setLoading(false)
    }
  }

  // Eye icons
  const EyeIcon = ({ open }) => (
    open ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.963 9.963 0 012.223-3.573M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
      </svg>
    )
  )

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* Logo */}
      <img
        src={assets.logo_big}
        alt="Logo"
        className="w-[min(30vw,250px)] select-none"
      />

      {/* Form */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-[min(90vw,400px)]"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="back"
              className="w-5 cursor-pointer hover:opacity-80 transition"
            />
          )}
        </h2>

        {/* Step 1 - Full name */}
        {currentState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Full Name"
            required
          />
        )}

        {/* Email */}
        {!isDataSubmitted && (
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email Address"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        )}

        {/* Password */}
        {!isDataSubmitted && (
          <div className="relative">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 w-full"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        )}

        {/* Confirm Password */}
        {currentState === "Sign up" && isDataSubmitted && (
          <div className="relative">
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 w-full"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
            >
              <EyeIcon open={showConfirmPassword} />
            </button>
          </div>
        )}

        {/* Bio */}
        {currentState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Provide a short bio..."
            required
          ></textarea>
        )}

        {/* Terms */}
        {currentState === "Sign up" && (
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="cursor-pointer"
            />
            Agree to the terms of use & privacy policy.
          </label>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:opacity-90 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? "Please wait…" : 
            currentState === "Sign up" 
            ? isDataSubmitted ? "Finish Signup" : "Next Step" 
            : "Login Now"}
        </button>

        {/* Toggle Login/Signup */}
        <div className="flex flex-col gap-2 text-center">
          {currentState === "Sign up" ? (
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("Login")
                  resetForm()
                }}
                className="font-medium text-violet-400 cursor-pointer hover:underline"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              Don’t have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("Sign up")
                  resetForm()
                }}
                className="font-medium text-violet-400 cursor-pointer hover:underline"
              >
                Sign up here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage