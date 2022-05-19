import React from "react";

// navigation : association d'url avec l'affichage front de pages différentes
const PrimaryInfo = () => {
  return (
    <div className="primaryInfo">
      <img src={require("../../assets/moi.jpg")} alt="car" />
      <p>Alexandre</p>
    </div>
  );
};

export default PrimaryInfo;
