import React, { createContext, useContext, useState, useEffect } from 'react'
import { ChildrenProps } from '../types'
import {
  fetchProfilePhoto,
  updateProfilePhoto,
  removeProfilePhoto,
} from '../services'
import { useAuthContext } from '../hooks'

interface ProfilePhotoContextType {
  photo: string | null
  updatePhoto: (file: File | null) => Promise<void>
  removePhoto: () => Promise<void>
}

const defaultContextValue: ProfilePhotoContextType = {
  photo: null,
  updatePhoto: async () => {},
  removePhoto: async () => {},
}

export const ProfilePhotoContext =
  createContext<ProfilePhotoContextType>(defaultContextValue)

export const ProfilePhotoProvider: React.FC<ChildrenProps> = ({ children }) => {
  const { state } = useAuthContext()
  const { user } = state
  const [photo, setPhoto] = useState<string | null>(null)

  useEffect(() => {
    const loadPhoto = async () => {
      if (user?.token && user?._id) {
        try {
          const photoUrl = await fetchProfilePhoto(user.token, user._id)
          setPhoto(photoUrl)
        } catch (error) {
          console.error('Error fetching profile photo:', error)
        }
      }
    }

    loadPhoto()
  }, [user?.token, user?._id])

  const updatePhoto = async (file: File | null) => {
    try {
      let photoUrl = null
      if (user?.token && user?._id) {
        if (file) {
          photoUrl = await updateProfilePhoto(user.token, user._id, file)
        } else {
          await removeProfilePhoto(user.token, user._id)
          photoUrl = null
        }
        setPhoto(photoUrl)
      }
    } catch (error) {
      console.error('Error updating/removing profile photo:', error)
      throw error
    }
  }

  const removePhoto = async () => {
    try {
      if (user?.token && user?._id) {
        await removeProfilePhoto(user.token, user._id)
        setPhoto(null)
      }
    } catch (error) {
      console.error('Error removing profile photo:', error)
    }
  }

  return (
    <ProfilePhotoContext.Provider value={{ photo, updatePhoto, removePhoto }}>
      {children}
    </ProfilePhotoContext.Provider>
  )
}

export const useProfilePhoto = () => useContext(ProfilePhotoContext)
