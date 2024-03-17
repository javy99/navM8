import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "../hooks";
import { ChildrenProps } from "../types";

interface ProfilePhotoContextType {
  photo: string;
  updatePhoto: (newPhoto: string) => void;
  removePhoto: () => void;
}

const defaultContextValue: ProfilePhotoContextType = {
  photo: "",
  updatePhoto: () => {},
  removePhoto: () => {},
};

export const ProfilePhotoContext =
  createContext<ProfilePhotoContextType>(defaultContextValue);

export const ProfilePhotoProvider: React.FC<ChildrenProps> = ({
  children,
}) => {
  const { state } = useAuthContext();
  const { user } = state;

  const [photo, setPhoto] = useState<string>("");

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

  const updatePhoto = (newPhoto: string) => {
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
