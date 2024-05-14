import axios from 'axios'

const BASE_API_URL = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true

const searchUsers = async (query) => {
  return await axios.get(`${BASE_API_URL}/api/users?search=${query}`)
}

const createGroupChat = async (name, users) => {
  return await axios.post(`${BASE_API_URL}/api/chats/group`, {
    name,
    users: JSON.stringify(users),
  })
}

const accessChat = async (userId) => {
  return await axios.post(`${BASE_API_URL}/api/chats`, { userId })
}

const fetchChats = async () => {
  return await axios.get(`${BASE_API_URL}/api/chats`)
}

const fetchMessages = async (chatId: string) => {
  return await axios.get(`${BASE_API_URL}/api/messages/${chatId}`)
}

const sendMessage = async (content: string, chatId: string) => {
  return await axios.post(`${BASE_API_URL}/api/messages`, { content, chatId })
}

const renameGroupChat = async (chatId: string, chatName: string) => {
  return await axios.put(`${BASE_API_URL}/api/chats/group/rename`, {
    chatId,
    chatName,
  })
}

const addUserToGroup = async (chatId: string, userId: string) => {
  return await axios.put(`${BASE_API_URL}/api/chats/group/addUser`, {
    chatId,
    userId,
  })
}

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
