import React, { useState } from "react";
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";

// navigation : association d'url avec l'affichage front de pages différentes
const Panel = () => {
  // par défaut, on affiche le form de login
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="authContainer">
      {!showSignUp ? <Login /> : <Signup />}
      <div className="accessToLoginOrSignUp">
        {!showSignUp ? (
          <p onClick={() => setShowSignUp(true)}>
            Pas encore membre ? <span>Créer un compte</span>
          </p>
        ) : (
          <p onClick={() => setShowSignUp(false)}>
            Déjà membre ? <span>Se connecter</span>
          </p>
        )}
      </div>{" "}
    </div>
  );
};

export default Panel;
