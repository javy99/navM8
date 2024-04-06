import React from 'react'
import { Flex, Icon, Text, Tooltip, useTheme } from '@chakra-ui/react'
import { BsFillPatchCheckFill, BsInfoCircle } from 'react-icons/bs'
import StarRating from './StarRating'

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
  const theme = useTheme()

  return (
    <Flex align="center">
      <StarRating rating={rating} reviewCount={reviewCount} />
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
            borderRadius="lg"
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
