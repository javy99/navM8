import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuthContext } from '.'
import { useToast } from '@chakra-ui/react'
import { Tour } from '../types'
import { fetchMyTours, createTour } from '../services'

const initialTourInfo = {
  name: '',
  country: '',
  city: '',
  maxPeople: '',
  typeOfAvailability: '',
  availability: '',
  date: '',
  from: '',
  to: '',
  description: '',
  photos: [],
  author: {
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
  },
}

const useMyTours = (onClose) => {
  const toast = useToast()
  const { state } = useAuthContext()
  const { user } = state

  const [tours, setTours] = useState<Tour[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [myTourInfo, setMyTourInfo] = useState<Tour>(initialTourInfo)

  useEffect(() => {
    const fetchTours = async () => {
      if (!user?.token) return
      setIsLoading(true)
      try {
        const allTours = await fetchMyTours(user.token)
        setTours(allTours)
      } catch (error) {
        toast({
          title: 'Failed to fetch tours.',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTours()
  }, [user?.token])

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = event.target as HTMLInputElement
    const { name, type } = target

    if (type === 'file') {
      const newFiles = target.files ? Array.from(target.files) : []
      const updatedFiles = [...selectedFiles, ...newFiles]

      setSelectedFiles(updatedFiles)

      setMyTourInfo((prevForm) => ({
        ...prevForm,
        [name]: updatedFiles,
      }))

      target.value = ''
    } else {
      const value = target.value || ''
      setMyTourInfo((prevForm) => ({
        ...prevForm,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const formData = new FormData()
    Object.entries(myTourInfo).forEach(([key, value]) => {
      if (key === 'photos' && Array.isArray(value)) {
        value.forEach((file: File) => {
          formData.append('photos', file)
        })
      } else {
        formData.append(key, value ?? '')
      }
    })

    // Log FormData contents using Array.from()
    const entries = Array.from(formData.entries())
    entries.forEach(([key, value]) => {
      console.log(`${key}:`, value, typeof value)
    })

    try {
      if (!user?.token) {
        throw new Error('User token is not available.')
      }

      const formData = new FormData()
      Object.entries(myTourInfo).forEach(([key, value]) => {
        if (key === 'photos' && Array.isArray(value)) {
          value.forEach((file: File) => {
            formData.append('photos', file)
          })
        } else {
          formData.append(key, value ?? '')
        }
      })

      const newTour = await createTour(formData, user.token)
      setTours((prevTours) => [...prevTours, newTour])

      toast({
        title: 'Tour Created successfully.',
        description: 'Your tour has been successfully created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      setMyTourInfo(initialTourInfo)
      setSelectedFiles([])

      onClose()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          'An error occurred while creating tour.'

        toast({
          title: 'Error creating tour.',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } else {
        if (error instanceof Error) {
          toast({
            title: 'Error creating tour.',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
      }
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setMyTourInfo((prev) => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index) || [],
    }))
  }

  return {
    tours,
    isLoading,
    selectedFiles,
    myTourInfo,
    handleInputChange,
    handleSubmit,
    handleRemoveFile,
  }
}

export default useMyTours
