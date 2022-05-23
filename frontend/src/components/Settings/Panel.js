import React from "react";
import Logout from "../Settings/Logout";
import DeleteAccount from "../Settings/DeleteAccount";
import Privacy from "../Settings/Privacy";
import Version from "../Settings/Version";

// navigation : association d'url avec l'affichage front de pages différentes
const Panel = () => {
  return (
    <div className="settingsContainer">
        <Logout></Logout>
        <DeleteAccount></DeleteAccount>
        <Privacy></Privacy>
        <Version></Version>
    </div>
  );
};

export default Panel;