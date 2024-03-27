import { BsEyeFill } from 'react-icons/bs'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Avatar,
} from '@chakra-ui/react'
import { User } from '../types'

interface Props {
  user: User
  children?: any
}

const ProfileModal: React.FC<Props> = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

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
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader fontSize="20px" display="flex" justifyContent="center">
            {user.firstName} {user.lastName}
          </ModalHeader>
          <ModalCloseButton />
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
            <Text fontSize={{ base: '20px', md: '25px' }}>
              Email: {user.email}
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
