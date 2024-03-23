import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuthContext } from '.'
import { useToast, useDisclosure } from '@chakra-ui/react'

interface Tour {
  _id?: string
  name: string
  country: string
  city: string
  maxPeople: string
  typeOfAvailability: string
  availability: string
  date: string
  from: string
  to: string
  description: string
  photos: File[] | null
}

const useMyTours = () => {
  const toast = useToast()
  const { onClose } = useDisclosure()
  const { state } = useAuthContext()
  const { user } = state
  const [tours, setTours] = useState<Tour[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [myTourInfo, setMyTourInfo] = useState<Tour>({
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
    photos: null,
  })

  useEffect(() => {
    const fetchTours = async () => {
      if (!user?.token) return
      setIsLoading(true)
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/mytours`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        )
        setTours(response.data)
      } catch (error) {
        console.error('Error fetching tours:', error)
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

      console.log('Immediately selected files:', updatedFiles)
      setMyTourInfo((prevForm) => ({
        ...prevForm,
        [name]: updatedFiles,
      }))
    } else {
      const value = target.value || ''
      setMyTourInfo((prevForm) => ({
        ...prevForm,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault() // Prevent default form submission behavior

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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/mytours`, // Adjust URL to your endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      )
      console.log('Tour created successfully:', response.data)

      // Assuming response.data contains the new tour details
      const newTour = response.data
      // Update the tours state to include the new tour
      setTours((prevTours) => [...prevTours, newTour])

      toast({
        title: 'Tour Created',
        description: 'Your tour has been successfully created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      onClose()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error response:', error.response)
        toast({
          title: 'Error',
          description:
            'An error occurred while creating the tour. Please try again later.',
          status: 'error',
          duration: 5000, 
          isClosable: true,
        })
      } else {
        console.error('An unexpected error occurred:', error)
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again later.',
          status: 'error',
          duration: 5000, 
          isClosable: true,
        })
      }
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setMyTourInfo((prev) => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index) || null,
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
