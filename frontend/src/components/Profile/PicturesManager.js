import { useSelector } from "react-redux";
import React, { useState } from "react";

// navigation : association d'url avec l'affichage front de pages différentes
const PicturesManager = () => {
  const userData = useSelector((state) => state.userReducer);
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
            {userData.carPics.img1 ? (
              <>
                <div className="deletePicBtn">
                  <i className="fas fa-times"></i>
                </div>
                <img
                  src={require(`../../../public/uploads/profils/${userData.carPics.img1}`)}
                  alt="car"
                />{" "}
              </>
            ) : (
              <div className="addPicBtn">
                <i className="fas fa-plus"></i>
              </div>
            )}
            <input
              type="file"
              id="file"
              name="img1"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="pictureCard">
            {userData.carPics.img2 ? (
              <>
                <div className="deletePicBtn">
                  <i className="fas fa-times"></i>
                </div>
                <img
                  src={require(`../../../public/uploads/profils/${userData.carPics.img2}`)}
                  alt="car"
                />
              </>
            ) : (
              <div className="addPicBtn">
                <i className="fas fa-plus"></i>
              </div>
            )}
            <input
              type="file"
              id="file"
              name="img2"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="pictureCard">
            {userData.carPics.img3 ? (
              <>
                <div className="deletePicBtn">
                  <i class="fas fa-times"></i>
                </div>
                <img
                  src={require(`../../../public/uploads/profils/${userData.carPics.img3}`)}
                  alt="car"
                />
              </>
            ) : (
              <div className="addPicBtn">
                <i className="fas fa-plus"></i>
              </div>
            )}
            <input
              type="file"
              id="file"
              name="img2"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="pictureCard">
            {userData.carPics.img4 ? (
              <>
                <div className="deletePicBtn">
                  <i className="fas fa-times"></i>
                </div>
                <img
                  src={require(`../../../public/uploads/profils/${userData.carPics.img4}`)}
                  alt="car"
                />
              </>
            ) : (
              <div className="addPicBtn">
                <i className="fas fa-plus"></i>
              </div>
            )}
            <input
              type="file"
              id="file"
              name="img2"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="pictureCard">
            {userData.carPics.img5 ? (
              <>
                <div className="deletePicBtn">
                  <i className="fas fa-times"></i>
                </div>
                <img
                  src={require(`../../../public/uploads/profils/${userData.carPics.img5}`)}
                  alt="car"
                />
              </>
            ) : (
              <div className="addPicBtn">
                <i className="fas fa-plus"></i>
              </div>
            )}
            <input
              type="file"
              id="file"
              name="img2"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="pictureCard">
            {userData.carPics.img6 ? (
              <>
                <div className="deletePicBtn">
                  <i className="fas fa-times"></i>
                </div>
                <img
                  src={require(`../../../public/uploads/profils/${userData.carPics.img6}`)}
                  alt="car"
                />
              </>
            ) : (
              <div className="addPicBtn">
                <i className="fas fa-plus"></i>
              </div>
            )}
            <input
              type="file"
              id="file"
              name="img2"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>
        <input type="submit" value="Enregistrer" />
      </form>
    </div>
  );
};

export default PicturesManager;
