import React from "react";

// navigation : association d'url avec l'affichage front de pages différentes
const PicturesManager = () => {
  return (
    <div className="picturesManagerContainer">
      <p>Photos</p>
      <span>Ne montrez pas votre plaque d'immatriculation</span>
      <div className="picturesManager">
        <div className="pictureCard">
          <img src={require("../../assets/del_sol1.jpg")} alt="car" />
        </div>
        <div className="pictureCard">
          <img src={require("../../assets/del_sol2.jpg")} alt="car" />
        </div>
        <div className="pictureCard">
          <img src={require("../../assets/del_sol3.jpg")} alt="car" />
          <i className="fas fa-times-circle"></i>
        </div>
        <div className="pictureCard">
          <i className="fas fa-plus-circle"></i>
        </div>
        <div className="pictureCard">
          <i className="fas fa-plus-circle"></i>
        </div>
        <div className="pictureCard">
          <i className="fas fa-plus-circle"></i>
        </div>
        <div className="pictureCard">
          <i className="fas fa-plus-circle"></i>
        </div>
        <div className="pictureCard">
          <i className="fas fa-plus-circle"></i>
        </div>
        <div className="pictureCard">
          <i className="fas fa-plus-circle"></i>
        </div>
      </div>
    </div>
  );
};

export default PicturesManager;
