import { Button as ChakraButton, useColorModeValue } from "@chakra-ui/react";

const Button = ({ children, onClick, ...rest }) => {
  const buttonBgColor = useColorModeValue("#0B6B78", "#D1F366");
  const buttonTextColor = useColorModeValue("white", "#141627");

  return (
    <ChakraButton
      bg={buttonBgColor}
      color={buttonTextColor}
      _hover={{
        bg: buttonBgColor,
      }}
      onClick={onClick}
      borderRadius="xl"
      {...rest}
    >
      {children}
    </ChakraButton>
  );
};

export default Button;
