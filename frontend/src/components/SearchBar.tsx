import React, { useState } from 'react'
import {
  Box,
  Input,
  Button,
  IconButton,
  HStack,
  useDisclosure,
  Divider,
  useTheme,
} from '@chakra-ui/react'
import {
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserFriends,
} from 'react-icons/fa'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const SearchBar: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure()
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const whiteColor = theme.colors.white

  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null])

  const formatDateRange = () => {
    const [startDate, endDate] = dates
    if (!startDate || !endDate) return 'Dates'
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
  }

  return (
    <Box
      p={4}
      bg={whiteColor}
      borderRadius="full"
      boxShadow="md"
      maxW="65%"
      mx="auto"
      mt={10}
    >
      <HStack spacing={0} height="100%" align="center">
        {/* Location Input */}
        <HStack spacing={0} position="relative" flex="1" align="center">
          <Input
            variant="unstyled"
            placeholder="Choose Destination"
            pl={12}
            color="gray.600"
            sx={{
              '::placeholder': {
                color: primaryColor,
              },
            }}
          />
          <IconButton
            icon={<FaMapMarkerAlt />}
            aria-label="Location"
            variant="ghost"
            isRound
            position="absolute"
            size="lg"
            color={primaryColor}
          />
        </HStack>

        <Divider orientation="vertical" height="40px" borderColor="gray.200" />

        {/* Date Range Picker */}
        <HStack spacing={0} position="relative" flex="1">
          <Input
            variant="unstyled"
            placeholder="Dates"
            pl={12}
            value={formatDateRange()}
            readOnly
            color={primaryColor}
            onClick={onToggle}
          />
          <IconButton
            icon={<FaCalendarAlt />}
            aria-label="Dates"
            variant="ghost"
            isRound
            size="lg"
            position="absolute"
            color={primaryColor}
            onClick={onToggle}
          />
          {isOpen && (
            <Box position="absolute" zIndex="popover" left={0} top="100%">
              <DatePicker
                selectsRange={true}
                startDate={dates[0]}
                endDate={dates[1]}
                onChange={(update: [Date | null, Date | null]) =>
                  setDates(update)
                }
                inline
              />
            </Box>
          )}
        </HStack>

        <Divider orientation="vertical" height="40px" borderColor="gray.200" />

        {/* Guests Input */}
        <HStack spacing={0} position="relative" flex="1">
          <Input
            variant="unstyled"
            placeholder="Number of travelers"
            pl={12}
            color="gray.600"
            sx={{
              '::placeholder': {
                color: primaryColor,
              },
            }}
          />
          <IconButton
            icon={<FaUserFriends />}
            aria-label="Guests"
            variant="ghost"
            isRound
            size="lg"
            position="absolute"
            color={primaryColor}
          />
        </HStack>

        <Button
          colorScheme="teal"
          px={5}
          borderRadius="full"
          bg={primaryColor}
          color={whiteColor}
          _hover={{
            bg: primaryColor,
          }}
          onClick={() => alert('Search functionality to be implemented')}
        >
          <FaSearch color={whiteColor} />
        </Button>
      </HStack>
    </Box>
  )
}

export default SearchBar
