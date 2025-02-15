import { ReactNode, useEffect, useState } from "react";
import Coockies from "js-cookie";
import { AuthContext } from "./AuthContext";
import { checkToken } from "../utils/api/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Coockies.get("auth_token")
  );

  useEffect(() => {
    const token = Coockies.get("auth_token");

    if (!token) return;

    const isTokenValid = async () => {
      try {
        const res = await checkToken(token);

        if (res.message === "Token is valid") {
          setIsAuthenticated(true);
          Coockies.set("userId", res.userId);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        Coockies.remove("auth_token");
        setIsAuthenticated(false);
      }
    };

    isTokenValid();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
};
