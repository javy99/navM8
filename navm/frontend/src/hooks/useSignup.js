import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, username) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      }
    );
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      return false;
    }

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));

      dispatch({ type: "LOGIN", payload: json });

      setIsLoading(false);

      return true;
    }
  };

  return { isLoading, signup, error };
};
