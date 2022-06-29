// importe le module multer une fois installé (npm install --save multer)
const multer = require("multer");
// retour erreur lisible au client
const { uploadErrors } = require("../utils/errors.utils");

// configuration, qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants
const storage = multer.diskStorage({
  // indique à multer d'enregistrer les fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, "../frontend/public/uploads/profils");
  },
  // indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier
  filename: (req, file, callback) => {
    // définit le nom de fichier
    callback(null, req.body.userId + "_img1.jpg");
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
  limits: { fileSize: 1000000 },
});

// exporte multer une fois configuré. Lui indique que nous génerons uniquement les téléchargements de fichiers image
module.exports = upload;
