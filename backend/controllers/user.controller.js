const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

// obtenir les infos de tous les users
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

// Obtenir les infos d'un user
module.exports.userInfo = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }
  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log("ID inconnu : " + err);
    }
  }).select("-password");
};

// modifier les infos d'un user
module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          pseudo: req.body.pseudo,
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

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.like = async (req, res) => {
  if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToLike))
    return res.status(400).send("ID unknown : " + req.params.id);

  var idLiker;
  var idLiked;

  try {
    // add to the like list (liste des personne que le user courant like)
    // await UserModel.findByIdAndUpdate(
    //   req.params.id,
    //   { $addToSet: { likes: req.body.idToLike } },
    //   { new: true, upsert: true }
    // ).catch((err) => res.status(400).json(err));

    // // add to liked list (liste des personne que le user liké possède)
    // await UserModel.findByIdAndUpdate(
    //   req.body.idToLike,
    //   { $addToSet: { liked: req.params.id } },
    //   { new: true, upsert: true }
    // )
    //   // .then((docs) => res.send(docs))
    //   .catch((err) => res.status(400).json(err));

    // verrifier si il y a match, si oui, ajouter l'id de l'autre user dans matchs
    let ids = [req.params.id, req.body.idToLike];
    UserModel.find({ _id: { $in: ids } }, (err, docs) => {
      if (!err) {
        res.send(docs[0]);
      } else {
        console.log("ID inconnu : " + err);
      }
    }).select("-password");

    //
  } catch (err) {
    return res.status(500).json({ err });
  }
};
