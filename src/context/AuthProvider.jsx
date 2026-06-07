import { useState } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    // userData may be either a user object or { user, token }
    const userToStore = userData?.user ?? userData;
    setUser(userToStore);

    sessionStorage.setItem("user", JSON.stringify(userToStore));

    if (userData?.token) {
      sessionStorage.setItem("token", userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
