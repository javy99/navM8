import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { BsStarFill, BsStarHalf } from 'react-icons/bs'

interface Props {
  rating: number
  reviewCount?: number
  showDetails?: boolean
}

const StarRating: React.FC<Props> = ({
  rating,
  reviewCount = 0,
  showDetails = true,
}) => {
  const renderStars = () => {
    let stars: JSX.Element[] = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <BsStarFill
            size={22}
            key={i}
            color="#D69E2E"
            style={{ marginRight: '0.1rem' }}
          />,
        )
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(
          <BsStarHalf
            size={22}
            key={i}
            color="#D69E2E"
            style={{ marginRight: '0.1rem' }}
          />,
        )
      } else {
        stars.push(
          <BsStarFill
            key={i}
            color="silver"
            style={{ marginRight: '0.1rem' }}
            size={22}
          />,
        )
      }
    }
    return stars
  }

  return (
    <Flex align="center">
      {showDetails && (
        <Text mr={2} fontWeight="bold">
          {rating}
        </Text>
      )}
      <Flex>{renderStars()}</Flex>
      {showDetails && (
        <Text ml={2} fontWeight="bold">
          {reviewCount} review{reviewCount !== 1 ? 's' : ''}
        </Text>
      )}
    </Flex>
  )
}

export default StarRating
