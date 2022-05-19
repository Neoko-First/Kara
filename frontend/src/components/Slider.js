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
        <div className="infoCar">
          <div className="titleCar">
            <h2>Honda CRX Del Sol</h2>
            <button>
              <i class="fas fa-info-circle"></i>
            </button>
          </div>
          <p>1997</p>
          <p>120 cv</p>
          <p>5 cv fiscaux</p>
        </div>
        <div className="actionOnCar">
          <button>
            <i class="fas fa-times"></i>
          </button>
          <button>
            <i class="fas fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slider;
