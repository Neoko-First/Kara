// importe express
const express = require("express");

// importe les routes
const userRoutes = require("./routes/user");

// crée une app express
const app = express();

// exporte l'app pour pouvoir l'utiliser dans les autres fichiers
module.exports = app;
