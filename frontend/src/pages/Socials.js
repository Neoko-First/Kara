import React from "react";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Panel from "../components/Socials/Panel";

// navigation : association d'url avec l'affichage front de pages différentes
const Home = () => {
  return (
    <>
      {/* <ProtectedRoute /> */}
      <Header />
      <Panel />
      <Footer />
    </>
  );
};

export default Home;