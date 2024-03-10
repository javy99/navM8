// hooks/useUserProfilePhoto.js
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const useUserProfilePhoto = () => {
  const { photo, updatePhoto } = useContext(UserContext);

  const setPhoto = (newPhoto) => {
    localStorage.setItem("profilePhoto", newPhoto);
    updatePhoto(newPhoto);
  };

  const removePhoto = () => {
    localStorage.removeItem("profilePhoto");
    updatePhoto(null);
  };

  return { photo, setPhoto, removePhoto };
};
