const mongoose = require("mongoose");

const kmeansSchema = mongoose.Schema({
  userID: { type: String, required: false },
  user_Class: {type: Number, required: false},

  //goals
  goal_Sport_And_Extreme: {type: Boolean, required: false},
  goal_Shopping: {type: Boolean, required: false},
  goal_Attractions_Leisure: {type: Boolean, required: false},
  goal_Night_Life: {type: Boolean, required: false},
  goal_Relaxing: {type: Boolean, required: false},
  goal_Culture_And_Historical_Places: {type: Boolean, required: false},

  vectors_Array: {type: Array, required: false}
});

module.exports = mongoose.model("Kmeans", kmeansSchema);


