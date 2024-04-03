import React from 'react'
import { Flex, Icon, Text, Tooltip, useTheme } from '@chakra-ui/react'
import {
  BsStarFill,
  BsStarHalf,
  BsFillPatchCheckFill,
  BsInfoCircle,
} from 'react-icons/bs'

interface Props {
  rating: number
  reviewCount: number
  recommendationRate: number
}

const Rating: React.FC<Props> = ({
  rating,
  reviewCount,
  recommendationRate,
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

  const theme = useTheme()
  const secondaryColor = theme.colors.secondary

  return (
    <Flex align="center">
      <Flex>{renderStars().map((star) => star)}</Flex>
      <Text ml={2} color={secondaryColor} fontWeight="bold">
        {reviewCount} review{reviewCount !== 1 ? 's' : ''}
      </Text>
      <Flex align="center" ml={6}>
        <Icon as={BsFillPatchCheckFill} color="#008ABF" w={22} h={22} />
        <Flex ml={2} align="center">
          <Text>Recommended by {recommendationRate}% of travelers</Text>
          <Tooltip
            hasArrow
            label="95% of reviewers gave this tour rating of 4 or higher."
            placement="bottom"
            p={2}
            bg={theme.colors.primary}
            borderRadius='lg'
          >
            <Flex align="center">
              <Icon as={BsInfoCircle} ml={2} w={15} h={15} />
            </Flex>
          </Tooltip>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Rating
