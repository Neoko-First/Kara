import React from "react";

// navigation : association d'url avec l'affichage front de pages différentes
const Privacy = () => {
  return (
    <div className="privacyContainer">
      <p className="settingTitle">Confidentialité</p>
      <div className="privacyFields">
        <p>Politique relative aux cookies</p>{" "}
        <p>Politique de confidentialité</p>{" "}
        <p>Préférence de confidentialité</p>{" "}
      </div>
    </div>
  );
};

export default Privacy;
