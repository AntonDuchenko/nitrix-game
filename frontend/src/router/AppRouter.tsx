import { Route, Routes } from "react-router";
import { Login } from "../pages/Login/Login";
import { Navigate } from "react-router";
import { Registration } from "../pages/Registration/Registration";
import { StartGamePage } from "../pages/StartGame/StartGame";
import { ProtectedRoute } from "./ProtectedRouter";
import { useAuth } from "../hooks/useAuth";
import { Game } from "../pages/Game/Game";

export const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/game" : "/login"} />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route
        path="/game"
        element={
          <ProtectedRoute>
            <StartGamePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game/play"
        element={
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
