import axios from 'axios'

const BASE_API_URL = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true

// Function to search users
const searchUsers = async (query) => {
  return await axios.get(`${BASE_API_URL}/api/users?search=${query}`)
}

// Function to create a group chat
const createGroupChat = async (name, users) => {
  return await axios.post(`${BASE_API_URL}/api/chats/group`, {
    name,
    users: JSON.stringify(users),
  })
}

// Function to access a specific chat
const accessChat = async (userId) => {
  return await axios.post(`${BASE_API_URL}/api/chats`, { userId })
}

// Function to fetch all chats for a user
const fetchChats = async () => {
  return await axios.get(`${BASE_API_URL}/api/chats`)
}

// Function to fetch messages of a chat
const fetchMessages = async (chatId: string) => {
  return await axios.get(`${BASE_API_URL}/api/messages/${chatId}`)
}

// Function to send a new message
const sendMessage = async (content: string, chatId: string) => {
  return await axios.post(`${BASE_API_URL}/api/messages`, { content, chatId })
}

// Function to rename a group chat
const renameGroupChat = async (chatId: string, chatName: string) => {
  return await axios.put(`${BASE_API_URL}/api/chats/group/rename`, {
    chatId,
    chatName,
  })
}

// Function to add a user to a group chat
const addUserToGroup = async (chatId: string, userId: string) => {
  return await axios.put(`${BASE_API_URL}/api/chats/group/addUser`, {
    chatId,
    userId,
  })
}

// Function to remove a user from a group chat
const removeUserFromGroup = async (chatId: string, userId: string) => {
  return await axios.put(`${BASE_API_URL}/api/chats/group/removeUser`, {
    chatId,
    userId,
  })
}

export {
  searchUsers,
  createGroupChat,
  accessChat,
  fetchChats,
  fetchMessages,
  sendMessage,
  renameGroupChat,
  addUserToGroup,
  removeUserFromGroup,
}
