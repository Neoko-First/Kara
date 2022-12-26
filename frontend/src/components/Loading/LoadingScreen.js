import React from "react";
import Loader from "../Loading/Loader";
import "../../styles/Loading.scss";

// navigation : association d'url avec l'affichage front de pages différentes
const Panel = () => {
  return (
    <div className="loadingScreen">
      <Loader />
    </div>
  );
};

export default Panel;