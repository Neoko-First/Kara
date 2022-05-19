import React from "react";
import PrimaryInfo from "../Profile/PrimaryInfo";

// navigation : association d'url avec l'affichage front de pages différentes
const Panel = () => {
  return (
    <div className="profileContainer">
      <PrimaryInfo />
    </div>
  );
};

export default Panel;