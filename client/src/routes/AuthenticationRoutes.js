import { lazy } from "react";

const AuthLayout = lazy(() => import("../layouts/AuthLayout"));

const Login = lazy(() => import("../views/Auth/Login"));
const SignUp = lazy(() => import("../views/Auth/SignUp"));
const ForgotPassword = lazy(() => import("../views/Auth/ForgotPassword"));
const ReinitPassword = lazy(() => import("../views/Auth/ReinitPassword"));

const NotFound = lazy(() => import("../views/NotFound"));

const AuthenticationRoutes = {
  path: "auth",
  element: <AuthLayout />,
  children: [
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "sign-up",
      element: <SignUp />,
    },
    {
      path: "forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "reinit-password",
      element: <ReinitPassword />,
    },
    { path: "*", element: <NotFound /> },
  ],
};

export default AuthenticationRoutes;
