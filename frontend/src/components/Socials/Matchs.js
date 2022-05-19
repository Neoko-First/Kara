import React from "react";

// navigation : association d'url avec l'affichage front de pages différentes
const Matchs = () => {
  return (
    <div className="matchsContainer">
      <p>Nouveaux Matchs</p>
      <ul>
        <li>
          <img
            src={require("../../assets/del_sol.jpg")}
            alt="car"
          />
          <p>Honda CRX Del Sol</p>
        </li>
        <li>
          <img
            src={require("../../assets/del_sol.jpg")}
            alt="car"
          />
          <p>Honda CRX Del Sol</p>
        </li>
        <li>
          <img
            src={require("../../assets/del_sol.jpg")}
            alt="car"
          />
          <p>Honda CRX Del Sol</p>
        </li>
        <li>
          <img
            src={require("../../assets/del_sol.jpg")}
            alt="car"
          />
          <p>Honda CRX Del Sol</p>
        </li>
        <li>
          <img
            src={require("../../assets/del_sol.jpg")}
            alt="car"
          />
          <p>Honda CRX Del Sol</p>
        </li>
      </ul>
    </div>
  );
};

export default Matchs;
