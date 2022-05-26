import React, { useState } from "react";
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";

// navigation : association d'url avec l'affichage front de pages différentes
const Panel = () => {
  // par défaut, on affiche le form de login
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="authContainer">{!showSignUp ? <Login /> : <Signup />}</div>
  );
};

export default Panel;
