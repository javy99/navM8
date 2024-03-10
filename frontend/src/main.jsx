import React from "react";
import { createRoot } from "react-dom/client";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import App from "./App.jsx";
import "./index.css";

import { AuthContextProvider } from "./context/AuthContext";
import { UserContextProvider } from "./context/UserContext";

const theme = extendTheme({
  fonts: {
    heading: "Poppins, sans-serif",
    body: "Poppins, sans-serif",
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "#141627" : "white",
      },
      html: {
        fontSize: {
          base: "16px", // Default font size for all screen sizes
          sm: "16px", // For screens wider than 480px (usually no change needed if starting at 16px)
          md: "17px", // For screens wider than 768px
          lg: "18px", // For screens wider than 992px
          xl: "18px", // For screens wider than 1280px (may not need to increase further)
          "2xl": "18px", // For screens wider than 1536px (maintain readability without going too large)
        },
      },
    }),
  },
});

// Use createRoot API for React 18+
const container = document.getElementById("root");
const root = createRoot(container); // Create a root.
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <UserContextProvider>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </UserContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
