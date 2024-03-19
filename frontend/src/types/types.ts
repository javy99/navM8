export interface User {
  id?: string
  token?: string
  username?: string
  email?: string
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

export type ChildrenProps = { children: React.ReactNode }
