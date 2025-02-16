import { BrowserRouter } from "react-router";
import { AuthProvider } from '../context/Auth/AuthProvider';
import { SocketProvider } from '../context/Socket/SocketProvider';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>{children}</SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
