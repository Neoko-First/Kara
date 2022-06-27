const UserModel = require("../models/user.model");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const { uploadErrors } = require("../utils/errors.utils");

module.exports.uploadProfil = async (req, res) => {
  try {
    // verrification du format (jpg, png, jpeg)
    if (
      req.file.mimetype != "image/jpg" &&
      req.file.mimetype != "image/png" &&
      req.file.mimetype != "image/jpeg"
    )
      throw Error("invalid file");

    // verrification de la taille (max 500ko, à débatre)
    if (req.file.size > 1000000) throw Error("max size");
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(201).json(errors); 
  }

  // définition du nom du fichier (idéal : id + img{1,2,3,...})
  const fileName = req.body.name + ".jpg";

  console.log(req.file);

  // // stockage sur la partie statique
  // await pipeline(
  //   req.file.stream,
  //   fs.createWriteStream(
  //     `${__dirname}/../frontend/public/uploads/profils/${fileName}`
  //   )
  // );
};
