const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  lat: { type: String , required: true },
  lng: { type: String , required: true },
  avgOfStars: { type: Number , required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Place", placeSchema);
