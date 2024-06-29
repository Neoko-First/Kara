import { useState } from "react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { useUser } from "../contexts/User";

export const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { dispatch } = useUser();

  useEffect(() => {
    axiosInstance("/admin/me")
      .then((response) => {
        dispatch({
          type: "LOGIN",
          payload: { user: response.data },
        });
        setIsLoggedIn(true);
      })
      .catch((error) => {
        dispatch({
          type: "LOGOUT",
        });
        console.log(error);
        setIsLoggedIn(false);
        return navigate("/auth/connexion");
      });
  }, [isLoggedIn]);

  // If authenticated, render the child routes
  return <>{isLoggedIn ? <Outlet /> : null}</>;
};
