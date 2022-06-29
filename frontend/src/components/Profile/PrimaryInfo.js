import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

// navigation : association d'url avec l'affichage front de pages différentes
const PrimaryInfo = () => {
  const userData = useSelector((state) => state.userReducer);

  // console.log(userData.carprimary);

  return (
    <div className="primaryInfo">
      {userData.carPics.img1 ? (
        <>
          <img
            src={require(`../../../public/uploads/profils/${userData.carPics.img1}`)}
            alt="car"
          />
        </>
      ) : (
        <img
          src={require(`../../assets/profil/noPp.svg`)}
          alt="car"
        />
      )}
      {/* {userData.carprimary.brand && userData.carprimary.model && (
      )} */}
      {/* <p className="carTypeInfo">
        {userData.carprimary.brand + " " + userData.carprimary.model}
      </p> */}
      <p className="carTypeInfo">
        {userData.carprimary.brand + " " + userData.carprimary.model}
      </p>
      <p className="userNameLabel">{userData.pseudo}</p>
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
