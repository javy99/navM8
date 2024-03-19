import React from 'react'
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
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
  Textarea,
  Select,
  InputGroup,
  InputLeftElement,
  useTheme,
} from '@chakra-ui/react'
import { BsGeoAltFill } from 'react-icons/bs'
import { Navbar, Sidebar, TourCard, Button } from '../components'
import { useAuthContext } from '../hooks'

const MyTours: React.FC = () => {
  const { state } = useAuthContext()
  const { user } = state
  const { isOpen, onOpen, onClose } = useDisclosure()
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary

  return (
    <Flex minHeight="100vh" direction={{ base: 'column', md: 'row' }}>
      <Sidebar user={user} />
      <Flex direction="column" flex="1" overflowY="auto">
        <Navbar />
        <VStack align="stretch" p={8}>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Heading as="h3" fontSize="1.5rem" color={primaryColor}>
              Offered Tours
            </Heading>
            <Button onClick={onOpen}>Add Tour</Button>
          </Flex>
          <Flex gap="5%">
            <TourCard width="45%" />
            <TourCard width="45%" />
          </Flex>
          <Box width="100%" borderTop={`2px dashed ${secondaryColor}`} my={6} />
          <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
            Upcoming Tours
          </Heading>
          <Flex gap="5%">
            <TourCard width="45%" />
            <TourCard width="45%" />
          </Flex>
          <Box width="100%" borderTop={`2px dashed ${secondaryColor}`} my={6} />
          <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
            Past Tours
          </Heading>
          <Flex gap="5%">
            <TourCard width="45%" />
            <TourCard width="45%" />
          </Flex>
        </VStack>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay bg="rgba(0,0,0,0.7)" />
        <ModalContent
          borderBottom="16px solid"
          borderColor={primaryColor}
          borderRadius="15px"
          overflow="hidden"
        >
          <ModalHeader bg="#F6FBFC" boxShadow="xl" color={primaryColor}>
            Create a Tour
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Tour name</FormLabel>
              <Input placeholder="Enter tour name" />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Destination / City</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={BsGeoAltFill} />
                </InputLeftElement>
                <Input placeholder="Enter destination" />
              </InputGroup>
            </FormControl>

            <Flex mt={4}>
              <FormControl flex="1">
                <FormLabel>Max People</FormLabel>
                <Select placeholder="Select option">
                  {/* Add your options here */}
                </Select>
              </FormControl>

              <FormControl flex="1" ml={4}>
                <FormLabel>Availability</FormLabel>
                <Select placeholder="Select option">
                  {/* Add your options here */}
                </Select>
              </FormControl>
            </Flex>

            <Flex mt={4}>
              <FormControl flex="1">
                <FormLabel>From</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" />
                  <Input type="time" placeholder="HH:MM" />
                </InputGroup>
              </FormControl>

              <FormControl flex="1" ml={4}>
                <FormLabel>To</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" />
                  <Input type="time" placeholder="HH:MM" />
                </InputGroup>
              </FormControl>
            </Flex>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea placeholder="Enter description" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Upload Photos</FormLabel>
              <Input type="file" p={1} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
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
