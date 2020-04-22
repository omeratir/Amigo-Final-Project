const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  nameOfPlace: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  averageDaysOfPlace: { type: Number , required: false },
  destinationForSex: { type: Number, required: false },
  destinationForAges: { type: Number, required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Place", placeSchema);
