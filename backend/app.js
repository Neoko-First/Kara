// importe express
const express = require("express");

// ajout de body parser
const bodyParser = require("body-parser");
// ajout de cookie parser
const cookieParser = require("cookie-parser");

// importe les routes
const userRoutes = require("./routes/user.routes");

require('dotenv').config({path: './config/.env'});

const { checkUser, requireAuth } = require("./middleware/auth.middleware");

const cors = require("cors");

// crée une app express
const app = express();

// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}
app.use(cors(corsOptions));

// lire le corps des requêtes
app.use(bodyParser.json());
// lire le contenu des url
app.use(bodyParser.urlencoded({ extended: true }));
// lire les cookies
app.use(cookieParser());

// jwt
app.get("*", checkUser); //verif à chaque page si user connecté
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
}); //verif si infos user dispo en cookie pour reconnecter automatiquement

// routes
app.use("/api/user", userRoutes);

// exporte l'app pour pouvoir l'utiliser dans les autres fichiers
module.exports = app;
