module.exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };

  if (err.message.includes("pseudo"))
    errors.pseudo = "Pseudo incorrect ou déjà pris";

  if (err.message.includes("email"))
    errors.email = "Email incorrect ou déjà pris";

  if (err.message.includes("password"))
    errors.password = "Votre mot de passe doit faire 6 caractère minimum";

  // code erreur renvoyé par mongo lorsqu'un élément unique est déjà utilisé
  if (err.code === 11000) errors.email = "Cet email est déjà enregistré";

  return errors;
};

module.exports.logInErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message.includes("email")) errors.email = "Email inconnu";

  if (err.message.includes("password"))
    errors.password = "Le mot de passe ne correspond pas";

  return errors;
};

module.exports.uploadErrors = (err) => {
  let errors = { format: "", maxSize: "" };

  if (err.message.includes("invalid file"))
    errors.format = "Format incompatible";

  if (err.message.includes("max size"))
    errors.maxSize = "Le fichier dépasse 500ko";

  return errors;
};
