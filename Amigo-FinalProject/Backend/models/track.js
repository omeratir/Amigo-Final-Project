const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  hobbies: { type: String, required: true },
  purposeOfTheTrip: { type: String, required: true },
  sexRecommands: { type: Number, required: true },
  rangeAges: { type: Number, required: true },
  amountOfDays: { type: Number, required: true },
  amountOfLikes: { type: Number, required: true },
  listOfPlaces: {type: Array, require: true},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Track", placeSchema);
