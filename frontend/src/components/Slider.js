import React from "react";
import "../styles/Slider.scss";
import car from "../assets/del_sol.jpg";

// navigation : association d'url avec l'affichage front de pages différentes
const Slider = () => {
  return (
    <div className="sliderContainer">
      <div className="slider">
        <div className="numberOfPic">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <img src={car} alt="car" />
        <img src={car} alt="car" />
        <img src={car} alt="car" />
      </div>
    </div>
  );
};

export default Slider;
