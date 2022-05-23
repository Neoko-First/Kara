const router = require("express").Router();
const authController = require("../controllers/auth.controller");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
// router.post("/getAllUsers", userController.getAllUsers);
// router.post("/getOneUser", userController.getOneUser);
// router.post("/updateUser", userController.updateUser);
// router.post("/disableUser", userController.disableUser);

module.exports = router;
