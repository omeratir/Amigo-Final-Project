const express = require("express");

const RouteController = require("../controllers/routes");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, RouteController.createRoute);

router.put("/:id", checkAuth, extractFile, RouteController.updateRoute);

router.get("", RouteController.getRoutes);

router.get("/:id", RouteController.getRoute);

//router.post("iduser", checkAuth, extractFile, RouteController.getRoute);

router.delete("/:id", checkAuth, RouteController.deleteRoute);

module.exports = router;

