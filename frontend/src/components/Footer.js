import React from "react";
import "../styles/Footer.scss";

// navigation : association d'url avec l'affichage front de pages différentes
const Footer = () => {
  return (
    <footer>
      <button>
        <i class="fas fa-car"></i>
      </button>
      <button>
        <i class="fas fa-comments"></i>
      </button>
    </footer>
  );
};

export default Footer;
