const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: String , required: true },
  lng: { type: String , required: true },
  goal: { type: String , required: false },

  users_array: {type: String, required: false},
  gender_avg: { type: Number , required: false },
  count_of_likes: { type: Number , required: false },
  count_of_place_likes: { type: Number , required: false },
  count_of_place_unlikes: { type: Number , required: false },

  count_sport: { type: Number , required: false },
  count_culture: { type: Number , required: false },
  count_food: { type: Number , required: false },

  count_female: { type: Number , required: false },
  count_male: { type: Number , required: false },

  avg_sport: { type: Number , required: false },
  avg_culture: { type: Number , required: false },
  avg_food: { type: Number , required: false },

  count_of_post_added_to_place: {type: Number, required: false},

  //age
  count_age20: { type: Number, required: false },
  count_age35: { type: Number, required: false },
  count_age50: { type: Number, required: false },
  count_age120: { type: Number, required: false },

  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  photo: { type: String, required: false },
});

module.exports = mongoose.model("Place", placeSchema);
