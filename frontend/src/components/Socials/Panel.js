import React from "react";
import Matchs from "../Socials/Matchs";
import "../../styles/Socials.scss";
import Messages from "../Socials/Messages";

// navigation : association d'url avec l'affichage front de pages différentes
const Home = () => {
  return (
    <div className="socialContainer">
      <Matchs />
      <Messages />
    </div>
  );
};

export default Home;
