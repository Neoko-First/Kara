import React from "react";

export default function Messages() {
  return (
    <div className="messagesContainer">
      <div className="messagesBox">
        <p className="messagesTitle">Messages</p>
        <ul className="MessagesList">
          <li>
            <a href="/chat">
              <img
                className="messageImage"
                src={require("../../assets/pictures/del_sol1.jpg")}
                alt="Accueil"
              />
              <div className="messagesInfosText">
                <p className="messagesAuthor">Toyota MR2</p>
                <p className="messagesContentShort">
                  Salut mec, ta caisse est vraiment cool ! Tu es de quelle
                  région ? On pourrait peut-être rouler ensemble.
                </p>
              </div>
            </a>
          </li>
          <li>
            <img
              className="messageImage"
              src={require("../../assets/pictures/del_sol1.jpg")}
              alt="Accueil"
            />
            <div className="messagesInfosText">
              <p className="messagesAuthor">Toyota MR2</p>
              <p className="messagesContentShort">
                Salut mec, ta caisse est vraiment cool ! Tu es de quelle région
                ? On pourrait peut-être rouler ensemble.
              </p>
            </div>
          </li>
          <li>
            <img
              className="messageImage"
              src={require("../../assets/pictures/del_sol1.jpg")}
              alt="Accueil"
            />
            <div className="messagesInfosText">
              <p className="messagesAuthor">Toyota MR2</p>
              <p className="messagesContentShort">
                Salut mec, ta caisse est vraiment cool ! Tu es de quelle région
                ? On pourrait peut-être rouler ensemble.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
