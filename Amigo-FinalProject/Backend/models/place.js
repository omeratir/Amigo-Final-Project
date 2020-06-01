const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: String , required: true },
  lng: { type: String , required: true },
  goal: { type: String , required: false },
  genbder_avg: { type: Number , required: false },
  count_of_likes: { type: Number , required: false },
  avg_age: { type: Number , required: false },
  count_sport: { type: Number , required: false },
  count_culture: { type: Number , required: false },
  count_food: { type: Number , required: false },
  count_female: { type: Number , required: false },
  count_male: { type: Number , required: false },
  avg_sport: { type: Number , required: false },
  avg_culture: { type: Number , required: false },
  avg_food: { type: Number , required: false },
  count_of_post_added_to_place: {type: Number, required: false},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  // NO NEED ANYMORE:

  // place_for_gender: {type: Number, required: false },
  // sum_place_for_gender: {type: Number, required: false},
  // sum_place_for_age: {type: Number, required: false},
  // sum_place_for_purpose: {type: Number, required: false},
  // avg_rate_of_place: {type: Number},
  // avg_hours_of_place: {type: Number},
  // avg_ages_of_place: {type: Number},
  // hobbies: {type: Number, required: false},
  // purpose_of_place: {type: Number},
  // kmean_x : {type : Number },
  // kmean_y : {type : Number },
});

module.exports = mongoose.model("Place", placeSchema);
