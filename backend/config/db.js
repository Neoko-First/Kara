const mongoose = require("mongoose");

// définit l'accès à la BDD MongoDB (utilise les var d'env pour ne pas transmettre les logs de connexion en clair dans le code)
mongoose
  .connect(
    "mongodb+srv://Alexandre:1103@cluster0.z0j9x.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
