import React from "react";

// navigation : association d'url avec l'affichage front de pages différentes
const Version = () => {
  return (
    <div className="versionContainer">
      <div>
        <img src={require("../../assets/logo-kara.png")} alt="car" />
        <p>Kara</p>
      </div>
      <span>Version 0.1</span>
    </div>
  );
};

export default Version;
