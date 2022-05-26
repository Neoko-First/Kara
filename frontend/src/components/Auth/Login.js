import React from "react";

// navigation : association d'url avec l'affichage front de pages différentes
const Login = () => {
  return (
    <div className="loginContainer">
      <p>Connexion</p>
      <form>
        <div>
          <label>
            Email <span>*</span>
          </label>
          <input type="text"></input>
        </div>
        <div>
          <label>
            Mot de passe <span>*</span>
          </label>
          <input type="password"></input>
        </div>
        <div>
          <button>Se connecter</button>
        </div>
        <div className="accessToLoginOrSignUp">
          <p>
            Pas encore membre ? <span>Créer un compte</span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
