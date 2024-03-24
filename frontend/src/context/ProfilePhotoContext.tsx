import React, { createContext, useContext, useState, useEffect } from 'react'
import { ChildrenProps } from '../types'
import { profilePhotoService } from '../services'
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
  const { fetchProfilePhoto, updateProfilePhoto, removeProfilePhoto } =
    profilePhotoService()
  const { state } = useAuthContext()
  const { user } = state
  const [photo, setPhoto] = useState<string | null>(null)

  useEffect(() => {
    if (user && user.token) {
      fetchProfilePhoto()
        .then((photoUrl) => {
          setPhoto(photoUrl)
        })
        .catch((error) => {
          console.error('Error fetching profile photo:', error)
        })
    }
  }, [user, photo])

  const updatePhoto = async (file: File | null) => {
    try {
      let photoUrl
      if (file) {
        photoUrl = await updateProfilePhoto(file)
      } else {
        await removeProfilePhoto()
        photoUrl = null
      }
      setPhoto(photoUrl)
    } catch (error) {
      console.error('Error updating/removing profile photo:', error)
      throw error
    }
  }

  const removePhoto = async () => {
    try {
      await removeProfilePhoto()
      setPhoto(null)
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
