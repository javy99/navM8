import axios from 'axios'

const BASE_API_URL = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'

const searchUsers = async (query) =>
  axios.get(`${BASE_API_URL}/api/users?search=${query}`)

const createGroupChat = async (name, users) =>
  axios.post(`${BASE_API_URL}/api/chats/group`, {
    name,
    users: JSON.stringify(users),
  })

const accessChat = async (userId) =>
  axios.post(`${BASE_API_URL}/api/chats`, { userId })

const fetchChats = async () => axios.get(`${BASE_API_URL}/api/chats`)

const fetchMessages = async (chatId: string) =>
  axios.get(`${BASE_API_URL}/api/messages/${chatId}`)

const sendMessage = async (content: string, chatId: string) =>
  axios.post(`${BASE_API_URL}/api/messages`, { content, chatId })

const renameGroupChat = async (chatId: string, chatName: string) =>
  axios.put(`${BASE_API_URL}/api/chats/group/rename`, {
    chatId,
    chatName,
  })

const addUserToGroup = async (chatId: string, userId: string) =>
  axios.put(`${BASE_API_URL}/api/chats/group/addUser`, {
    chatId,
    userId,
  })

const removeUserFromGroup = async (chatId: string, userId: string) =>
  axios.put(`${BASE_API_URL}/api/chats/group/removeUser`, {
    chatId,
    userId,
  })

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
