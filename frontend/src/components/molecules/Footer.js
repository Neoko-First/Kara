import React from 'react'
import CarIcon from "../../assets/car-solid.svg";
import MessageIcon from "../../assets/comments-solid.svg";

export default function z() {
  return (
    <footer>
      <a href="/">
        <img src={CarIcon} alt="Accueil" />
      </a>
      <a href="/social">
        <img src={MessageIcon} alt="Sociale" />
      </a>
    </footer>
  );
}
