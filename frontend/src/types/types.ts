export interface User {
  _id?: string
  token?: string
  profilePictureURL?: string
  username?: string
  email?: string
  password?: string
  firstName: string
  lastName: string
  phoneNumber: string
  country: string
  city: string
  birthDate: string
  gender: string
  languagesSpoken: string[]
  interests: string[]
  bio: string
  createdAt?: Date
  currentPassword?: string
  newPassword?: string
}

export interface Tour {
  _id?: string
  name: string
  country: string
  city: string
  maxPeople: string
  typeOfAvailability: string
  availability: string
  date: string
  from: string
  to: string
  description: string
  photos: (File | string)[]
}

export interface Guide {
  id: string
  name: string
  city: string
  country: string
  description: string
  interests: string[]
  spokenLanguages: string[]
  review: number
}

export interface Message {
  _id: string
  sender: User
  chat: Chat
  content: string
}

export interface Chat {
  _id: string
  chatName: string
  isGroupChat: boolean
  users: User[]
  groupAdmin?: User
  latestMessage?: Message
}

export type ChildrenProps = { children: React.ReactNode }
