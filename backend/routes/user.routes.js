const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const uploadController = require("../controllers/upload.controller");
const carController = require("../controllers/car.controller");
const multer = require("multer");
const upload = multer();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

// user DB
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/like/:id", userController.like);

// upload
router.post("/upload", upload.single("file"), uploadController.uploadProfil);

// Car infos
router.put("/carPrimary/:id", carController.addCarPrimaryInfos);
router.put("/carSecondary/:id", carController.addCarSecondaryInfos);
router.put("/carPics/:id", carController.manageCarPics);

module.exports = router;
