const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// user DB
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/like/:id", userController.like);

module.exports = router;
