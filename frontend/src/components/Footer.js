import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Footer.scss";

// navigation : association d'url avec l'affichage front de pages différentes
const Footer = () => {
  return (
    <footer>
      <NavLink exact="true" to="/">
        <button>
          <i className="fas fa-car"></i>
        </button>
      </NavLink>
      <NavLink exact="true" to="/Socials">
        <button>
          <i className="fas fa-comments"></i>
        </button>
      </NavLink>
    </footer>
  );
};

export default Footer;
