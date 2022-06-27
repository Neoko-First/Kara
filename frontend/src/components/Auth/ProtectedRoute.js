import React from "react";
import { useSelector } from "react-redux";

// navigation : association d'url avec l'affichage front de pages différentes
const ProtectedRoute = () => {
  const userData = useSelector((state) => state.userReducer);

  if (!userData._id) window.location = "/Auth";

  return <></>;
};

export default ProtectedRoute;
