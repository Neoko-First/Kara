import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { UidContext } from "../AppContext";

// navigation : association d'url avec l'affichage front de pages différentes
const PrimaryInfo = () => {
  const userData = useSelector((state) => state.userReducer);
  const [isLoading, setIsLoading] = useState(true);

  // lorsque les photo sont chargés, on "autorise le chargement du front"
  useEffect(() => {
    userData.carPics != undefined && setIsLoading(false);
  }, [userData]);

  return (
    <div className="primaryInfo">
      {!isLoading ? (
        <img
          src={require(`../../../public/uploads/profils/${userData.carPics.img1}`)}
          alt="car"
        />
      ) : (
        <img src={require(`../../assets/profil/noPp.png`)} alt="car" />
      )}
      {/* {userData.carprimary.brand && userData.carprimary.model && (
      )} */}
      {/* <p className="carTypeInfo">
        {userData.carprimary.brand + " " + userData.carprimary.model}
      </p> */}
      {!isLoading && (
        <>
          <p className="carTypeInfo">
            {userData.carprimary.brand + " " + userData.carprimary.model}
          </p>
          <p className="userNameLabel">{userData.pseudo}</p>
        </>
      )}
      <NavLink exact="true" to="/Settings">
        <div className="settingCall">
          <button>
            <i className="fas fa-cog"></i>
          </button>
        </div>
      </NavLink>
    </div>
  );
};

export default PrimaryInfo;
