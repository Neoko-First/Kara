import React from "react";
import PrimaryInfo from "../Profile/PrimaryInfo";
import PicturesManager from "../Profile/PicturesManager";
import InfoCar from "../Profile/InfoCar";

// navigation : association d'url avec l'affichage front de pages différentes
const Panel = () => {
  return (
    <div className="profileContainer">
      <PrimaryInfo />
      <PicturesManager />
      <InfoCar />
    </div>
  );
};

export default Panel;
