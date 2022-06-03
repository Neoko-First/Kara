import React, { useState } from "react";
import axios from "axios";

// navigation : association d'url avec l'affichage front de pages différentes
const Signup = () => {


  return (
    <div className="signupContainer">
      <p>Inscription</p>
      <form>
        <div>
          <label>
            Pseudo <span>*</span>
          </label>
          <input type="text"></input>
        </div>
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
          <label>
            Confirmer mot de passe <span>*</span>
          </label>
          <input type="password"></input>
        </div>
        <div>
          <button>S'inscrire</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
