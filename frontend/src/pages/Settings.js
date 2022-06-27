import React from "react";
import "../styles/Settings.scss";
import Header from "../components/Header";
import Panel from "../components/Settings/Panel";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

// navigation : association d'url avec l'affichage front de pages différentes
const Settings = () => {
  return (
    <>
      <ProtectedRoute />
      <Header />
      <div className="settingsContainer">
        <Panel />
      </div>
      <Footer />
    </>
  );
};

export default Settings;
