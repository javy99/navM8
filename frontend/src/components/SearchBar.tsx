import React, { useCallback, useState } from 'react'
import {
  Box,
  Input,
  Button,
  IconButton,
  HStack,
  useTheme,
} from '@chakra-ui/react'
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa'
import 'react-datepicker/dist/react-datepicker.css'

interface Props {
  onSearch: (cityName: string) => void
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const whiteColor = theme.colors.white

  const [cityName, setCityName] = useState<string>('')

  const debounce = (func: (arg0: string) => void, delay: number) => {
    let debounceTimer: NodeJS.Timeout
    return function (arg0: string) {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => func(arg0), delay)
    }
  }

  const handleSearch = useCallback(debounce(onSearch, 300), [onSearch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCityName = e.target.value
    setCityName(newCityName)
    handleSearch(newCityName)
  }

  return (
    <Box
      p={4}
      bg={whiteColor}
      borderRadius="full"
      boxShadow="md"
      maxW={{ base: '90%', md: '80%', lg: '70%' }}
      mx="auto"
      mt={10}
    >
      <HStack spacing={0} height="100%" align="center">
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
            value={cityName}
            onChange={handleChange}
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
        <Button
          colorScheme="teal"
          px={5}
          borderRadius="full"
          bg={primaryColor}
          color={whiteColor}
          _hover={{
            bg: primaryColor,
          }}
          onClick={() => onSearch(cityName)}
        >
          <FaSearch color={whiteColor} />
        </Button>
      </HStack>
    </Box>
  )
}

export default SearchBar
