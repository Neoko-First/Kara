import React from "react";

export default function Header() {
  return (
    <header>
      <div className="profileHeaderAvatar">
        <div className="headerAvatar">
          <a href="/profile">
            <img src={require("../../assets/pictures/del_sol1.jpg")} alt="Kara" />
          </a>
        </div>
      </div>
      <div className="profileHeaderTitle">
        <a href="/">
          <img src={require("../../assets/logo-kara.png")} alt="Kara" />
          <p>Kara</p>
        </a>
      </div>
    </header>
  );
}
