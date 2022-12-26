import React from "react";

// navigation : association d'url avec l'affichage front de pages différentes
const Messages = () => {
  return (
    <div className="messagesContainer">
      <p>Messages</p>
      <ul>
        <li>
          <img src={require("../../assets/profil/moi.jpg")} alt="car" />
          <div className="infoMessage">
            <p>Toyota MR2</p>
            <p>Salut, ta caisse est vraiment belle ! Tu es de quel coin ?</p>
          </div>
        </li>
        <li>
          <img src={require("../../assets/profil/moi.jpg")} alt="car" />
          <div className="infoMessage">
            <p>Toyota MR2</p>
            <p>Salut, ta caisse est vraiment belle ! Tu es de quel coin ?</p>
          </div>
        </li>
        <li>
          <img src={require("../../assets/profil/moi.jpg")} alt="car" />
          <div className="infoMessage">
            <p>Toyota MR2</p>
            <p>Salut, ta caisse est vraiment belle ! Tu es de quel coin ?</p>
          </div>
        </li>
        <li>
          <img src={require("../../assets/profil/moi.jpg")} alt="car" />
          <div className="infoMessage">
            <p>Toyota MR2</p>
            <p>Salut, ta caisse est vraiment belle ! Tu es de quel coin ?</p>
          </div>
        </li>
        <li>
          <img src={require("../../assets/profil/moi.jpg")} alt="car" />
          <div className="infoMessage">
            <p>Toyota MR2</p>
            <p>Salut, ta caisse est vraiment belle ! Tu es de quel coin ?</p>
          </div>
        </li>
        <li>
          <img src={require("../../assets/profil/moi.jpg")} alt="car" />
          <div className="infoMessage">
            <p>Toyota MR2</p>
            <p>Salut, ta caisse est vraiment belle ! Tu es de quel coin ?</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Messages;
