import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext)
  const { logout, onlineUsers } = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([])

  useEffect(() => {
    setMsgImages(messages.filter(msg => msg.image).map(msg => msg.image))
  }, [messages])

  if (!selectedUser) return null

  return (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? 'max-md:hidden' : ''}`}>
      {/* profile section */}
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="user avatar"
          className="w-20 aspect-square rounded-full object-cover"
        />
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
          {selectedUser.fullName}
        </h1>
        <p className="px-10 mx-auto text-center">{selectedUser.bio}</p>
      </div>

      <hr className="border-[#ffffff50] my-4" />

      {/* media gallery */}
      <div className="px-5 text-xs">
        <p className="font-semibold">Media</p>
        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {Array.isArray(msgImages) && msgImages.length > 0 ? (
            msgImages.map((url, index) => (
              <div key={index} className="rounded">
                <img
                  src={url}
                  alt={`media-${index}`}
                  className="h-full w-full rounded-md object-cover"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-2">No media yet</p>
          )}
        </div>
      </div>

      {/* logout button */}
      <button
        onClick={logout}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm font-light py-2 px-20 rounded-full cursor-pointer"
      >
        Logout
      </button>
    </div>
  )
}

export default RightSidebar
