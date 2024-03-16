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
  useBreakpointValue,
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

function Profile() {
  const { state } = useAuthContext();
  const { user } = state;
  const toast = useToast();
  const inputFileRef = useRef(null);
  const { photo, setPhoto, removePhoto } = useUserProfilePhoto();
  const { updateProfile, isLoading } = useProfileUpdate(user, toast);

  const primaryColor = "#0B6B78";
  const secondaryColor = "#69490B";
  const whiteColor = "#fff";

  // Responsive adjustments
  const formFontSize = useBreakpointValue({
    base: "sm",
    md: "md",
    xxl: "lg",
  });
  const formPaddingX = useBreakpointValue({ base: 4, md: 6 });
  const formInputHeight = useBreakpointValue({
    base: "2.5rem",
    xl: "3rem",
  });
  const bioTextareaHeight = useBreakpointValue({ base: "120px", lg: "150px" });
  const formControlLayout = useBreakpointValue({ base: "column", xl: "row" });
  const headingFontSize = useBreakpointValue({
    base: "lg",
    xl: "xl",
    xxl: "2xl",
  });

  const vStackPaddingX = useBreakpointValue({ base: 4, md: 6, lg: 8 });
  const vStackPaddingY = useBreakpointValue({ base: 3, md: 4, lg: 4 });
  const inputGap = useBreakpointValue({ base: 6, lg: 8, xxl: 12 });

  const formLabelStyle = {
    color: "#000",
    fontWeight: "bold",
    fontSize: formFontSize,
  };

  const formInputStyle = {
    boxShadow: "inset 0 0 2px 2px rgba(0, 0, 0, 0.2)",
    borderRadius: "0.9375rem",
    height: formInputHeight,
    variant: "unstyled",
    px: formPaddingX,
    _focus: {
      borderBottom: "0.25rem solid #0B6B78",
    },
    fontSize: formFontSize,
  };

  const formSelectStyle = {
    boxShadow: "inset 0 0 2px 2px rgba(0, 0, 0, 0.2)",
    borderRadius: "0.9375rem",
    height: formInputHeight,
    variant: "unstyled",
    _focus: {
      borderBottom: "0.25rem solid #0B6B78",
    },
    fontSize: formFontSize,
  };

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

  const bgImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${HeaderBgImage})`;
  const iconSize = useBreakpointValue({
    base: "100px",
    md: "150px",
    lg: "180px",
  });
  const profileInfoFontSize = useBreakpointValue({
    base: "md",
    md: "lg",
    lg: "xl",
  });
  const profileContainerWidth = useBreakpointValue({
    base: "90%",
    md: "80%",
    lg: "85%",
    xl: "70%",
  });
  const profileContainerPadding = useBreakpointValue({
    base: 3,
    sm: 3.5,
    md: 4,
    lg: 4,
  });
  const profileContainerHeight = useBreakpointValue({
    base: "auto",
  });

  const buttonSize = useBreakpointValue({ base: "xs", sm: "sm", md: "md" });

  const iconButtonSize = useBreakpointValue({
    base: "sm", // Adjusted for smaller screens
    md: "md", // Adjust size as needed
  });

  // Further responsive design adjustments
  const profilePaddingY = useBreakpointValue({ base: 2, md: 4 });
  const profileMarginBottom = useBreakpointValue({ base: 4, md: 6 });
  const profileWidth = useBreakpointValue({
    base: "90%",
    md: "85%",
    lg: "80%",
    xl: "70%",
  });

  return (
    <Flex direction={{ base: "column", lg: "row" }} minHeight="100vh">
      <Sidebar user={user} />
      <Flex direction="column" flex="1" overflowY="auto">
        <Navbar />
        <Box
          bgImage={bgImage}
          bgSize="cover"
          minHeight={{ base: "14rem", md: "15rem", lg: "16rem", xl: "18rem" }}
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
            borderRadius="full"
            bg={whiteColor}
            p={profileContainerPadding}
            boxShadow="xl"
            width={profileContainerWidth}
            height={profileContainerHeight}
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
                  boxSize={iconSize}
                  src={userInfo.photo}
                  alt="Profile photo"
                />
              ) : (
                <Icon
                  as={BsPersonCircle}
                  boxSize={iconSize}
                  color="rgba(0, 0, 0, 0.3)"
                />
              )}
              <IconButton
                bg="#FF0B0B"
                aria-label="Remove photo"
                icon={<BsTrashFill color="#fff" />}
                position="absolute"
                top={{ base: -2, sm: -3, md: -3.5, lg: -3 }}
                right={{ base: -2, sm: -3, md: -3.5, lg: -3 }}
                onClick={handleRemovePhoto}
                size={buttonSize}
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
                bottom={{ base: -2, sm: -3, md: -3.5, lg: -3 }}
                right={{ base: -2, sm: -3, md: -3.5, lg: -3 }}
                onClick={handleButtonClick}
                size={buttonSize}
                isRound
                _hover={{ bg: primaryColor }}
              />
            </Box>

            <Flex
              flexDirection="column"
              alignItems="flex-start"
              ml={{ md: 6 }}
              mr={{ base: 3, sm: 0 }}
            >
              <Text
                color={primaryColor}
                fontWeight="bold"
                fontSize={profileInfoFontSize}
                mb={{ base: 1, md: 2 }}
              >
                Javlonbek Kosimov
              </Text>
              <Badge
                bgColor="#0B6B781A"
                color="#0B6B78B3"
                p={{ base: 1.5, md: 2 }}
                borderRadius="xl"
                display="flex"
                alignItems="center"
                fontWeight="medium"
                mb={2}
              >
                <ReactCountryFlag
                  countryCode="HU"
                  svg
                  style={{ width: "1.5em", height: "1.5em" }}
                />
                <Text textTransform="capitalize" ml={2}>
                  Hungary, Budapest
                </Text>
              </Badge>
              <Text color={secondaryColor} fontSize="sm" fontWeight="semibold">
                24 y.o.
              </Text>
            </Flex>
            <Box display={{ base: "none", md: "block" }} bg="#0000001A">
              <Divider orientation="vertical" />
            </Box>
            <Flex
              display={{ base: "none", sm: "flex" }}
              flexDirection="column"
              alignItems={{ sm: "flex-start" }}
              color={secondaryColor}
              fontSize="sm"
              mr={{ sm: 3 }}
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
                  <Icon as={BsStarFill} color="#DFB300" boxSize={4} mr={1} />
                  <Icon as={BsStarFill} color="#DFB300" boxSize={4} mr={1} />
                  <Icon as={BsStarFill} color="#DFB300" boxSize={4} mr={1} />
                  <Icon as={BsStarHalf} color="#DFB300" boxSize={4} mr={1} />
                  <Icon as={BsStar} color="#DFB300" boxSize={4} />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Box>
        <Box
          as="form"
          onSubmit={handleSubmit}
          maxWidth="100%"
          mx="auto"
          boxShadow="xl"
          mt={{
            base: "6rem",
            md: "8rem",
            lg: "9rem",
          }}
          mb="3.125rem"
          w={{ base: "95%", lg: "85%" }}
          borderRadius="2rem"
          borderTopLeftRadius="2rem"
          borderTopRightRadius="2rem"
          borderBottomLeftRadius="1rem"
          borderBottomRightRadius="1rem"
          overflow="hidden"
          borderBottom="1rem solid #0B6B78"
          pb="3rem"
        >
          {/* <Box
          as="form"
          onSubmit={handleSubmit}
          mx="auto"
          p={8}
          shadow="base"
          borderWidth="1px"
          maxWidth="100%"
          borderRadius="lg"
          w={{ base: "full"}}
        > */}
          <Heading
            as="h3"
            fontSize={headingFontSize}
            mb={6}
            bg="#ececec"
            py={vStackPaddingY}
            px={vStackPaddingX}
            boxShadow="lg"
          >
            Personal Information
          </Heading>
          <VStack
            spacing={inputGap}
            align="stretch"
            py={vStackPaddingY}
            px={vStackPaddingX}
          >
            <Flex direction={formControlLayout} gap={inputGap}>
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
            <Flex direction={formControlLayout} gap={inputGap}>
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
            <Flex direction={formControlLayout} gap={inputGap}>
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
            <Flex direction={formControlLayout} gap={inputGap}>
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
            <FormControl id="languages-spoken" isRequired>
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
            <FormControl id="interests" isRequired>
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
                height={bioTextareaHeight}
              />
            </FormControl>
          </VStack>

          <Heading
            as="h3"
            fontSize={headingFontSize}
            mt={6}
            mb={6}
            bg="#ececec"
            py={vStackPaddingY}
            px={vStackPaddingX}
            boxShadow="lg"
          >
            Password
          </Heading>
          <VStack
            align="stretch"
            spacing={inputGap}
            py={vStackPaddingY}
            px={vStackPaddingX}
          >
            <FormControl id="current-password">
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

          <Flex
            justifyContent="flex-end"
            gap={5}
            mt={6}
            px={vStackPaddingX}
          >
            <Button>Edit</Button>
            <Button type="submit">Save</Button>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

export default Profile;
