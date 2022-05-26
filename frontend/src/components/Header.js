import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Header.scss";
import logo from "../assets/moi.jpg";

// navigation : association d'url avec l'affichage front de pages différentes
const Header = () => {
  return (
    <header>
      <div className="profilPictureHeader">
        <NavLink exact="true" to="/Profile">
          <div>
            <img src={require("../assets/moi.jpg")} alt="car" />
          </div>
        </NavLink>
      </div>
      <div className="logoHeader">
        <img src={require("../assets/logo-kara.png")} alt="car" />
        <p>Kara</p>
      </div>
      <div className="nothingForMoment"></div>
    </header>
  );
};

export default Header;
