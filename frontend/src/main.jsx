import React from "react";
import { createRoot } from "react-dom/client";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import App from "./App.jsx";
import "./index.css";

import { AuthContextProvider } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarContext";
import { ProfilePhotoProvider } from "./context/ProfilePhotoContext";

const theme = extendTheme({
  fonts: {
    heading: "Poppins, sans-serif",
    body: "Poppins, sans-serif",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "4rem",
  },
  breakpoints: {
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
  },
});

// Use createRoot API for React 18+
const container = document.getElementById("root");
const root = createRoot(container); // Create a root.
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ProfilePhotoProvider>
        <ChakraProvider theme={theme}>
          <SidebarProvider>
            <App />
          </SidebarProvider>
        </ChakraProvider>
      </ProfilePhotoProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
