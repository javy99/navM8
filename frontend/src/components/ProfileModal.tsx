import { BsEyeFill } from 'react-icons/bs'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Avatar,
  useTheme,
} from '@chakra-ui/react'
import { User } from '../types'
import Button from './Button'

interface Props {
  user: User
  children?: any
}

const ProfileModal: React.FC<Props> = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const whiteColor = theme.colors.white

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: 'flex' }}
          icon={<BsEyeFill />}
          onClick={onOpen}
          aria-label="View User Profile"
          color={whiteColor}
          bgColor={primaryColor}
          _hover={{ bgColor: primaryColor }}
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered={true}>
        <ModalOverlay bg="rgba(0,0,0,0.5)" />
        <ModalContent
          h="400px"
          borderBottom="15px solid"
          borderColor={primaryColor}
          borderRadius="15px"
          overflow="hidden"
        >
          <ModalHeader
            fontSize="20px"
            display="flex"
            justifyContent="center"
            bg="#F6FBFC"
            boxShadow="xl"
            color={primaryColor}
            fontWeight="bold"
            mb={5}
          >
            {user.firstName} {user.lastName}
          </ModalHeader>
          <ModalCloseButton color={primaryColor} size="lg" />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            {user.profilePictureURL ? (
              <Image
                src={user.profilePictureURL}
                alt="Profile Picture"
                borderRadius="full"
                boxSize="150px"
              />
            ) : (
              <Avatar
                boxSize="150px"
                size="2xl"
                cursor="pointer"
                name={user.username}
              />
            )}
            <Text fontSize={{ base: '18px', md: '23px' }}>
              <span style={{ fontWeight: '600' }}>Email:</span> {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal
