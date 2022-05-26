// importe express
const express = require("express");

// ajout de body parser
const bodyParser = require("body-parser");

// importe les routes
const userRoutes = require("./routes/user.routes");

// crée une app express
const app = express();

// traite la data qui transite
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/api/user", userRoutes);

// exporte l'app pour pouvoir l'utiliser dans les autres fichiers
module.exports = app;
