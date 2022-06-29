const UserModel = require("../models/user.model");

module.exports.uploadProfil = async (req, res) => {
  try {
    await UserModel.findByIdAndUpdate(
      req.body.userId,
      {
        $set: {
          carPics: {
            img1: req.file.filename,
          },
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
