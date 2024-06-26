import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { getCode } from 'country-list'
import { useToast } from '@chakra-ui/react'
import useAuthContext from './useAuthContext'
import { User } from '../types'
import { fetchUserProfile, updateUserProfile } from '../services'

const useProfile = () => {
  const { state } = useAuthContext()
  const { user } = state
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const toast = useToast()
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [initialUserInfo, setInitialUserInfo] = useState<User | null>(null)
  const [userInfo, setUserInfo] = useState<User>({
    firstName: '',
    lastName: '',
    country: '',
    city: '',
    languagesSpoken: [],
    interests: [],
    gender: '',
    bio: '',
    phoneNumber: '',
    birthDate: '',
    currentPassword: '',
    newPassword: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (!user || !user._id) {
          throw new Error('User is not available.')
        }

        const data = await fetchUserProfile(user._id)
        const formattedBirthDate = data.birthDate
          ? new Date(data.birthDate).toISOString().split('T')[0]
          : ''
        setUserInfo({ ...data, birthDate: formattedBirthDate })
      } catch (error) {
        toast({
          title: 'Failed to fetch user profile.',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user && user._id) {
      fetchData()
    }
  }, [user, toast])

  const countryCode: string | undefined = userInfo.country
    ? getCode(userInfo.country)
    : undefined

  const updateProfile = async (userInfo: User) => {
    try {
      if (!user || !user._id) {
        throw new Error('User or user token is not available.')
      }
      await updateUserProfile(user._id, userInfo)
      setIsEditMode(false)
      toast({
        title: 'Profile updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsEditMode(true)

        const message =
          error.response?.data?.error ||
          'An error occurred while updating profile.'
        toast({
          title: 'Error updating profile.',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } else if (error instanceof Error) {
        toast({
          title: 'Error updating profile.',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }

  const handleUserInfoChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target
    const newValues = { ...userInfo }

    if (name === 'languagesSpoken' || name === 'interests') {
      newValues[name] = value.split(',').map((item) => item)
    } else {
      newValues[name] = value
    }

    setUserInfo(newValues)
  }

  const prepareDataForDatabase = (userInfoToClean: User): User => {
    const cleanedData = { ...userInfoToClean }
    if (cleanedData.languagesSpoken) {
      cleanedData.languagesSpoken = cleanedData.languagesSpoken.map((item) =>
        item.trim(),
      )
    }
    if (cleanedData.interests) {
      cleanedData.interests = cleanedData.interests.map((item) => item.trim())
    }
    return cleanedData
  }

  const handleButtonClick = () => inputFileRef.current?.click()

  const handleEdit = () => {
    setInitialUserInfo({ ...userInfo })
    setIsEditMode(true)
  }

  const handleCancel = () => {
    if (initialUserInfo) {
      setUserInfo(initialUserInfo)
      setInitialUserInfo(null)
    }
    setIsEditMode(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const dataToSubmit = prepareDataForDatabase(userInfo)
    await updateProfile(dataToSubmit)
    setInitialUserInfo(null)
  }

  return {
    isLoading,
    isEditMode,
    inputFileRef,
    userInfo,
    countryCode,
    handleUserInfoChange,
    handleButtonClick,
    handleEdit,
    handleCancel,
    handleSubmit,
  }
}

export default useProfile
