import React from "react";
import { NavLink } from "react-router-dom";

// navigation : association d'url avec l'affichage front de pages différentes
const PrimaryInfo = () => {
  return (
    <div className="primaryInfo">
      <img src={require("../../assets/moi.jpg")} alt="car" />
      <p>Alexandre</p>
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
