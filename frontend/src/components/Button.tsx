import { ComponentProps } from 'react'
import {
  Button as ChakraButton,
  useBreakpointValue,
  useTheme,
} from '@chakra-ui/react'

type ButtonProps = ComponentProps<typeof ChakraButton>

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const whiteColor = theme.colors.white

  // Responsive font size, padding, and border radius
  const fontSize = useBreakpointValue({ base: 'md', ls: 'lg' })
  const paddingX = useBreakpointValue({ base: 4, md: 5 })
  const paddingY = useBreakpointValue({ base: 2, md: 3 })
  const borderRadius = useBreakpointValue({ base: 'md', md: 'xl' })

  return (
    <ChakraButton
      fontSize={fontSize}
      bg={primaryColor}
      color={whiteColor}
      _hover={{
        bg: primaryColor,
      }}
      borderRadius={borderRadius}
      px={paddingX}
      py={paddingY}
      {...props}
    >
      {children}
    </ChakraButton>
  )
}

export default Button
