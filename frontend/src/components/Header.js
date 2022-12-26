import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/Header.scss";

// navigation : association d'url avec l'affichage front de pages différentes
const Header = () => {
  const userData = useSelector((state) => state.userReducer);
  const [isLoading, setIsLoading] = useState(true);

  // lorsque les photo sont chargés, on "autorise le chargement du front"
  useEffect(() => {
    userData.carPics != undefined && setIsLoading(false);
  }, [userData]);

  return (
    <header>
      <div className="profilPictureHeader">
        {!isLoading ? (
          <div>
            <NavLink exact="true" to="/Profile">
              <img
                src={require(`../../public/uploads/profils/${userData.carPics.img1}`)}
                alt="car"
              />
            </NavLink>
          </div>
        ) : (
          <div>
            <NavLink exact="true" to="/Profile">
              <img src={require(`../assets/profil/noPp.png`)} alt="car" />
            </NavLink>
          </div>
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
