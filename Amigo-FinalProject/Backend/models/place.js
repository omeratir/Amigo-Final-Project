const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: String , required: true },
  lng: { type: String , required: true },

  count_of_post_added_to_place: {type: Number, required: false},
  place_for_gender: {type: Number, required: false },
  sum_place_for_gender: {type: Number, required: false},
  avg_rate_of_place: {type: Number},
  avg_hours_of_place: {type: Number},
  avg_ages_of_place: {type: Number},
  hobbies: {type: Number, required: false},
  purpose_of_place: {type: Number},
  
  // purposes
  // sports: {type: Number, required: false},
  // extreme: {type: Number, required: false},
  // attractions: {type: Number, required: false}, 
  // leisure: {type: Number, required: false},
  // nightLife: {type: Number, required: false},
  // BETENGAV: {type: Number, required: false}, // todo rename

  arr_purpose_of_place: {type: [Number], require: false},
  // hobbies
  sport: {type: Number, required: false},
  culture: {type: Number, required: false},
  food: {type: Number, required: false},

  kmean_x : {type : Number },
  kmean_y : {type : Number },

  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Place", placeSchema);
