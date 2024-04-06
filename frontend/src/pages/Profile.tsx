import React from 'react'
import {
  Box,
  Flex,
  Icon,
  Image,
  Input,
  VStack,
  IconButton,
  Text,
  Badge,
  Divider,
  Heading,
  useBreakpointValue,
  useTheme,
  ResponsiveValue,
  Spinner,
} from '@chakra-ui/react'
import {
  BsPersonCircle,
  BsStarFill,
  BsStar,
  BsStarHalf,
  BsTrashFill,
  BsCameraFill,
} from 'react-icons/bs'
import ReactCountryFlag from 'react-country-flag'
import { Button, FormField, PageLayout } from '../components'
import { useAuthContext, usePhotoManager, useProfile } from '../hooks'
import HeaderBgImage from '../assets/profile-bg.jpg'

type FlexDirection =
  | 'row'
  | 'column'
  | 'row-reverse'
  | 'column-reverse'
  | undefined

const Profile: React.FC = () => {
  const { state } = useAuthContext()
  const { user } = state
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary
  const whiteColor = theme.colors.white

  const {
    userInfo,
    isEditMode,
    handleUserInfoChange,
    handleEdit,
    handleCancel,
    handleSubmit,
    inputFileRef,
    handleButtonClick,
    countryCode,
    isLoading,
  } = useProfile()

  const { photo, handlePhotoChange, handlePhotoRemoval } = usePhotoManager()

  const bgImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${HeaderBgImage})`

  /* =================== Responsive adjustments =================== */
  const iconSize = useBreakpointValue({
    base: '100px',
    md: '150px',
    lg: '180px',
  })
  const profileInfoFontSize = useBreakpointValue({
    base: 'md',
    md: 'lg',
    lg: 'xl',
  })
  const profileContainerWidth = useBreakpointValue({
    base: '90%',
    md: '80%',
    lg: '85%',
    xl: '70%',
  })
  const profileContainerPadding = useBreakpointValue({
    base: 3,
    sm: 3.5,
    md: 4,
    lg: 4,
  })
  const profileContainerHeight = useBreakpointValue({
    base: 'auto',
  })
  const buttonSize = useBreakpointValue({ base: 'xs', sm: 'sm', md: 'md' })

  const formControlLayout: ResponsiveValue<FlexDirection> = useBreakpointValue({
    base: 'column',
    xl: 'row',
  })
  const headingFontSize = useBreakpointValue({
    base: 'lg',
    xl: 'xl',
    xxl: '2xl',
  })
  const vStackPaddingX = useBreakpointValue({ base: 4, md: 6, lg: 8 })
  const vStackPaddingY = useBreakpointValue({ base: 3, md: 4, lg: 4 })
  const inputGap = useBreakpointValue({ base: 6, lg: 8, xxl: 12 })
  /* =================== Responsive adjustments =================== */

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
        <>
          <Box
            bgImage={bgImage}
            bgSize="cover"
            minHeight={{ base: '14rem', md: '15rem', lg: '16rem', xl: '18rem' }}
            bgPosition="center"
            position="relative"
            mt={{ base: 12, md: 0 }}
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
                {photo ? (
                  <Image
                    borderRadius="full"
                    boxSize={iconSize}
                    src={photo}
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
                  onClick={handlePhotoRemoval}
                  size={buttonSize}
                  isRound
                  _hover={{ bg: '#FF0B0B' }}
                />

                <Input
                  ref={inputFileRef}
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
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

              {userInfo.country && userInfo.city && userInfo.birthDate && (
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
                    {userInfo.firstName} {userInfo.lastName}
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
                    {countryCode && (
                      <ReactCountryFlag
                        countryCode={countryCode}
                        svg
                        style={{ width: '1.5em', height: '1.5em' }}
                      />
                    )}
                    <Text textTransform="capitalize" ml={2}>
                      {userInfo.country && userInfo.country.length > 10
                        ? countryCode
                        : userInfo.country}
                      , {userInfo.city}
                    </Text>
                  </Badge>
                  <Text
                    color={secondaryColor}
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    {new Date().getFullYear() -
                      new Date(userInfo.birthDate).getFullYear() -
                      (new Date().getMonth() <
                        new Date(userInfo.birthDate).getMonth() ||
                      (new Date().getMonth() ===
                        new Date(userInfo.birthDate).getMonth() &&
                        new Date().getDate() <
                          new Date(userInfo.birthDate).getDate())
                        ? 1
                        : 0)}{' '}
                    y.o.
                  </Text>
                </Flex>
              )}
              <Box display={{ base: 'none', md: 'block' }} bg="#0000001A">
                <Divider orientation="vertical" />
              </Box>
              <Flex
                display={{ base: 'none', sm: 'flex' }}
                flexDirection="column"
                alignItems={{ sm: 'flex-start' }}
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
              base: '6rem',
              md: '8rem',
              lg: '9rem',
            }}
            mb="3.125rem"
            w={{ base: '95%', lg: '85%' }}
            borderRadius="2rem"
            borderTopLeftRadius="2rem"
            borderTopRightRadius="2rem"
            borderBottomLeftRadius="1rem"
            borderBottomRightRadius="1rem"
            overflow="hidden"
            borderBottom="1rem solid #0B6B78"
            pb="3rem"
          >
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
                <FormField
                  label="First name"
                  name="firstName"
                  type="text"
                  value={userInfo.firstName}
                  onChange={handleUserInfoChange}
                  disabled={!isEditMode}
                />

                <FormField
                  label="Last name"
                  name="lastName"
                  type="text"
                  value={userInfo.lastName}
                  onChange={handleUserInfoChange}
                  disabled={!isEditMode}
                />
              </Flex>
              <Flex direction={formControlLayout} gap={inputGap}>
                <FormField
                  label="Phone number"
                  name="phoneNumber"
                  type="number"
                  value={userInfo.phoneNumber}
                  onChange={handleUserInfoChange}
                  disabled={!isEditMode}
                />
                <FormField
                  label="Email address"
                  name="email"
                  type="email"
                  value={userInfo.email}
                  onChange={handleUserInfoChange}
                  disabled={!isEditMode}
                />
              </Flex>
              <Flex direction={formControlLayout} gap={inputGap}>
                <FormField
                  label="Country"
                  name="country"
                  type="text"
                  value={userInfo.country}
                  onChange={handleUserInfoChange}
                  disabled={!isEditMode}
                />
                <FormField
                  label="City"
                  name="city"
                  type="text"
                  value={userInfo.city}
                  onChange={handleUserInfoChange}
                  disabled={!isEditMode}
                />
              </Flex>
              <Flex direction={formControlLayout} gap={inputGap}>
                <FormField
                  label="Birth Date"
                  name="birthDate"
                  type="date"
                  value={userInfo.birthDate}
                  onChange={handleUserInfoChange}
                  disabled={!isEditMode}
                />
                <FormField
                  label="Gender"
                  name="gender"
                  type="select"
                  value={userInfo.gender}
                  onChange={handleUserInfoChange}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                  ]}
                  disabled={!isEditMode}
                />
              </Flex>
              <FormField
                label="Languages Spoken"
                name="languagesSpoken"
                type="text"
                value={userInfo.languagesSpoken}
                onChange={handleUserInfoChange}
                disabled={!isEditMode}
              />

              <FormField
                label="Interests"
                name="interests"
                type="text"
                value={userInfo.interests}
                onChange={handleUserInfoChange}
                disabled={!isEditMode}
              />

              <FormField
                label="Bio"
                name="bio"
                type="textarea"
                value={userInfo.bio}
                onChange={handleUserInfoChange}
                disabled={!isEditMode}
              />
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
              <Flex direction={formControlLayout} gap={inputGap}>
                <FormField
                  label="Current Password"
                  name="currentPassword"
                  type="text"
                  value={userInfo.currentPassword}
                  onChange={handleUserInfoChange}
                  isRequired={false}
                  disabled={!isEditMode}
                />
                <FormField
                  label="New Password"
                  name="newPassword"
                  type="text"
                  value={userInfo.newPassword}
                  onChange={handleUserInfoChange}
                  isRequired={false}
                  disabled={!isEditMode}
                />
              </Flex>
            </VStack>

            <Flex justifyContent="flex-end" gap={5} mt={6} px={vStackPaddingX}>
              {isEditMode ? (
                <>
                  <Button type="button" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </>
              ) : (
                <Button type="button" onClick={handleEdit}>
                  Edit
                </Button>
              )}
            </Flex>
          </Box>
        </>
      )}
    </PageLayout>
  )
}

export default Profile
