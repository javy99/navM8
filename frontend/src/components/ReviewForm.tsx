import React, { useState } from 'react'
import { Box, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useAuthContext } from '../hooks'
import { Review } from '../types'
import Button from './Button'
import FormField from './FormField'

interface Props {
  tourId: string
  onSubmitSuccess: (review: Review) => void
}

const ReviewForm: React.FC<Props> = ({ tourId, onSubmitSuccess }) => {
  const { state } = useAuthContext()
  const { user } = state
  const [rating, setRating] = useState<string>('5')
  const [comment, setComment] = useState<string>('')
  const toast = useToast()

  const submitReview = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reviews`,
        {
          tourId,
          rating: parseInt(rating, 10),
          comment,
        },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        },
      )
      onSubmitSuccess(response.data)
      toast({
        title: 'Review submitted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error submitting review',
          description: "Please both rating and comment!",
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }

  return (
    <Box my="4">
      <FormField
        isRequired={false}
        label="Rating"
        name="rating"
        type="select"
        value={rating}
        mb={8}
        onChange={(e) => setRating(e.target.value)}
        options={[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          { value: '4', label: '4' },
          { value: '5', label: '5' },
        ]}
      />
      <FormField
        isRequired={false}
        label="Comment"
        name="comment"
        type="textarea"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review here..."
      />
      <Button mt="4" colorScheme="blue" onClick={submitReview}>
        Submit Review
      </Button>
    </Box>
  )
}

export default ReviewForm
