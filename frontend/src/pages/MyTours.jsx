import React from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Image,
  Input,
  VStack,
  useToast,
  IconButton,
  Checkbox,
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
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuthContext } from "../hooks/useAuthContext";
import TourCard from "../components/TourCard";
import img from "../assets/hero-bg3.jpg";
import Button from "../components/Button";
import { BsGeoAltFill, BsCalendar2 } from "react-icons/bs";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";

function MyTours() {
  const { state } = useAuthContext();
  const { user } = state;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const primaryColor = "#0B6B78";
  const secondaryColor = "#69490B";

  return (
    <Flex minHeight="100vh" direction={{ base: "column", md: "row" }}>
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

      {/* <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay bg="rgba(0,0,0,0.7)" />
        <ModalContent>
          <ModalHeader>Create a Tour</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Tour name</FormLabel>
              <Input placeholder="Tour name" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Upload Photos</FormLabel>
              <Input type="file" multiple />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}

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
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={BsGeoAltFill} />}
                />
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
  );
}

export default MyTours;
