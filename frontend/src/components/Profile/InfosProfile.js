import React from "react";
import settingIcon from "../../assets/setting.svg";
import addIcon from "../../assets/add.svg";

export default function InfosProfile() {
  return (
    <div className="infosProfileContainer">
      <div className="infosProfileBox">
        <div className="infosProfilePicture">
          <img
            src={require("../../assets/pictures/del_sol1.jpg")}
            alt="Utilisateur"
          />
          <div className="infosProfileSetting">
            <a href="/settings">
              <img src={settingIcon} alt="settings" />
            </a>
          </div>
        </div>
        <div className="infosProfileName">
          <p>Honda Del Sol CRX</p>
        </div>
        <div className="infosProfileAlbum">
          <p>Album</p>
          <span>Ne divulguez pas votre immatriculation</span>
          <div className="infosProfileAlbumGrid">
            <div>
              <div className="addPictureBtn">
                <img src={addIcon} alt="Ajouter une photo" />
              </div>
              <div className="pictureVisualizer">
                <img
                  src={require("../../assets/pictures/del_sol1.jpg")}
                  alt="Utilisateur"
                />
              </div>
            </div>
            <div>
              <div className="addPictureBtn">
                <img src={addIcon} alt="Ajouter une photo" />
              </div>
              <div className="pictureVisualizer">
                <img
                  src={require("../../assets/pictures/del_sol2.jpg")}
                  alt="Utilisateur"
                />
              </div>
            </div>
            <div>
              <div className="addPictureBtn">
                <img src={addIcon} alt="Ajouter une photo" />
              </div>
              <div className="pictureVisualizer">
                <img
                  src={require("../../assets/pictures/del_sol3.jpg")}
                  alt="Utilisateur"
                />
              </div>
            </div>
            <div>
              <div className="addPictureBtn">
                <img src={addIcon} alt="Ajouter une photo" />
              </div>
            </div>
            <div>
              <div className="addPictureBtn">
                <img src={addIcon} alt="Ajouter une photo" />
              </div>
            </div>
            <div>
              <div className="addPictureBtn">
                <img src={addIcon} alt="Ajouter une photo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
