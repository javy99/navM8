import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Image,
  Input,
  VStack,
  useToast,
  IconButton,
  useColorModeValue,
  Text,
  Badge,
  Divider,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuthContext } from "../hooks/useAuthContext";
import HeaderBgImage from "../assets/profile-bg.jpg";
import {
  BsPersonCircle,
  BsStarFill,
  BsStar,
  BsStarHalf,
  BsTrashFill,
  BsCameraFill,
} from "react-icons/bs";
import ReactCountryFlag from "react-country-flag";
import { useUserProfilePhoto } from "../hooks/useUserProfilePhoto";

function Profile() {
  const { state } = useAuthContext();
  const { user } = state;
  const toast = useToast();
  const inputFileRef = useRef(null);
  const { photo, setPhoto, removePhoto } = useUserProfilePhoto();

  const primaryColor = useColorModeValue("#0B6B78", "#D1F366");
  const secondaryColor = useColorModeValue("#69490B", "#000");

  const [userInfo, setUserInfo] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    country: user?.country || "",
    city: user?.city || "",
    languages: user?.languages || "",
    interests: user?.interests || "",
    photo: photo,
    gender: user?.gender || "",
    bio: user?.bio || "",
    contact: user?.contact || "",
  });

  useEffect(() => {
    setUserInfo((userInfo) => ({ ...userInfo, photo: photo }));
  }, [photo]);

  const handleUserInfoChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    toast({
      title: "Profile updated successfully.",
      description: "Your changes have been saved.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        toast({
          title: "Photo added successfully.",
          description: "Your new profile photo has been updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "No photo selected.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
    event.target.value = null;
  };

  const handleButtonClick = () => inputFileRef.current.click();

  const handleRemovePhoto = () => {
    if (userInfo.photo) {
      removePhoto();
      toast({
        title: "Photo removed.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "No photo to remove.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minHeight="100vh" direction={{ base: "column", md: "row" }}>
      <Sidebar user={user} />
      <Flex direction="column" flex="1" overflowY="auto">
        <Navbar />
        <Box
          bgImage={`linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${HeaderBgImage})`}
          bgSize="cover"
          minHeight="280px"
          bgPosition="center"
          position="relative"
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            position="absolute"
            left="50%"
            bottom="0"
            transform="translate(-50%, 50%)"
            borderRadius="130px"
            bg={useColorModeValue("white", "gray.800")}
            p={6}
            boxShadow="xl"
            w="55%"
            height="85%"
          >
            <Box
              boxShadow="xl"
              textAlign="center"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="130px"
              position="relative"
            >
              {userInfo.photo ? (
                <Image
                  borderRadius="full"
                  boxSize="200px"
                  src={userInfo.photo}
                  alt="Profile photo"
                />
              ) : (
                <Icon
                  as={BsPersonCircle}
                  boxSize={200}
                  color="rgba(0, 0, 0, 0.3)"
                />
              )}
              <IconButton
                bg="#FF0B0B"
                aria-label="Remove photo"
                icon={<BsTrashFill color="#fff" />}
                position="absolute"
                top={-2}
                right={-2}
                onClick={handleRemovePhoto}
                size="md"
                isRound
                _hover={{ bg: "#FF0B0B" }}
              />

              <Input
                ref={inputFileRef}
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              <IconButton
                bg={primaryColor}
                aria-label="Add photo"
                icon={<BsCameraFill color="#fff" />}
                position="absolute"
                bottom={-2}
                right={-2}
                onClick={handleButtonClick}
                size="md"
                isRound
                _hover={{ bg: primaryColor }}
              />
            </Box>

            <Flex flexDirection="column" alignItems="flex-start">
              <Text
                color={primaryColor}
                fontWeight="bold"
                fontSize="28px"
                mb={2}
              >
                Javlonbek Kosimov
              </Text>
              <Badge
                bgColor="#0B6B781A"
                color="#0B6B78B3"
                p={2}
                borderRadius="xl"
                display="flex"
                alignItems="center"
                fontWeight="medium"
                mb={2}
              >
                <ReactCountryFlag
                  countryCode="HU"
                  svg
                  style={{
                    fontSize: "18px",
                    lineHeight: "18px",
                  }}
                />
                <Text textTransform="capitalize" ml={2}>
                  Hungary, Budapest
                </Text>
              </Badge>
              <Text color={secondaryColor} fontSize="md" fontWeight="semibold">
                24 y.o.{" "}
              </Text>
            </Flex>
            <Box height="inherit" bg="#0000001A">
              <Divider orientation="vertical" />
            </Box>
            <Flex
              flexDirection="column"
              alignItems="flex-start"
              color={secondaryColor}
            >
              <Text mb={2}>
                <b>Tours Taken:</b> 5
              </Text>
              <Text mb={2}>
                <b>Tours Offered:</b> 1
              </Text>
              <Flex>
                <Text fontWeight="bold" mr={2}>
                  Review:
                </Text>
                <Flex>
                  <Icon as={BsStarFill} color="#DFB300" boxSize={5} mr={1} />
                  <Icon as={BsStarFill} color="#DFB300" boxSize={5} mr={1} />
                  <Icon as={BsStarFill} color="#DFB300" boxSize={5} mr={1} />
                  <Icon as={BsStarHalf} color="#DFB300" boxSize={5} mr={1} />
                  <Icon as={BsStar} color="#DFB300" boxSize={5} />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Box>

        <VStack
          as="form"
          spacing={4}
          onSubmit={handleSubmit}
          w="full"
          maxW="lg"
          m="0 auto"
          pt={200}
        >
          <FormControl id="firstName" isRequired>
            <FormLabel>First Name</FormLabel>
            <Input
              name="name"
              type="text"
              onChange={handleUserInfoChange}
              value={userInfo.name}
            />
          </FormControl>
          {/* Repeat FormControl for each field (Surname, Country, City, etc.) */}
          <Button type="submit" colorScheme="blue">
            Save
          </Button>
        </VStack>
      </Flex>
    </Flex>
  );
}

export default Profile;
