import React from "react";
import "../styles/Header.scss";
import logo from "../assets/moi.jpg";

// navigation : association d'url avec l'affichage front de pages différentes
const Header = () => {
  return (
    <header>
      <div className="profilPictureHeader">
        <div>
          <img src={logo} alt="Logo" />
        </div>
      </div>
      <div className="logoHeader">
        <p>Kara</p>
      </div>
      <div className="nothingForMoment"></div>
    </header>
  );
};

export default Header;
