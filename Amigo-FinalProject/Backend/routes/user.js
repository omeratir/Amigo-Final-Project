const express = require("express");

const UserController = require("../controllers/user");

const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/:id", UserController.getUser);

router.put("/:id", checkAuth, extractFile, UserController.updateUser);

module.exports = router;
