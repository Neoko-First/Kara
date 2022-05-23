// importe express
const express = require("express");

// importe les routes
const userRoutes = require("./routes/user.routes");

// crée une app express
const app = express();

// routes
app.use("/api/user", userRoutes);

// exporte l'app pour pouvoir l'utiliser dans les autres fichiers
module.exports = app;
