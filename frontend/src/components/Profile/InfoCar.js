import React, { useState } from "react";
import { useSelector } from "react-redux";

// navigation : association d'url avec l'affichage front de pages différentes
const InfoCar = () => {
  const userData = useSelector((state) => state.userReducer);
  const [moreInfo, setMoreInfo] = useState(false);

  return (
    <div className="infoCarContainer">
      <p>Informations véhicule</p>
      <form>
        <div>
          <label>
            Marque <span>*</span>
          </label>
          <input
            type="text"
            placeholder="Honda..."
            value={userData.carprimary.brand}
          ></input>
        </div>
        <div>
          <label>
            Modèle <span>*</span>
          </label>
          <input
            type="text"
            placeholder="Del Sol..."
            value={userData.carprimary.model}
          ></input>
        </div>
        <div>
          <label>
            Mise en circulation <span>*</span>
          </label>
          <input type="number" value={userData.carprimary.date}></input>
        </div>
        <div>
          <label>
            Kilométrage <span>*</span>
          </label>
          <input type="number" value={userData.carprimary.kilometer}></input>
        </div>
        <div>
          <label>
            Puissance DIN <span>*</span>
          </label>
          <input type="number" value={userData.carprimary.cvdin} />{" "}
        </div>
        <div>
          <label>
            Puissance fiscale <span>*</span>
          </label>
          <input type="number" value={userData.carprimary.cvfisc} />
        </div>
        <div className="buttonMoreInfo">
          <p onClick={() => setMoreInfo(!moreInfo)}>
            Informations supplémentaires
          </p>
        </div>
        {moreInfo && (
          <>
            <div>
              <label>Carburant</label>
              <select>
                <option>Essence</option>
                <option>Ethanol</option>
                <option>Diesel</option>
                <option>Hybride</option>
                <option>Électrique</option>
                <option>GPL</option>
                <option>Hyrdogène</option>
              </select>
            </div>
            <div>
              <label>Boîte de vitesse</label>
              <select>
                <option>Manuelle</option>
                <option>Automatique</option>
                <option>Séquentielle</option>
              </select>
            </div>
            <div>
              <label>Nombre de portes</label>
              <input type="number"></input>
            </div>
            <div>
              <label>Nombre de places</label>
              <input type="number"></input>
            </div>
            <div>
              <label>Couleur</label>
              <input type="text"></input>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default InfoCar;
