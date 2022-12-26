import React from "react";

// navigation : association d'url avec l'affichage front de pages différentes
const Logout = () => {
  return (
    <>
      <button className="logoutCall">Se déconnecter</button>
      <p className="infoSetting">
        Si vous vous déconnecter de votre compte, celui-ci sera conservé et ne
        sera plus consultable, sauf par vos amis.
      </p>
    </>
  );
};

export default Logout;
