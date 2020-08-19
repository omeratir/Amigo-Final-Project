const Goal = require("../models/goal");

exports.createGoal = (req, res, next) => {
  const goal = new Goal({
    name: req.body.name,
    creator: req.userData.userId
  });
  goal
    .save()
    .then(createdGoal => {
      res.status(201).json({
        message: "Goal added successfully",
        goal: {
          ...createdGoal,
          id: createdGoal._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a goal failed!"
      });
    });
};

exports.getGoals = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const goalQuery = Goal.find();
  let fetchedGoals;
  if (pageSize && currentPage) {
    goalQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  goalQuery
    .then(documents => {
      fetchedGoals = documents;
      return Goal.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Goals fetched successfully!",
        goals: fetchedGoals,
        maxGoals: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching goals failed!"
      });
    });
};

exports.getGoal = (req, res, next) => {
  Goal.findById(req.params.id)
    .then(goal => {
      if (goal) {
        res.status(200).json(goal);
      } else {
        res.status(404).json({ message: "Goal not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching goal failed!"
      });
    });
};
