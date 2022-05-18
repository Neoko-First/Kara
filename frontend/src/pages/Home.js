import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Slider from "../components/Slider";

// navigation : association d'url avec l'affichage front de pages différentes
const Home = () => {
  return (
    <>
      <Header />
      <Slider />
      <Footer />
    </>
  );
};

export default Home;
