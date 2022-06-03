import React, { useState } from "react";

// navigation : association d'url avec l'affichage front de pages différentes
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {};

  return (
    <div className="loginContainer">
      <p>Connexion</p>
      <form action="" onSubmit={handleLogin}>
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
          <input type="submit" value="Se connecter"></input>
        </div>
      </form>
    </div>
  );
};

export default Login;
