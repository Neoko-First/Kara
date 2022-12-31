import React, { useState } from "react";

export default function Slider() {
  const pictures = ["del_sol1.jpg", "del_sol2.jpg", "del_sol3.jpg"];
  const [picCount, setPicCount] = useState(pictures.length);
  const [swipeState, setSwipeState] = useState(0);
  const [sliderSwipe, setSliderSwipe] = useState({
    transform: `translate(-${0}%)`,
  });
  function handleSwipe(state) {
    if (state === "left") {
      console.log("nombre de slides : " + picCount);
      if (swipeState >= 0 && swipeState <= picCount - 1) {
        setSwipeState(swipeState - 1);
        setSliderSwipe({ transform: `translate(-${swipeState}00%)` });
        console.log("slides n° : " + swipeState);
      }
    } else if (state === "right") {
      console.log("nombre de slides : " + picCount - 1);
      if (swipeState >= 0 && swipeState <= picCount) {
        setSwipeState(swipeState + 1);
        setSliderSwipe({ transform: `translate(-${swipeState}00%)` });
        console.log("slides n° : " + swipeState);
      }
    }
  }

  return (
    <section className="sliderContainer">
      <div className="sliderBox">
        <div className="sliderCountPicturesBox">
          {pictures.map((picture) => (
            <div className="sliderCountPictures" key={picture}></div>
          ))}
        </div>
        <div className="sliderCards" style={sliderSwipe}>
          {pictures.map((picture) => (
            <div className="sliderCard" key={picture}>
              <img
                src={require("../../assets/pictures/" + picture)}
                alt={picture}
              />
            </div>
          ))}
        </div>
        <div className="sliderNavigator">
          <div className="slideLeft" onClick={() => handleSwipe("left")}></div>
          <div
            className="slideRight"
            onClick={() => handleSwipe("right")}
          ></div>
        </div>
        <div className="sliderInfosUser">
          <h2>Honda CRX Del Sol</h2>
          <p>1997</p>
          <p>160 cv</p>
        </div>
      </div>
    </section>
  );
}
