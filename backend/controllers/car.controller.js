const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

// Ajout des infos primaires d'une voiture
module.exports.addCarPrimaryInfos = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          carprimary: {
            brand: req.body.brand,
            model: req.body.model,
            date: req.body.date,
            kilometer: req.body.kilometer,
            cvdin: req.body.cvdin,
            cvfisc: req.body.cvfisc,
          },
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// Ajout des infos secondaire d'une voiture
module.exports.addCarSecondaryInfos = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          carsecondary: {
            location: req.body.location,
            energy: req.body.energy,
            gearbox: req.body.gearbox,
            door: req.body.door,
            places: req.body.places,
            color: req.body.color,
          },
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// Ajout des infos secondaire d'une voiture
module.exports.manageCarPics = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          carPics: {
            img1: req.body.img1,
            img2: req.body.img2,
            img3: req.body.img3,
            img4: req.body.img4,
            img5: req.body.img5,
            img6: req.body.img6,
          },
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
