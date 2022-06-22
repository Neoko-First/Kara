import React, { useState } from "react";

// navigation : association d'url avec l'affichage front de pages différentes
const PicturesManager = () => {
  const [file, setFile] = useState();
  const handlePicture = (e) => {
    e.preventDefault();
  };

  return (
    <div className="picturesManagerContainer">
      <p>Photos</p>
      <span>Ne montrez pas votre plaque d'immatriculation</span>
      <form action="" onSubmit={handlePicture} className="picturesManager">
        <div className="picturesManagerGrid">
          <div className="pictureCard">
            <i className="fas fa-times-circle"></i>
            <img src={require("../../assets/del_sol1.jpg")} alt="car" />
            <input
              type="file"
              id="file"
              name="img1"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="pictureCard">
            <img src={require("../../assets/del_sol2.jpg")} alt="car" />
            <input
              type="file"
              id="file"
              name="img2"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="pictureCard">
            <img src={require("../../assets/del_sol3.jpg")} alt="car" />
            <input
              type="file"
              id="file"
              name="img2"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="pictureCard">
            <input
              type="file"
              id="file"
              name="img2"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <i className="fas fa-plus-circle"></i>
          </div>
          <div className="pictureCard">
            <input
              type="file"
              id="file"
              name="img2"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <i className="fas fa-plus-circle"></i>
          </div>
          <div className="pictureCard">
            <input
              type="file"
              id="file"
              name="img2"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <i className="fas fa-plus-circle"></i>
          </div>
        </div>
        <input type="submit" value="Enregistrer" />
      </form>
    </div>
  );
};

export default PicturesManager;
