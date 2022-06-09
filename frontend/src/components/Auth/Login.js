import React, { useState } from "react";
import axios from "axios";

// navigation : association d'url avec l'affichage front de pages différentes
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const emailError = document.querySelector(".emailError");
    const passwordError = document.querySelector(".passwordError");

    axios({
      method: "post",
      url: "http://localhost:5000/api/user/login",
      withCredentials: true,
      data: {
        email: email,
        password: password,
      },
    })
      .then((res) => {
        if (res.data.errors) {
          emailError.innerHTML = res.data.errors.email;
          passwordError.innerHTML = res.data.errors.password;
        } else {
          window.location = "/";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="loginContainer">
      <p>Connexion</p>
      <form action="" onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">
            Email <span>*</span>
          </label>
          <input
            type="text"
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
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          ></input>
        </div>
        <div className="passwordError"></div>
        <div>
          <input type="submit" value="Se connecter"></input>
        </div>
      </form>
    </div>
  );
};

export default Login;
