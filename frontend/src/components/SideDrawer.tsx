// import {
//   Box,
//   Button,
//   Tooltip,
//   useTheme,
//   Drawer,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerHeader,
//   useDisclosure,
//   DrawerBody,
//   Input,
//   useToast,
//   Text,
//   Spinner,
//   Heading,
// } from '@chakra-ui/react'
// import React, { useState } from 'react'
// import { useAuthContext } from '../hooks'
// import axios from 'axios'
// import ChatLoading from './ChatLoading'
// import UserListItem from './UserListItem'
// import { User } from '../types'

// const SideDrawer = () => {
//   const [search, setSearch] = useState('')
//   const [searchResult, setSearchResult] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [loadingChat, setLoadingChat] = useState(false)

//   const { state, setSelectedChat, chats, setChats } = useAuthContext()
//   const { user } = state

//   const { isOpen, onOpen, onClose } = useDisclosure()

//   const toast = useToast()

//   const theme = useTheme()
//   const primaryColor = theme.colors.primary
//   const secondaryColor = theme.colors.secondary

//   const handleSearch = async () => {
//     if (!search) {
//       toast({
//         title: 'Please enter something in search',
//         status: 'warning',
//         duration: 5000,
//         isClosable: true,
//         position: 'top-left',
//       })
//       return
//     }

//     if (!user || !user.token) {
//       toast({
//         title: 'Authentication error',
//         description: 'You must be logged in to search for users.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//         position: 'top-left',
//       })
//       return
//     }

//     try {
//       setLoading(true)

//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       }

//       const { data } = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/users?search=${search}`,
//         config,
//       )

//       setLoading(false)
//       setSearchResult(data)
//     } catch (error) {
//       toast({
//         title: 'Error Occured!',
//         description: 'Failed to Load the Search Results',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//         position: 'bottom-left',
//       })
//     }
//   }

//   const accessChat = async (userId: string) => {
//     if (!user || !user.token) {
//       toast({
//         title: 'Authentication error',
//         description: 'You must be logged in to access chats.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//         position: 'bottom-left',
//       })
//       return
//     }

//     try {
//       setLoadingChat(true)

//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${user.token}`,
//         },
//       }

//       const { data } = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/chat`,
//         { userId },
//         config,
//       )

//       if (!chats.find((chat) => chat._id === data._id)) {
//         setChats([...chats, data])
//       }

//       setSelectedChat(data)
//       setLoadingChat(false)
//       onClose()
//     } catch (error) {
//       if (error instanceof Error) {
//         toast({
//           title: 'Error fetching th chat!',
//           description: error.message,
//           status: 'error',
//           duration: 5000,
//           isClosable: true,
//           position: 'bottom-left',
//         })
//       }
//     }
//   }

//   return (
//     <>
//       <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
//         <DrawerOverlay />
//         <DrawerContent>
//           <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
//           <DrawerBody>
//             <Box display="flex" pb={2}>
//               <Input
//                 placeholder="Search by name or email"
//                 mr={2}
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//               <Button onClick={handleSearch}>Go</Button>
//             </Box>
//             {loading ? (
//               <ChatLoading />
//             ) : (
//               searchResult.map((user: User) => (
//                 <UserListItem
//                   key={user._id}
//                   user={user}
//                   handleFunction={() => user._id && accessChat(user._id)}
//                 />
//               ))
//             )}
//             {loadingChat && (
//               <Spinner
//                 ml="auto"
//                 display="flex"
//                 color={primaryColor}
//                 speed="1s"
//               />
//             )}
//           </DrawerBody>
//         </DrawerContent>
//       </Drawer>
//     </>
//   )
// }

// export default SideDrawer
