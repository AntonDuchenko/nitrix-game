import { Route, Routes } from "react-router";
import { Navigate } from "react-router";
import { ProtectedRoute } from "./ProtectedRouter";
import { useAuth } from "../hooks/useAuth";
import {
  GameController,
  Login,
  Registration,
  StartGameController,
} from "../components/features";

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
            <StartGameController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game/play"
        element={
          <ProtectedRoute>
            <GameController />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
