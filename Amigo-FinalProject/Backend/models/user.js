const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  hobbies: { type: String, required: true },

  liked_places: { type: String, required: false },
  count_of_liked_places: { type: String, required: false },

  //hobbies
  sport: { type: Number, required: false },
  culture: { type: Number, required: false },
  food: { type: Number, required: false },

  //goals
  sportsAndExtreme: {type: Number, required: false},
  cultureAndHistoricalPlaces: {type: Number, required: false},
  attractionsAndLeisure: {type: Number, required: false},
  rest: {type: Number, required: false},
  nightLife: {type: Number, required: false},
  shopping: {type: Number, required: false},

  //avg
  avg_age_place: { type: Number, required: false },
  avg_gender_place: { type: Number, required: false },
  avg_sport_place: { type: Number, required: false },
  avg_culture_place: { type: Number, required: false },
  avg_food_place: { type: Number, required: false },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);


