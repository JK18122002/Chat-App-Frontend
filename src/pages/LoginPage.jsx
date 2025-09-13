import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext'

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const { login } = useContext(AuthContext)

  // Reset form when switching modes
  const resetForm = () => {
    setFullName("")
    setEmail("")
    setPassword("")
    setBio("")
    setIsDataSubmitted(false)
    setAgreed(false)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault()

    if (currentState === "Sign up" && !agreed) {
      alert("You must agree to the terms before continuing.")
      return
    }

    // Step 1 → Step 2 in signup
    if (currentState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }

    const payload =
      currentState === "Sign up"
        ? { fullName, email, password, bio }
        : { email, password }

    login(currentState === "Sign up" ? "signup" : "login", payload)
  }

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

        {/* Step 1 (login + signup) */}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Address"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </>
        )}

        {/* Step 2 - Bio */}
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

        {/* Button */}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:opacity-90 transition"
        >
          {currentState === "Sign up"
            ? isDataSubmitted
              ? "Finish Signup"
              : "Next Step"
            : "Login Now"}
        </button>

        {/* Toggle */}
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
