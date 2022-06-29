import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/Header.scss";

// navigation : association d'url avec l'affichage front de pages différentes
const Header = () => {
  const userData = useSelector((state) => state.userReducer);

  return (
    <header>
      <div className="profilPictureHeader">
        {userData.carPics.img1 ? (
          <>
            <div>
              <img
                src={require(`../../public/uploads/profils/${userData.carPics.img1}`)}
                alt="car"
              />
            </div>
          </>
        ) : (
          <img src={require(`../assets/profil/noPp.svg`)} alt="car" />
        )}
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
