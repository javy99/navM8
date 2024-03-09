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
