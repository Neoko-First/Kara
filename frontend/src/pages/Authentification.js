import React from "react";

export default function Authentification() {
  return (
    <div className="authContainer">
      <div className="authBox">
        <form class="authForm">
          <div class="authField">
            <label for="email">Email :</label>
            <input type="email" name="email" id="email" required />
          </div>
          <div class="authField">
            <label for="password">Mot de passe :</label>
            <input type="password" name="password" id="password" required />
          </div>
          <div class="authField">
            <input type="submit" value="Connexion" />
          </div>
        </form>
      </div>
    </div>
  );
}
