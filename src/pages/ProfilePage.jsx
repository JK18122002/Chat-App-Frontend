import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext'

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const [preview, setPreview] = useState(authUser?.profilePic || assets.avatar_icon)
  const [name, setName] = useState(authUser?.fullName || '')
  const [bio, setBio] = useState(authUser?.bio || '')
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false) // 🔔 Confirmation dialog
  const navigate = useNavigate()
  const panelRef = useRef(null)

  // Store initial values to detect unsaved changes
  const initialData = {
    profilePic: authUser?.profilePic || '',
    fullName: authUser?.fullName || '',
    bio: authUser?.bio || '',
  }

  // Sync state when authUser changes
  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || '')
      setBio(authUser.bio || '')
      setPreview(authUser.profilePic || assets.avatar_icon)
    }
  }, [authUser])

  // Preview selected image
  useEffect(() => {
    if (!selectedImg) return
    const objectUrl = URL.createObjectURL(selectedImg)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedImg])

  // Check for unsaved changes
  const hasUnsavedChanges = () => {
    return (
      name.trim() !== (authUser?.fullName || '') ||
      bio.trim() !== (authUser?.bio || '') ||
      (selectedImg !== null)
    )
  }

  // Click outside to close with confirmation
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        if (hasUnsavedChanges()) {
          setShowConfirm(true)
        } else {
          navigate('/')
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navigate, name, bio, selectedImg])

  // Convert file to base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
    })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !bio.trim()) return

    setLoading(true)
    try {
      let base64Image = null
      if (selectedImg) {
        base64Image = await fileToBase64(selectedImg)
      }

      await updateProfile({
        profilePic: base64Image,
        fullName: name.trim(),
        bio: bio.trim(),
      })

      navigate('/') // redirect after saving
    } catch (err) {
      console.error('Profile update error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle confirmed exit
  const confirmExit = () => navigate('/')
  const cancelExit = () => setShowConfirm(false)

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center relative">
      <div
        ref={panelRef}
        className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg relative"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            if (hasUnsavedChanges()) setShowConfirm(true)
            else navigate('/')
          }}
          className="absolute top-3 right-3 text-gray-300 hover:text-white text-xl font-bold"
        >
          ×
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg font-semibold">Profile details</h3>

          {/* Upload field */}
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input
              type="file"
              id="avatar"
              accept="image/png, image/jpeg, image/jpg"
              hidden
              onChange={(e) => setSelectedImg(e.target.files[0])}
              disabled={loading}
            />
            <img
              src={preview}
              alt="Profile Preview"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-sm">Upload profile image</span>
          </label>

          {/* Name input */}
          <input
            type="text"
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            disabled={loading}
          />

          {/* Bio textarea */}
          <textarea
            rows={4}
            required
            placeholder="Write Profile Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            disabled={loading}
          />

          {/* Save button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>

        {/* Right preview avatar */}
        <img
          src={preview || assets.logo_icon}
          alt="Profile"
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 object-cover"
        />
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg text-gray-200 max-w-sm w-full flex flex-col gap-4">
            <p>Are you sure you want to exit without saving changes?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelExit}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmExit}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
