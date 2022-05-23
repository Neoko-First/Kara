const UserModel = require("../models/user.model");

// controlleur d'inscription d'un utilisateur
exports.signup = async (req, res, next) => {
  const { pseudo, email, password } = req.body;

  try {
    const user = await UserModel.create({ pseudo, email, password });
    res.status(201).json({ user: user._id });
  } catch (err) {
    res.status(200).json({
      err,
    });
  }
};

// controlleur de connexion d'un utilisateur
exports.login = async (req, res, next) => {};

// controlleur de déconnexion d'un utilisateur
exports.logout = async (req, res, next) => {};

// controller de récupération de tout les users
exports.getAllUsers = async (req, res, next) => {};

// controller de récupération d'un user
exports.getOneUser = async (req, res, next) => {};

// controller de modification d'un user
exports.updateUser = async (req, res, next) => {};

// controller de désactivation d'un user
exports.disableUser = async (req, res, next) => {};
