import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/api`

// Function to search users
const searchUsers = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return await axios.get(`${API_URL}/users?search=${query}`, config)
}

// Function to create a group chat
const createGroupChat = async (name, users, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return await axios.post(
    `${API_URL}/chat/group`,
    {
      name,
      users: JSON.stringify(users),
    },
    config,
  )
}

// Function to access a specific chat
const accessChat = async (userId, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
  return await axios.post(`${API_URL}/chat`, { userId }, config)
}

// Function to fetch all chats for a user
const fetchChats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return await axios.get(`${API_URL}/chat`, config)
}

// Function to fetch messages of a chat
const fetchMessages = async (chatId: string, token: string) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
  return await axios.get(`${API_URL}/message/${chatId}`, config)
}

// Function to send a new message
const sendMessage = async (content: string, chatId: string, token: string) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
  return await axios.post(`${API_URL}/message`, { content, chatId }, config)
}

// Function to rename a group chat
const renameGroupChat = async (
  chatId: string,
  chatName: string,
  token: string,
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return await axios.put(
    `${API_URL}/chat/rename`,
    {
      chatId,
      chatName,
    },
    config,
  )
}

// Function to add a user to a group chat
const addUserToGroup = async (
  chatId: string,
  userId: string,
  token: string,
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return await axios.put(
    `${API_URL}/chat/groupadd`,
    {
      chatId,
      userId,
    },
    config,
  )
}

// Function to remove a user from a group chat
const removeUserFromGroup = async (
  chatId: string,
  userId: string,
  token: string,
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return await axios.put(
    `${API_URL}/chat/groupremove`,
    {
      chatId,
      userId,
    },
    config,
  )
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
