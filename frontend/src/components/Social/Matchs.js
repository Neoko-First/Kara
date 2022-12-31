import React from "react";

export default function Matchs() {
  return (
    <div className="matchsContainer">
      <div className="matchsBox">
        <p className="matchsTitle">Matchs (20)</p>
        <div className="matchsSlider">
          <div className="matchsCard">
            <a href="/profile">
              <img
                className="matchsImage"
                src={require("../../assets/pictures/del_sol1.jpg")}
                alt="Accueil"
              />
              <p className="matchsName">Del Sol CRX 1997 20005</p>
            </a>
          </div>
          <div className="matchsCard">
            <img
              className="matchsImage"
              src={require("../../assets/pictures/del_sol1.jpg")}
              alt="Accueil"
            />
            <p className="matchsName">Del Sol CRX 1997 20005</p>
          </div>
          <div className="matchsCard">
            <img
              className="matchsImage"
              src={require("../../assets/pictures/del_sol1.jpg")}
              alt="Accueil"
            />
            <p className="matchsName">Del Sol CRX 1997 20005</p>
          </div>
          <div className="matchsCard">
            <img
              className="matchsImage"
              src={require("../../assets/pictures/del_sol1.jpg")}
              alt="Accueil"
            />
            <p className="matchsName">Del Sol CRX 1997 20005</p>
          </div>
          <div className="matchsCard">
            <img
              className="matchsImage"
              src={require("../../assets/pictures/del_sol1.jpg")}
              alt="Accueil"
            />
            <p className="matchsName">Del Sol CRX 1997 20005</p>
          </div>
        </div>
      </div>
    </div>
  );
}
