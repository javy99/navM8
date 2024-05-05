import axios from 'axios'

const BASE_API_URL = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true

const submitReview = async (
  tourId: string,
  rating: number,
  comment: string,
) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/reviews`, {
      tourId,
      rating,
      comment,
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to submit review')
    } else {
      throw new Error('An error occurred while submitting the review')
    }
  }
}

const fetchReviews = async (tourId: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/reviews/${tourId}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error fetching reviews:', error.response.data)
      throw new Error(error.response.data.message || 'Failed to fetch reviews')
    } else {
      console.error('Error:', error)
      throw new Error('An error occurred while fetching reviews')
    }
  }
}

export { submitReview, fetchReviews }
