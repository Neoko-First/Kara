import React from "react";

// navigation : association d'url avec l'affichage front de pages différentes
const DeleteAccount = () => {
  return (
    <>
      <button className="deleteCall">Supprimer mon compte</button>
      <p className="infoSetting">
        Suppression définitive de votre compte. Celui-ci ne sera donc plus
        consultable.
      </p>
    </>
  );
};

export default DeleteAccount;
