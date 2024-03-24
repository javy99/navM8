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
  useDisclosure,
  useTheme,
  useBreakpointValue,
  ResponsiveValue,
  Spinner,
} from '@chakra-ui/react'
import { TourCard, Button, FormField } from '../components'
import { useAuthContext, useMyTours } from '../hooks'
import PageLayout from './PageLayout'

const MyTours: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary
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
  } = useMyTours(onClose)

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
    <PageLayout user={user}>
      {isLoading ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <Spinner size="xl" color={primaryColor} thickness="5px" speed="1s" />
        </Box>
      ) : (
        <VStack align="stretch" p={8} mt={{ base: 12, md: 0 }}>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Heading as="h3" fontSize="1.5rem" color={primaryColor}>
              Offered Tours
            </Heading>
            <Button onClick={onOpen}>Add Tour</Button>
          </Flex>
          <Flex
            wrap={'wrap'}
            gap={{ base: 4, md: 6, lg: 8 }}
            mx={{ base: 0, md: 2, lg: 4, xl: 10 }}
          >
            {tours.map((tour) => (
              <TourCard
                width={{ base: '100%', '2xl': '48%' }}
                tour={tour}
                key={tour._id}
              />
            ))}
          </Flex>
          <Box width="100%" borderTop={`2px dashed ${secondaryColor}`} my={6} />
          <Heading as="h3" fontSize="1.5rem" color={primaryColor}>
            Upcoming Tours
          </Heading>
          <Flex>
            {/* <TourCard width="45%" />
            <TourCard width="45%" /> */}
          </Flex>
          <Box width="100%" borderTop={`2px dashed ${secondaryColor}`} my={6} />
          <Heading as="h3" fontSize="1.5rem" color={primaryColor}>
            Past Tours
          </Heading>
          <Flex>
            {/* <TourCard width="45%" />
            <TourCard width="45%" /> */}
          </Flex>
        </VStack>
      )}

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
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
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
