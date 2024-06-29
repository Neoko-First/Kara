import { useRoutes } from "react-router-dom";
// import { Navigate } from "react-router-dom";

import AuthenticationRoutes from "./AuthenticationRoutes";
import MainRoutes from "./MainRoutes";
import NotFound from "../views/NotFound";

export default function ThemeRoutes() {
  return useRoutes([
    // { path: "/", element: <Navigate to="/auth/connexion" replace /> },
    // { path: "/auth", element: <Navigate to="/auth/connexion" replace /> },
    // { path: "/admin", element: <Navigate to="/admin/board" replace /> },
    AuthenticationRoutes,
    MainRoutes,
    { path: "*", element: <NotFound /> },
  ]);
}
