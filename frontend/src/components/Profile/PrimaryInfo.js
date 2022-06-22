import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

// navigation : association d'url avec l'affichage front de pages différentes
const PrimaryInfo = () => {
  const userData = useSelector((state) => state.userReducer);

console.log(userData.carprimary)

  return (
    <div className="primaryInfo">
      <img src={require("../../assets/del_sol1.jpg")} alt={userData.picture} />
      {/* {userData.carprimary.brand && userData.carprimary.model && (
      )} */}
      {/* <p className="carTypeInfo">
        {userData.carprimary.brand + " " + userData.carprimary.model}
      </p> */}
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
