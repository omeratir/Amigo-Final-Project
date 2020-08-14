const express = require("express");

const PlaceController = require("../controllers/places");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("/", checkAuth, extractFile, PlaceController.createPlace);

router.put("/:id", checkAuth, extractFile, PlaceController.updatePlace);

router.put("/updateuser/:id", checkAuth, extractFile, PlaceController.updateUser);

router.get("", PlaceController.getPlaces);

router.get("/:id", PlaceController.getPlace);

router.put("/kmeans/:id",checkAuth,  PlaceController.kmeans);

router.get("/kmeans2/:id",checkAuth,  PlaceController.kmeansGet);

router.delete("/:id", checkAuth, PlaceController.deletePlace);

router.get("/all", PlaceController.getAllPlaces);

module.exports = router;
