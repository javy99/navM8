import { useAuthContext } from ".";

const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT", payload: null });
  };

  return { logout };
};

export default useLogout;
