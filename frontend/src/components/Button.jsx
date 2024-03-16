import {
  Button as ChakraButton,
  border,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";

const Button = ({ children, onClick, border, ...rest }) => {
  const primaryColor = "#0B6B78";
  const whiteColor = "white";

  // Responsive font size, padding, and border radius
  const fontSize = useBreakpointValue({ base: "md", ls: "lg" });
  const paddingX = useBreakpointValue({ base: 4, md: 5 });
  const paddingY = useBreakpointValue({ base: 2, md: 3 });
  const borderRadius = useBreakpointValue({ base: "md", md: "xl" });

  return (
    <ChakraButton
      fontSize={fontSize}
      bg={primaryColor}
      color={whiteColor}
      _hover={{
        bg: primaryColor,
      }}
      onClick={onClick}
      border={border}
      borderRadius={borderRadius}
      px={paddingX}
      py={paddingY}
      {...rest}
    >
      {children}
    </ChakraButton>
  );
};

export default Button;
