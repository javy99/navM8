export const loginService = async (
  email: string,
  password: string,
): Promise<any> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    },
  )
  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.error || 'An error occurred during login')
  }

  return json
}

export const signupService = async (
  email: string,
  password: string,
  username: string,
): Promise<any> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username }),
    },
  )
  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.error || 'An error occurred during signup')
  }

  return json
}
