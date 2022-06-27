import React, { useState } from "react";
import axios from "axios";

// navigation : association d'url avec l'affichage front de pages différentes
const Signup = () => {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");

  // toggle password to text
  const [passwordShown, setPasswordShown] = useState(false);

  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const pseudoError = document.querySelector(".pseudoError");
    const emailError = document.querySelector(".emailError");
    const passwordError = document.querySelector(".passwordError");
    const passwordConfError = document.querySelector(".passwordConfError");

    if (password == passwordConf) {
      axios({
        method: "post",
        url: "http://localhost:5000/api/user/signup",
        withCredentials: true,
        data: {
          pseudo: pseudo,
          email: email,
          password: password,
        },
      })
        .then((res) => {
          if (res.data.errors) {
            pseudoError.innerHTML = res.data.errors.pseudo;
            emailError.innerHTML = res.data.errors.email;
            passwordError.innerHTML = res.data.errors.password;
          } else {
            window.location = "/Auth";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      passwordConfError.innerHTML = "Veuilez confirmer votre mot de passe";
    }
  };

  return (
    <div className="signupContainer">
      <p>Inscription</p>
      <form action="" onSubmit={handleSignup}>
        <div>
          <label htmlFor="pseudo">
            Pseudo <span>*</span>
          </label>
          <input
            type="text"
            name="pseudo"
            id="pseudo"
            onChange={(e) => setPseudo(e.target.value)}
            value={pseudo}
          ></input>
        </div>
        <div className="pseudoError"></div>
        <div>
          <label htmlFor="email">
            Email <span>*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          ></input>
        </div>
        <div className="emailError"></div>
        <div>
          <label htmlFor="password">
            Mot de passe <span>*</span>
          </label>
          <div className="passwordInputDiv">
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            ></input>
            <button onClick={togglePassword}>
              <i className="fas fa-eye"></i>
            </button>
          </div>
        </div>
        <div className="passwordError"></div>
        <div>
          <label htmlFor="passwordConf">
            Confirmer mot de passe <span>*</span>
          </label>
          <input
            type="password"
            id="passwordConf"
            onChange={(e) => setPasswordConf(e.target.value)}
            value={passwordConf}
          ></input>
        </div>
        <div className="passwordConfError"></div>
        <div>
          <button>S'inscrire</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
