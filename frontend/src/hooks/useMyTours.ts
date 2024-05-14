import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuthContext } from '.'
import { useDisclosure, useToast } from '@chakra-ui/react'
import { Tour } from '../types'
import {
  fetchMyTours,
  createTour,
  updateTour,
  getTourById,
  deleteTour,
} from '../services'

const initialTourInfo = {
  id: null,
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

const useMyTours = () => {
  const toast = useToast()
  const { state } = useAuthContext()
  const { user } = state
  const [tours, setTours] = useState<Tour[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [myTourInfo, setMyTourInfo] = useState<Tour>(initialTourInfo)

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading(true)
      try {
        const allTours = await fetchMyTours()
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
  }, [user])

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

    try {
      let tourResult
      if (myTourInfo._id) {
        tourResult = await updateTour(myTourInfo._id, formData)
        setTours((prevTours) =>
          prevTours.map((tour) =>
            tour._id === myTourInfo._id ? { ...tour, ...tourResult } : tour,
          ),
        )
      } else {
        tourResult = await createTour(formData)
        setTours((prevTours) => [...prevTours, tourResult])
      }

      toast({
        title: `Tour ${myTourInfo._id ? 'Updated' : 'Created'} Successfully.`,
        description: `Your tour has been successfully ${myTourInfo._id ? 'updated' : 'created'}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      onClose()
      setMyTourInfo(initialTourInfo)
      setSelectedFiles([])
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
    setMyTourInfo((prev) => {
      const updatedPhotos = [...prev.photos]
      updatedPhotos.splice(index, 1)
      return {
        ...prev,
        photos: updatedPhotos,
      }
    })
  }

  const handleEditTour = async (tourId) => {
    setIsLoading(true)
    try {
      if (!user?.token) {
        throw new Error('User token is not available.')
      }

      const data = await getTourById(tourId)

      setMyTourInfo({
        ...initialTourInfo,
        ...data,
      })

      setSelectedFiles(
        data.photos.map((photoUrl, index) => ({
          file: null,
          name: `photo-${index + 1}`,
          preview: photoUrl,
        })),
      )

      onOpen()
    } catch (error) {
      toast({
        title: 'Failed to fetch tour details.',
        description: 'Please check your connection and try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTour = async (tourId) => {
    setIsLoading(true)
    try {
      await deleteTour(tourId)
      setTours((prevTours) => prevTours.filter((tour) => tour._id !== tourId))
      toast({
        title: 'Tour Deleted Successfully.',
        description: 'The tour has been removed from your listings.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Failed to delete tour.',
        description: 'Please check your connection and try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTour = () => {
    setMyTourInfo(initialTourInfo)
    setSelectedFiles([])
    onOpen()
  }

  return {
    tours,
    isLoading,
    selectedFiles,
    myTourInfo,
    handleInputChange,
    handleSubmit,
    handleRemoveFile,
    handleEditTour,
    handleDeleteTour,
    isOpen,
    onOpen,
    onClose,
    setMyTourInfo,
    handleAddTour,
  }
}

export default useMyTours
