import React from "react";
import { createRoot } from "react-dom/client";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import App from "./App.jsx";
import './index.css'
// Extend the theme to include custom fonts, colors, etc
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
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
