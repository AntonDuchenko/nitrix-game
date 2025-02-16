import { BrowserRouter } from "react-router";
import { AuthProvider } from "../context/AuthProvider";
import { SocketProvider } from "../context/SocketProvider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>{children}</SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
