// importe express
const express = require("express");

// ajout de body parser
const bodyParser = require("body-parser");
// ajout de cookie parser
const cookieParser = require("cookie-parser");

// importe les routes
const userRoutes = require("./routes/user.routes");

const { checkUser, requireAuth } = require("./middleware/auth.middleware");

// crée une app express
const app = express();

// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => {
  // on indique que les ressources peuvent être partagées depuis n'importe quelle origine
  res.setHeader("Access-Control-Allow-Origin", "*");
  // on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // on indique les méthodes autorisées pour les requêtes HTTP
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

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
