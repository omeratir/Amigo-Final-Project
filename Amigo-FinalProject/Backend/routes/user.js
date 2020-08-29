const express = require("express");

const UserController = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/:id", UserController.getUser);

// router.put("/:id", checkAuth, UserController.updateUser);
router.put("/:id", checkAuth, extractFile, UserController.updateUser);

router.put("/updateuser/:id", checkAuth , UserController.updateUserData);

router.put("/update/:email", extractFile, UserController.UpdateUserByEmail);

router.get("/userfulldata/:id", UserController.getUserFullData);

module.exports = router;
