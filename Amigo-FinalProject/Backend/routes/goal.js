const express = require("express");

const GoalController = require("../controllers/goals");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth , GoalController.createGoal);

router.get("", GoalController.getGoals);

router.get("/:id", GoalController.getGoal);

module.exports = router;
