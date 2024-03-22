import React, { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  VStack,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useTheme,
  useBreakpointValue,
  ResponsiveValue,
  useToast,
  Spinner,
} from '@chakra-ui/react'
// import { BsGeoAltFill } from 'react-icons/bs'
import { Navbar, Sidebar, TourCard, Button, FormField } from '../components'
import { useAuthContext } from '../hooks'
import axios from 'axios'

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

const MyTours: React.FC = () => {
  const toast = useToast()
  const { state } = useAuthContext()
  const { user } = state
  const { isOpen, onOpen, onClose } = useDisclosure()
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tours, setTours] = useState<Tour[]>([])

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
      setIsLoading(true)
      if (!user?.token) {
        setIsLoading(false)
        return // Exit the function if there's no token
      }
      // Proceed with fetching tours if the token exists
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
  }, [user?.token]) // Fetch tours only once when component mounts

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
        duration: 5000, // Optional duration in milliseconds
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
          duration: 5000, // Optional duration in milliseconds
          isClosable: true,
        })
      } else {
        console.error('An unexpected error occurred:', error)
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again later.',
          status: 'error',
          duration: 5000, // Optional duration in milliseconds
          isClosable: true,
        })
      }
    }
  }

  const handleRemoveFile = (indexToRemove, inputName) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove),
    )
    setMyTourInfo((prevInfo) => ({
      ...prevInfo,
      photos: prevInfo.photos
        ? prevInfo.photos.filter((_, index) => index !== indexToRemove)
        : null,
    }))

    // Reset the input file element value
    const inputElement = document.querySelector(
      `input[name="${inputName}"]`,
    ) as HTMLInputElement
    if (inputElement) inputElement.value = ''
  }

  type FlexDirection =
    | 'row'
    | 'column'
    | 'row-reverse'
    | 'column-reverse'
    | undefined

  const vStackPaddingX = useBreakpointValue({ base: 4 })
  const vStackPaddingY = useBreakpointValue({ base: 3, md: 4, lg: 4 })
  const inputGap = useBreakpointValue({ base: 6, lg: 8, xxl: 12 })
  const formControlLayout: ResponsiveValue<FlexDirection> = useBreakpointValue({
    base: 'column',
    xl: 'row',
  })

  return (
    <Flex minHeight="100vh" direction={{ base: 'column', md: 'row' }}>
      <Sidebar user={user} />
      <Flex direction="column" flex="1" overflowY="auto">
        <Navbar />
        {isLoading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
          >
            <Spinner
              size="xl"
              color={primaryColor}
              thickness="5px"
              speed="1s"
            />
          </Box>
        ) : (
          <VStack align="stretch" p={8}>
            <Flex alignItems="center" justifyContent="space-between" mb={4}>
              <Heading as="h3" fontSize="1.5rem" color={primaryColor}>
                Offered Tours
              </Heading>
              <Button onClick={onOpen}>Add Tour</Button>
            </Flex>
            <Flex gap="5%" wrap={'wrap'}>
              {tours.map((tour) => (
                <TourCard width="45%" tour={tour} key={tour._id} />
              ))}
            </Flex>
            <Box
              width="100%"
              borderTop={`2px dashed ${secondaryColor}`}
              my={6}
            />
            <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
              Upcoming Tours
            </Heading>
            <Flex gap="5%">
              <TourCard width="45%" />
              <TourCard width="45%" />
            </Flex>
            <Box
              width="100%"
              borderTop={`2px dashed ${secondaryColor}`}
              my={6}
            />
            <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
              Past Tours
            </Heading>
            <Flex gap="5%">
              <TourCard width="45%" />
              <TourCard width="45%" />
            </Flex>
          </VStack>
        )}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay bg="rgba(0,0,0,0.7)" />
        <ModalContent
          borderBottom="16px solid"
          borderColor={primaryColor}
          borderRadius="15px"
          overflow="hidden"
        >
          <ModalHeader
            bg="#F6FBFC"
            boxShadow="xl"
            color={primaryColor}
            fontWeight="bold"
          >
            Create a Tour
          </ModalHeader>
          <ModalCloseButton color={primaryColor} size="lg" />
          <ModalBody>
            <VStack
              spacing={inputGap}
              align="stretch"
              py={vStackPaddingY}
              px={vStackPaddingX}
            >
              <FormField
                label="Tour name"
                name="name"
                type="text"
                value={myTourInfo.name}
                onChange={handleInputChange}
                isRequired={true}
              />

              <Flex direction={formControlLayout} gap={inputGap}>
                <FormField
                  label="Country"
                  name="country"
                  type="text"
                  value={myTourInfo.country}
                  onChange={handleInputChange}
                  isRequired={true}
                />
                <FormField
                  label="City"
                  name="city"
                  type="text"
                  value={myTourInfo.city}
                  onChange={handleInputChange}
                  isRequired={true}
                />
              </Flex>

              <Flex direction={formControlLayout} gap={inputGap}>
                <FormField
                  label="Max People"
                  name="maxPeople"
                  type="select"
                  value={myTourInfo.maxPeople}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Select maxPeople' },
                    ...Array.from({ length: 10 }, (_, i) => ({
                      value: String(i + 1),
                      label: `${i + 1} ${i + 1 === 1 ? 'Person' : 'People'}`,
                    })),
                  ]}
                  // disabled={!isEditMode}
                />
                <FormField
                  label="Type of Availability"
                  name="typeOfAvailability"
                  type="select"
                  value={myTourInfo.typeOfAvailability}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Select availability type' },
                    { value: 'recurring', label: 'Recurring' },
                    { value: 'one-time', label: 'One-time' },
                  ]}
                />
              </Flex>
              {myTourInfo.typeOfAvailability === 'recurring' && (
                <Flex direction={formControlLayout} gap={inputGap}>
                  <FormField
                    label="Availability"
                    name="availability"
                    type="select"
                    value={myTourInfo.availability}
                    onChange={handleInputChange}
                    options={[
                      { value: 'weekdays', label: 'Weekdays' },
                      { value: 'weekends', label: 'Weekends' },
                      { value: 'daily', label: 'Daily' },
                    ]}
                  />
                </Flex>
              )}

              {myTourInfo.typeOfAvailability === 'one-time' && (
                <Flex direction={formControlLayout} gap={inputGap}>
                  <FormField
                    label="Date"
                    name="date"
                    type="date"
                    value={myTourInfo.date}
                    onChange={handleInputChange}
                  />
                </Flex>
              )}

              <Flex direction={formControlLayout} gap={inputGap}>
                <FormField
                  label="From"
                  name="from"
                  type="time"
                  value={myTourInfo.from}
                  onChange={handleInputChange}
                  // disabled={!isEditMode}
                />
                <FormField
                  label="To"
                  name="to"
                  type="time"
                  value={myTourInfo.to}
                  onChange={handleInputChange}
                  // disabled={!isEditMode}
                />
              </Flex>

              <FormField
                label="Description"
                name="description"
                type="textarea"
                value={myTourInfo.description}
                onChange={handleInputChange}
              />

              <FormField
                label="Upload Photos"
                name="photos"
                type="file"
                onChange={handleInputChange}
                selectedFiles={selectedFiles}
                multiple
                onRemoveFile={handleRemoveFile}
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default MyTours
