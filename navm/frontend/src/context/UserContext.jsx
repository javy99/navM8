import React, { createContext, useState } from "react";

// Step 1: Correctly define and export your context
export const UserContext = createContext();

// Step 2: Define and export your provider component
export const UserContextProvider = ({ children }) => {
  const [photo, setPhoto] = useState(
    localStorage.getItem("profilePhoto") || null
  );

  const updatePhoto = (newPhoto) => {
    localStorage.setItem("profilePhoto", newPhoto);
    setPhoto(newPhoto);
  };

  return (
    <UserContext.Provider value={{ photo, updatePhoto }}>
      {children}
    </UserContext.Provider>
  );
};
