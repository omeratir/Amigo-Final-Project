const express = require("express");

const TrackController = require("../controllers/tracks");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("/", checkAuth, extractFile, TrackController.createTrack);

router.put("/:id", checkAuth, extractFile, TrackController.updateTrack);

router.get("", TrackController.getTrack);

router.get("/:id", TrackController.getTrack);

// router.delete("/:id", checkAuth, TrackController.deleteTrack);

module.exports = router;
