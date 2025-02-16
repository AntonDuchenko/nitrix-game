import { createContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
});
