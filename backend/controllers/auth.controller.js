const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { signUpErrors, logInErrors } = require("../utils/errors.utils");

// durée de vie token et cookie contenant le token
const maxAge = 3 * 24 * 60 * 60 * 1000;

// crée un token unique
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

// controlleur d'inscription d'un utilisateur
module.exports.signup = async (req, res) => {
  const { pseudo, email, password } = req.body;

  try {
    const user = await UserModel.create({ pseudo, email, password });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = signUpErrors(err);
    res.status(200).send({ errors });
  }
};

// controlleur de connexion d'un utilisateur
module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    // crée un token unique
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = logInErrors(err);
    res.status(200).send({ errors });
  }
};

// controlleur de déconnexion d'un utilisateur
module.exports.logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
