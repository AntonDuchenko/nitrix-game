import { BrowserRouter } from "react-router";
import { AuthProvider } from "../context/Auth/AuthProvider";
import { SocketProvider } from "../context/Socket/SocketProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          {children}
          <ToastContainer newestOnTop />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
