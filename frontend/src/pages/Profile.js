import React from "react";
import "../styles/Profile.scss";
import Header from "../components/Header";
import Panel from "../components/Profile/Panel";
import Footer from "../components/Footer";

// navigation : association d'url avec l'affichage front de pages différentes
const Profile = () => {
  return (
    <>
      <Header />
      <Panel />
      <Footer />
    </>
  );
};

export default Profile;