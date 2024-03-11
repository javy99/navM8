import React, { useRef, useState, useEffect } from "react";
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
  useColorModeValue,
  Text,
  Badge,
  Divider,
  Heading,
  Select,
  Textarea,
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
import Button from "../components/Button";
import useProfileUpdate from "../hooks/useProfileUpdate";

const formLabelStyle = {
  fontSize: "1.25rem",
  color: "#000",
  fontWeight: "bold",
};

const formInputStyle = {
  boxShadow: "inset 0 0 2px 2px rgba(0, 0, 0, 0.2)",
  borderRadius: "0.9375rem",
  height: "4.375rem",
  fontSize: "1.25rem",
  variant: "unstyled",
  px: "1.5rem",
  _focus: {
    borderBottom: "0.25rem solid #0B6B78",
  },
};

const formSelectStyle = {
  boxShadow: "inset 0 0 2px 2px rgba(0, 0, 0, 0.2)",
  borderRadius: "0.9375rem",
  height: "4.375rem",
  fontSize: "1.25rem",
  variant: "unstyled",
  _focus: {
    borderBottom: "0.25rem solid #0B6B78",
  },
};

function Profile() {
  const { state } = useAuthContext();
  const { user } = state;
  const toast = useToast();
  const inputFileRef = useRef(null);
  const { photo, setPhoto, removePhoto } = useUserProfilePhoto();
  const { updateProfile, isLoading } = useProfileUpdate(user, toast);

  const primaryColor = useColorModeValue("#0B6B78", "#D1F366");
  const secondaryColor = useColorModeValue("#69490B", "#000");

  const [userInfo, setUserInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    country: user?.country || "",
    city: user?.city || "",
    languagesSpoken: user?.languagesSpoken || [],
    interests: user?.interests || [],
    photo: photo,
    gender: user?.gender || "",
    bio: user?.bio || "",
    phoneNumber: user?.phoneNumber || "",
    birthDate: user?.birthDate || "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    setUserInfo((userInfo) => ({ ...userInfo, photo: photo }));
  }, [photo]);

  const handleUserInfoChange = (event) => {
    const { name, value } = event.target;
    console.log(value);
    setUserInfo({ ...userInfo, [name]: value });
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

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    await updateProfile(userInfo);
  };

  return (
    <Flex minHeight="100vh" direction={{ base: "column", md: "row" }}>
      <Sidebar user={user} />
      <Flex direction="column" flex="1" overflowY="auto">
        <Navbar />
        <Box
          bgImage={`linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${HeaderBgImage})`}
          bgSize="cover"
          minHeight="17.5rem"
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
            borderRadius="8.125rem"
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
              borderRadius="8.125rem"
              position="relative"
            >
              {userInfo.photo ? (
                <Image
                  borderRadius="full"
                  boxSize="12.5rem"
                  src={userInfo.photo}
                  alt="Profile photo"
                />
              ) : (
                <Icon
                  as={BsPersonCircle}
                  boxSize="12.5rem"
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
                fontSize="1.75rem"
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
                    fontSize: "1.125rem",
                    lineHeight: "1.125rem",
                  }}
                />
                <Text textTransform="capitalize" ml={2}>
                  Hungary, Budapest
                </Text>
              </Badge>
              <Text
                color={secondaryColor}
                fontSize="1rem"
                fontWeight="semibold"
              >
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

        {/* <VStack
          as="form"
          spacing={4}
          onSubmit={handleSubmit}
          w="full"
          maxW="lg"
          m="0 auto"
          pt={200}
        >
        </VStack> */}
        <Box
          as="form"
          onSubmit={handleSubmit}
          maxWidth="100%"
          mx="auto"
          boxShadow="xl"
          mt="9.375rem"
          mb="3.125rem"
          width="85%"
          borderRadius="3rem"
          borderTopLeftRadius="3rem"
          borderTopRightRadius="3rem"
          borderBottomLeftRadius="1rem"
          borderBottomRightRadius="1rem"
          overflow="hidden"
          borderBottom="1rem solid #0B6B78"
          pb="3rem"
        >
          <Heading
            as="h3"
            fontSize="1.5rem"
            mb={6}
            bg="#ececec"
            py={6}
            px={12}
            boxShadow="lg"
          >
            Personal Information
          </Heading>
          <VStack spacing={4} align="stretch" py={6} px={12}>
            <Flex justifyContent="space-between" gap={12} mb={6}>
              <FormControl id="first-name" isRequired>
                <FormLabel htmlFor="firstName" {...formLabelStyle}>
                  First name
                </FormLabel>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={userInfo.firstName}
                  onChange={handleUserInfoChange}
                  {...formInputStyle}
                />
              </FormControl>
              <FormControl id="last-name" isRequired>
                <FormLabel htmlFor="lastName" {...formLabelStyle}>
                  Last name
                </FormLabel>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userInfo.lastName}
                  onChange={handleUserInfoChange}
                  {...formInputStyle}
                />
              </FormControl>
            </Flex>
            <Flex justifyContent="space-between" gap={12} mb={6}>
              <FormControl id="phone-number" isRequired>
                <FormLabel htmlFor="phoneNumber" {...formLabelStyle}>
                  Phone number
                </FormLabel>
                <Input
                  type="number"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={userInfo.phoneNumber}
                  onChange={handleUserInfoChange}
                  {...formInputStyle}
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel htmlFor="email" {...formLabelStyle}>
                  Email address
                </FormLabel>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleUserInfoChange}
                  {...formInputStyle}
                />
              </FormControl>
            </Flex>
            <Flex justifyContent="space-between" gap={12} mb={6}>
              <FormControl id="country" isRequired>
                <FormLabel htmlFor="country" {...formLabelStyle}>
                  Country
                </FormLabel>
                <Input
                  type="text"
                  id="country"
                  name="country"
                  value={userInfo.country}
                  onChange={handleUserInfoChange}
                  {...formInputStyle}
                />
              </FormControl>
              <FormControl id="city" isRequired>
                <FormLabel htmlFor="city" {...formLabelStyle}>
                  City
                </FormLabel>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  value={userInfo.city}
                  onChange={handleUserInfoChange}
                  {...formInputStyle}
                />
              </FormControl>
            </Flex>
            <Flex justifyContent="space-between" gap={12} mb={6}>
              <FormControl id="birth-date" isRequired>
                <FormLabel htmlFor="birthDate" {...formLabelStyle}>
                  Birth Date
                </FormLabel>
                <Input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={userInfo.birthDate}
                  onChange={handleUserInfoChange}
                  {...formInputStyle}
                />
              </FormControl>
              <FormControl id="gender" isRequired>
                <FormLabel {...formLabelStyle}>Gender</FormLabel>
                <Select
                  name="gender"
                  value={userInfo.gender}
                  onChange={handleUserInfoChange}
                  {...formSelectStyle}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
            </Flex>
            <FormControl id="languages-spoken" mb={6} isRequired>
              <FormLabel htmlFor="languagesSpoken" {...formLabelStyle}>
                Languages spoken
              </FormLabel>
              <Input
                type="text"
                id="languagesSpoken"
                name="languagesSpoken"
                value={userInfo.languagesSpoken}
                onChange={handleUserInfoChange}
                {...formInputStyle}
              />
            </FormControl>
            <FormControl id="interests" mb={6} isRequired>
              <FormLabel htmlFor="interests" {...formLabelStyle}>
                Interests
              </FormLabel>
              <Input
                type="text"
                id="interests"
                name="interests"
                value={userInfo.interests}
                onChange={handleUserInfoChange}
                {...formInputStyle}
              />
            </FormControl>
            <FormControl id="bio" isRequired>
              <FormLabel {...formLabelStyle}>Bio</FormLabel>
              <Textarea
                {...formInputStyle}
                name="bio"
                value={userInfo.bio}
                onChange={handleUserInfoChange}
              />
            </FormControl>
          </VStack>

          <Heading
            as="h3"
            size="lg"
            mt={10}
            mb={6}
            bg="#ececec"
            py={6}
            px={12}
            boxShadow="lg"
          >
            Password
          </Heading>
          <VStack spacing={4} align="stretch" py={6} px={12}>
            <FormControl id="current-password" mb={6}>
              <FormLabel {...formLabelStyle}>Current password</FormLabel>
              <Input
                type="password"
                name="currentPassword"
                value={userInfo.currentPassword || ""}
                onChange={handleUserInfoChange}
                {...formInputStyle}
              />
            </FormControl>
            <FormControl id="new-password">
              <FormLabel {...formLabelStyle}>New password</FormLabel>
              <Input
                type="password"
                name="newPassword"
                value={userInfo.newPassword || ""}
                onChange={handleUserInfoChange}
                {...formInputStyle}
                {...formInputStyle}
              />
            </FormControl>
          </VStack>

          <Flex justifyContent="flex-end" gap={5} mt={6} px={12}>
            <Button>Edit</Button>
            <Button type="submit">Save</Button>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

export default Profile;
