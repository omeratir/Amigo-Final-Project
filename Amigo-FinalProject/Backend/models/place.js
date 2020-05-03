const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: String , required: true },
  lng: { type: String , required: true },

  count_of_post_added_to_place: {type: Number},
  place_for_gender: {type: Number},
  avg_rate_of_place: {type: Number},
  avg_hours_of_place: {type: Number},
  avg_ages_of_place: {type: Number},
  hobbies: {type: Number},
  purpose_of_place: {type: Number},

  kmean_x : {type : Number },
  kmean_y : {type : Number },

  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Place", placeSchema);
