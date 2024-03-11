import { useState } from "react";

const useProfileUpdate = (user, toast) => {
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (userInfo) => {
    setIsLoading(true);
    // URL for your profile update endpoint
    const updateProfileUrl = `${import.meta.env.VITE_API_URL}/auth/profile`;

    try {
      const response = await fetch(updateProfileUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(userInfo),
      });

      const data = await response.json();
      console.log(userInfo);

      if (response.ok) {
        toast({
          title: "Profile updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // console.log the updated info, like name surname, email, etc. all the updated fields
        console.log(data);
      } else {
        throw new Error(
          data.error || "An error occurred while updating the profile."
        );
      }
    } catch (error) {
      console.log("Error details:", error);
      let errorMessage = "Error updating profile.";
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        errorMessage =
          "Failed to fetch: The request cannot be made. Possibly a network error or CORS issue.";
      } else if (error.message) {
        errorMessage += ` ${error.message}`;
      }
      toast({
        title: "Error updating profile.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading };
};

export default useProfileUpdate;
