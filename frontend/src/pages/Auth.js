import React from "react";
import Header from "../components/Header";
import Panel from "../components/Auth/Panel";
import Footer from "../components/Footer";
import "../styles/Auth.scss";

// navigation : association d'url avec l'affichage front de pages différentes
const Auth = () => {
  return (
    <>
      <Header />
      <Panel />
      <Footer />
    </>
  );
};

export default Auth;
