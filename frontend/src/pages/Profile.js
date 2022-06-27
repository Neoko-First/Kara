import React from "react";
import "../styles/Profile.scss";
import Header from "../components/Header";
import Panel from "../components/Profile/Panel";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

// navigation : association d'url avec l'affichage front de pages différentes
const Profile = () => {
  return (
    <>
      <ProtectedRoute />
      <Header />
      <Panel />
      <Footer />
    </>
  );
};

export default Profile;