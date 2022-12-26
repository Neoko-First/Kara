import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { uploadPictures } from "../../actions/user.action";

// navigation : association d'url avec l'affichage front de pages différentes
const PicturesManager = () => {
  const userData = useSelector((state) => state.userReducer);
  // hook permettant de renseigner le FICHIER pour l'envoyer au back ensuite
  const [img1, setImg1] = useState();
  const [img2, setImg2] = useState();
  const [img3, setImg3] = useState();
  const [img4, setImg4] = useState();
  const [img5, setImg5] = useState();
  const [img6, setImg6] = useState();
  // hook permettant d'obtenir une illustration (en front) de l'image séléctionné par le user
  const [img1Illustration, setImg1Illustration] = useState();
  const [img2Illustration, setImg2Illustration] = useState();
  const [img3Illustration, setImg3Illustration] = useState();
  const [img4Illustration, setImg4Illustration] = useState();
  const [img5Illustration, setImg5Illustration] = useState();
  const [img6Illustration, setImg6Illustration] = useState();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  // lorsque les photo sont chargés, on "autorise le chargement du front"
  useEffect(() => {
    userData.carPics != undefined && setIsLoading(false);
  }, [userData]);

  const handlePicture = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("userId", userData._id);
    data.append("img1", img1);

    dispatch(uploadPictures(data, userData._id));
  };

  return (
    <div className="picturesManagerContainer">
      <p>Photos</p>
      <span>Ne montrez pas votre plaque d'immatriculation</span>
      <form action="" onSubmit={handlePicture} className="picturesManager">
        <div className="picturesManagerGrid">
          <div className="pictureCard">
            {/* patiente le temps que la data soit bien chargée pour afficher le front */}
            {!isLoading ? (
              <>
                {/* une fois data chargée, si img1 existe et que le user n'a pas choisi de nouvelle image, on affiche img1 */}
                {userData.carPics.img1 && !img1Illustration && (
                  <>
                    <div className="deletePicBtn">
                      <i className="fas fa-times"></i>
                    </div>
                    <img
                      src={require(`../../../public/uploads/profils/${userData.carPics.img1}`)}
                      alt="car"
                    />
                  </>
                )}
                {/* si le user à choisi une nouvelle image à upload, alors on affiche son illustration en front */}
                {img1Illustration && (
                  <>
                    <div className="deletePicBtn">
                      <i className="fas fa-save"></i>
                    </div>
                    <img src={img1Illustration} alt="" />
                  </>
                )}
                {/* si img1 ne contient rien, on affiche pas d'image */}
                {!userData.carPics.img1 && !img1Illustration && (
                  <div className="addPicBtn">
                    <i className="fas fa-plus"></i>
                  </div>
                )}
              </>
            ) : (
              <div className="addPicBtn">
                <i className="fas fa-spinner fa-pulse"></i>
              </div>
            )}
            <input
              type="file"
              id="img1"
              name="img1"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => {
                setImg1(e.target.files[0]);
                setImg1Illustration(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
          <div className="pictureCard">
            {/* patiente le temps que la data soit bien chargée pour afficher le front */}
            {!isLoading ? (
              <>
                {/* une fois data chargée, si img1 existe et que le user n'a pas choisi de nouvelle image, on affiche img1 */}
                {userData.carPics.img2 && !img2Illustration && (
                  <>
                    <div className="deletePicBtn">
                      <i className="fas fa-times"></i>
                    </div>
                    <img
                      src={require(`../../../public/uploads/profils/${userData.carPics.img2}`)}
                      alt="car"
                    />
                  </>
                )}
                {/* si le user à choisi une nouvelle image à upload, alors on affiche son illustration en front */}
                {img2Illustration && (
                  <>
                    <div className="deletePicBtn">
                      <i className="fas fa-save"></i>
                    </div>
                    <img src={img2Illustration} alt="" />
                  </>
                )}
                {/* si img1 ne contient rien, on affiche pas d'image */}
                {!userData.carPics.img2 && !img2Illustration && (
                  <div className="addPicBtn">
                    <i className="fas fa-plus"></i>
                  </div>
                )}
              </>
            ) : (
              <div className="addPicBtn">
                <i className="fas fa-spinner fa-pulse"></i>
              </div>
            )}
            <input
              type="file"
              id="img2"
              name="img2"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => {
                setImg2(e.target.files[0]);
                setImg2Illustration(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
          <div className="pictureCard">
            {/* patiente le temps que la data soit bien chargée pour afficher le front */}
            {!isLoading ? (
              <>
                {/* une fois data chargée, si img1 existe et que le user n'a pas choisi de nouvelle image, on affiche img1 */}
                {userData.carPics.img3 && !img3Illustration && (
                  <>
                    <div className="deletePicBtn">
                      <i className="fas fa-times"></i>
                    </div>
                    <img
                      src={require(`../../../public/uploads/profils/${userData.carPics.img3}`)}
                      alt="car"
                    />
                  </>
                )}
                {/* si le user à choisi une nouvelle image à upload, alors on affiche son illustration en front */}
                {img3Illustration && (
                  <>
                    <div className="deletePicBtn">
                      <i className="fas fa-save"></i>
                    </div>
                    <img src={img3Illustration} alt="" />
                  </>
                )}
                {/* si img1 ne contient rien, on affiche pas d'image */}
                {!userData.carPics.img3 && !img3Illustration && (
                  <div className="addPicBtn">
                    <i className="fas fa-plus"></i>
                  </div>
                )}
              </>
            ) : (
              <div className="addPicBtn">
                <i className="fas fa-spinner fa-pulse"></i>
              </div>
            )}
            <input
              type="file"
              id="img3"
              name="img3"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => {
                setImg3(e.target.files[0]);
                setImg3Illustration(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
          <div className="pictureCard">
            {/* patiente le temps que la data soit bien chargée pour afficher le front */}
            {!isLoading ? (
              <>
                {/* une fois data chargée, si img1 existe et que le user n'a pas choisi de nouvelle image, on affiche img1 */}
                {userData.carPics.img4 && !img4Illustration && (
                  <>
                    <div className="deletePicBtn">
                      <i className="fas fa-times"></i>
                    </div>
                    <img
                      src={require(`../../../public/uploads/profils/${userData.carPics.img4}`)}
                      alt="car"
                    />
                  </>
                )}
                {/* si le user à choisi une nouvelle image à upload, alors on affiche son illustration en front */}
                {img4Illustration && (
                  <>
                    <div className="deletePicBtn">
                      <i className="fas fa-save"></i>
                    </div>
                    <img src={img4Illustration} alt="" />
                  </>
                )}
                {/* si img1 ne contient rien, on affiche pas d'image */}
                {!userData.carPics.img4 && !img4Illustration && (
                  <div className="addPicBtn">
                    <i className="fas fa-plus"></i>
                  </div>
                )}
              </>
            ) : (
              <div className="addPicBtn">
                <i className="fas fa-spinner fa-pulse"></i>
              </div>
            )}
            <input
              type="file"
              id="img4"
              name="img4"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => {
                setImg4(e.target.files[0]);
                setImg4Illustration(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
          <div className="pictureCard">
            {/* patiente le temps que la data soit bien chargée pour afficher le front */}
            {!isLoading ? (
              <>
                {/* une fois data chargée, si img1 existe et que le user n'a pas choisi de nouvelle image, on affiche img1 */}
                {userData.carPics.img5 && !img5Illustration && (
                  <>
                    <div className="deletePicBtn">
                      <i className="fas fa-times"></i>
                    </div>
                    <img
                      src={require(`../../../public/uploads/profils/${userData.carPics.img5}`)}
                      alt="car"
                    />
                  </>
                )}
                {/* si le user à choisi une nouvelle image à upload, alors on affiche son illustration en front */}
                {img5Illustration && (
                  <>
                    <div className="deletePicBtn">
                      <i className="fas fa-save"></i>
                    </div>
                    <img src={img5Illustration} alt="" />
                  </>
                )}
                {/* si img1 ne contient rien, on affiche pas d'image */}
                {!userData.carPics.img5 && !img5Illustration && (
                  <div className="addPicBtn">
                    <i className="fas fa-plus"></i>
                  </div>
                )}
              </>
            ) : (
              <div className="addPicBtn">
                <i className="fas fa-spinner fa-pulse"></i>
              </div>
            )}
            <input
              type="file"
              id="img5"
              name="img5"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => {
                setImg5(e.target.files[0]);
                setImg5Illustration(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
          <div className="pictureCard">
            {/* patiente le temps que la data soit bien chargée pour afficher le front */}
            {!isLoading ? (
              <>
                {/* une fois data chargée, si img1 existe et que le user n'a pas choisi de nouvelle image, on affiche img1 */}
                {userData.carPics.img6 && !img6Illustration && (
                  <>
                    <div className="deletePicBtn">
                      <i className="fas fa-times"></i>
                    </div>
                    <img
                      src={require(`../../../public/uploads/profils/${userData.carPics.img6}`)}
                      alt="car"
                    />
                  </>
                )}
                {/* si le user à choisi une nouvelle image à upload, alors on affiche son illustration en front */}
                {img6Illustration && (
                  <>
                    <div className="deletePicBtn">
                      <i className="fas fa-save"></i>
                    </div>
                    <img src={img6Illustration} alt="" />
                  </>
                )}
                {/* si img1 ne contient rien, on affiche pas d'image */}
                {!userData.carPics.img6 && !img6Illustration && (
                  <div className="addPicBtn">
                    <i className="fas fa-plus"></i>
                  </div>
                )}
              </>
            ) : (
              <div className="addPicBtn">
                <i className="fas fa-spinner fa-pulse"></i>
              </div>
            )}
            <input
              type="file"
              id="img6"
              name="img6"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => {
                setImg6(e.target.files[0]);
                setImg6Illustration(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
        </div>
        {(img1Illustration ||
          img2Illustration ||
          img3Illustration ||
          img4Illustration ||
          img5Illustration ||
          img6Illustration) && <input type="submit" value="Enregistrer" />}
      </form>
    </div>
  );
};

export default PicturesManager;
