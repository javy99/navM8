import React from 'react'
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
  useTheme,
  useBreakpointValue,
  ResponsiveValue,
  Spinner,
  useToast,
  Grid,
} from '@chakra-ui/react'
import { MyTourCard, Button, FormField, PageLayout } from '../components'
import { useAuthContext, useMyTours } from '../hooks'
import { approveBooking } from '../services'

const MyTours: React.FC = () => {
  const toast = useToast()
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const { state } = useAuthContext()
  const { user } = state
  const {
    isLoading,
    tours,
    myTourInfo,
    selectedFiles,
    handleInputChange,
    handleRemoveFile,
    handleSubmit,
    handleEditTour,
    handleDeleteTour,
    isOpen,
    onClose,
    handleAddTour,
    isEditMode,
  } = useMyTours()

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

  const onApproveBooking = async (bookingId) => {
    try {
      await approveBooking(bookingId)
      toast({
        title: 'Booking confirmed',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error confirming booking:', error)
    }
  }

  return (
    <PageLayout user={user}>
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
            w={20}
            h={20}
            alignSelf="center"
            margin="auto"
          />
        </Box>
      ) : (
        <VStack align="stretch" p={8} mt={{ base: 12, md: 0 }}>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Heading as="h3" fontSize="1.5rem" color={primaryColor}>
              Offered Tours
            </Heading>
            <Button onClick={handleAddTour}>Add Tour</Button>
          </Flex>
          <Grid
            templateColumns={{
              base: 'repeat(1, 100%)',
              '2xl': 'repeat(2, 50%)',
            }}
            gap={{ base: 4, md: 6, lg: 8 }}
            mx={{ base: 0, md: 2, lg: 4, xl: 6 }}
          >
            {tours.map((tour) => (
              <MyTourCard
                width={{ base: '100%', '2xl': '100%' }}
                tour={tour}
                key={tour._id}
                onApproveBooking={onApproveBooking}
                onEdit={() => handleEditTour(tour._id)}
                onDelete={() => handleDeleteTour(tour._id)}
              />
            ))}
          </Grid>
        </VStack>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay bg="rgba(0,0,0,0.5)" />
        <ModalContent
          maxW={{
            base: '90%',
            md: '80%',
            lg: '70%',
            xl: '60%',
            '2xl': '50%',
          }}
          borderBottom="10px solid"
          borderColor={primaryColor}
          borderRadius="10px"
          overflow="hidden"
        >
          <ModalHeader
            bg="#F6FBFC"
            boxShadow="xl"
            color={primaryColor}
            fontWeight="bold"
          >
            {isEditMode ? 'Edit Tour' : 'Create a Tour'}
          </ModalHeader>
          <ModalCloseButton color={primaryColor} />
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
              />

              <Flex direction={formControlLayout} gap={inputGap}>
                <FormField
                  label="Country"
                  name="country"
                  type="text"
                  value={myTourInfo.country}
                  onChange={handleInputChange}
                />
                <FormField
                  label="City"
                  name="city"
                  type="text"
                  value={myTourInfo.city}
                  onChange={handleInputChange}
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
                />
                <FormField
                  label="To"
                  name="to"
                  type="time"
                  value={myTourInfo.to}
                  onChange={handleInputChange}
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
            <Button mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageLayout>
  )
}

export default MyTours
