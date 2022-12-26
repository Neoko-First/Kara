import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import "../styles/Slider.scss";

// navigation : association d'url avec l'affichage front de pages différentes
const Slider = () => {
  // const [countPic, setCountPic] = useState(0);

  const handleUnlike = () => {
    // document.getElementById("slider").style.transform = "rotate(-20deg)";
  };

  // const slideLeft = () => {
  //   if (countPic > 1) {
  //     setCountPic(countPic - 1);
  //   }
  //   console.log(countPic);
  //   var sliderBox = document
  //     .getElementById("sliderBox")
  //     .getElementsByTagName("li");

  //   for (const element of sliderBox) {
  //     element.style.transform = "translate3d(-" + countPic + "00%, 0px, 0px)";
  //   }
  // };

  // const slideRight = () => {
  //   if (countPic < 3) {
  //     setCountPic(countPic + 1);
  //     console.log(countPic);
  //     var sliderBox = document
  //       .getElementById("sliderBox")
  //       .getElementsByTagName("li");

  //     for (const element of sliderBox) {
  //       element.style.transform = "translate3d(-" + countPic + "00%, 0px, 0px)";
  //     }
  //   }
  // };

  return (
    <div className="sliderContainer">
      <div className="slider" id="slider">
        {/* <div className="numberOfPic">
          <div></div>
          <div></div>
          <div></div>
        </div> */}
        {/* <div className="sliderControl">
          <div className="slideLeft" onClick={slideLeft}></div>
          <div className="slideRight" onClick={slideRight}></div>
        </div> */}
        <Carousel transitionTime="150" infiniteLoop="true">
          <div>
            <img src={require("../assets/del_sol1.jpg")} alt="car" />{" "}
          </div>
          <div>
            <img src={require("../assets/del_sol2.jpg")} alt="car" />{" "}
          </div>
          <div>
            <img src={require("../assets/del_sol3.jpg")} alt="car" />{" "}
          </div>
        </Carousel>
        {/* <ul id="sliderBox">
          <li>
            <img src={require("../assets/del_sol1.jpg")} alt="car" />
          </li>
          <li>
            <img src={require("../assets/del_sol2.jpg")} alt="car" />
          </li>
          <li>
            <img src={require("../assets/del_sol3.jpg")} alt="car" />
          </li>
        </ul> */}
        <div className="infoCar">
          <div className="titleCar">
            <h2>Honda CRX Del Sol</h2>
            <button>
              <i className="fas fa-info-circle"></i>
            </button>
          </div>
          <p>1997</p>
          <p>120 cv</p>
          <p>5 cv fiscaux</p>
        </div>
      </div>
      <div className="actionOnCar">
        <button onClick={handleUnlike}>
          <i className="fas fa-times"></i>
        </button>
        <button>
          <i className="fas fa-heart"></i>
        </button>
      </div>
    </div>
  );
};

export default Slider;
