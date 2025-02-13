import { Route, Routes } from "react-router";
import { Login } from "../pages/Login/Login";
import { Navigate } from "react-router";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login />} />
    </Routes>
  );
};
