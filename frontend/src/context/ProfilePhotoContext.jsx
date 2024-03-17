import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

export const ProfilePhotoContext = createContext();

export const ProfilePhotoProvider = ({ children }) => {
  const { state } = useAuthContext();
  const { user } = state;

  const [photo, setPhoto] = useState("");

  useEffect(() => {
    const currentPhoto =
      localStorage.getItem(`userProfilePhoto_${user?.id}`) || "";
    setPhoto(currentPhoto);
  }, [user?.id]); // React to changes in user.id

  useEffect(() => {
    if (user?.id) {
      if (photo) {
        localStorage.setItem(`userProfilePhoto_${user.id}`, photo);
      } else {
        localStorage.removeItem(`userProfilePhoto_${user.id}`);
      }
    }
  }, [photo, user?.id]);

  const updatePhoto = (newPhoto) => {
    setPhoto(newPhoto);
  };

  const removePhoto = () => {
    setPhoto("");
  };

  return (
    <ProfilePhotoContext.Provider value={{ photo, updatePhoto, removePhoto }}>
      {children}
    </ProfilePhotoContext.Provider>
  );
};

export const useProfilePhoto = () => useContext(ProfilePhotoContext);
