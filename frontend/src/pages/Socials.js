import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Panel from "../components/Socials/Panel";

// navigation : association d'url avec l'affichage front de pages différentes
const Home = () => {
  return (
    <>
      <Header />
      <Panel />
      <Footer />
    </>
  );
};

export default Home;