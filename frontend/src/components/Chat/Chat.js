import React from "react";
import BackIcon from "../../assets/back.svg";

export default function Chat() {
  return (
    <div className="chatContainer">
      <div className="chatBox">
        <div className="chatHeader">
          <a href="/social">
            <img src={BackIcon} alt="Retour" />
            <p>Retour</p>
          </a>
          <p className="chatSenderName">Mazda MX3</p>
        </div>
        <div className="chatContent">
          <div className="chatSender">
            <div className="chatSenderContent">
              <p>
                Salut mec, ta caisse est vraiment cool ! Tu es de quelle région
                ? On pourrait peut-être rouler ensemble.
              </p>
            </div>
            <div className="chatSenderDate">
              <p>05 sept 2022</p>
            </div>
          </div>
          <div className="chatRecepter">
            <div className="chatRecepterContent">
              <p>Salut, merci ! J'suis du Nord et toi ?</p>
            </div>
            <div className="chatRecepterDate">
              <p>05 sept 2022</p>
            </div>
          </div>
          <div className="chatSender">
            <div className="chatSenderContent">
              <p>
                Salut mec, ta caisse est vraiment cool ! Tu es de quelle région
                ? On pourrait peut-être rouler ensemble.
              </p>
            </div>
            <div className="chatSenderDate">
              <p>05 sept 2022</p>
            </div>
          </div>
          <div className="chatRecepter">
            <div className="chatRecepterContent">
              <p>Salut, merci ! J'suis du Nord et toi ?</p>
            </div>
            <div className="chatRecepterDate">
              <p>05 sept 2022</p>
            </div>
          </div>
          <div className="chatSender">
            <div className="chatSenderContent">
              <p>
                Salut mec, ta caisse est vraiment cool ! Tu es de quelle région
                ? On pourrait peut-être rouler ensemble.
              </p>
            </div>
            <div className="chatSenderDate">
              <p>05 sept 2022</p>
            </div>
          </div>
          <div className="chatRecepter">
            <div className="chatRecepterContent">
              <p>Salut, merci ! J'suis du Nord et toi ?</p>
            </div>
            <div className="chatRecepterDate">
              <p>05 sept 2022</p>
            </div>
          </div>
          <div className="chatSender">
            <div className="chatSenderContent">
              <p>
                Salut mec, ta caisse est vraiment cool ! Tu es de quelle région
                ? On pourrait peut-être rouler ensemble.
              </p>
            </div>
            <div className="chatSenderDate">
              <p>05 sept 2022</p>
            </div>
          </div>
          <div className="chatRecepter">
            <div className="chatRecepterContent">
              <p>Salut, merci ! J'suis du Nord et toi ?</p>
            </div>
            <div className="chatRecepterDate">
              <p>05 sept 2022</p>
            </div>
          </div>
        </div>

        <div className="chatTyper">
          <input placeholder="écrivez quelques chose..."></input>
        </div>
      </div>
    </div>
  );
}
