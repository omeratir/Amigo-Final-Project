const express = require("express");

const PlaceController = require("../controllers/places");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("/", checkAuth, extractFile, PlaceController.createPlace);

router.put("/:id", checkAuth, extractFile, PlaceController.updatePlace);

router.get("", PlaceController.getPlaces);

router.get("/all", PlaceController.getAllPlaces);

router.get("/:id", PlaceController.getPlace);

router.delete("/:id", checkAuth, PlaceController.deletePlace);

module.exports = router;
