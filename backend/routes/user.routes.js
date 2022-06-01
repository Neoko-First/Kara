const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const carController = require("../controllers/car.controller");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// user DB
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/like/:id", userController.like);

// Car infos
router.patch("/carPrimary/:id", carController.addCarPrimaryInfos);
router.patch("/carSecondary/:id", carController.addCarSecondaryInfos);

module.exports = router;
