import {
  Button as ChakraButton,
  border,
  useColorModeValue,
} from "@chakra-ui/react";

const Button = ({ children, onClick, border, ...rest }) => {
  const buttonBgColor = useColorModeValue("#0B6B78", "#D1F366");
  const buttonTextColor = useColorModeValue("white", "#141627");

  return (
    <ChakraButton
      fontSize="1.2rem"
      bg={buttonBgColor}
      color={buttonTextColor}
      _hover={{
        bg: buttonBgColor,
      }}
      onClick={onClick}
      borderRadius="xl"
      border={border}
      px={5}
      py={6}
      {...rest}
    >
      {children}
    </ChakraButton>
  );
};

export default Button;
