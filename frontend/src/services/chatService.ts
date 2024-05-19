import axios from 'axios'

const BASE_API_URL = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true

const searchUsers = async (query: string) => {
  try {
    return await axios.get(`${BASE_API_URL}/api/users?search=${query}`)
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error searching users')
  }
}

const createGroupChat = async (name: string, users: string[]) => {
  try {
    return await axios.post(`${BASE_API_URL}/api/chats/group`, {
      name,
      users: JSON.stringify(users),
    })
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Error creating group chat',
    )
  }
}

const accessChat = async (userId: string) => {
  try {
    return await axios.post(`${BASE_API_URL}/api/chats`, { userId })
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error accessing chat')
  }
}

const fetchChats = async () => {
  try {
    return await axios.get(`${BASE_API_URL}/api/chats`)
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error fetching chats')
  }
}

const fetchMessages = async (chatId: string) => {
  try {
    return await axios.get(`${BASE_API_URL}/api/messages/${chatId}`)
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error fetching messages')
  }
}

const sendMessage = async (content: string, chatId: string) => {
  try {
    return await axios.post(`${BASE_API_URL}/api/messages`, { content, chatId })
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error sending message')
  }
}

const renameGroupChat = async (chatId: string, chatName: string) => {
  try {
    return await axios.put(`${BASE_API_URL}/api/chats/group/rename`, {
      chatId,
      chatName,
    })
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Error renaming group chat',
    )
  }
}

const addUserToGroup = async (chatId: string, userId: string) => {
  try {
    return await axios.put(`${BASE_API_URL}/api/chats/group/addUser`, {
      chatId,
      userId,
    })
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Error adding user to group',
    )
  }
}

const removeUserFromGroup = async (chatId: string, userId: string) => {
  try {
    return await axios.put(`${BASE_API_URL}/api/chats/group/removeUser`, {
      chatId,
      userId,
    })
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Error removing user from group',
    )
  }
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
