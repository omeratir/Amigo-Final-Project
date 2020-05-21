const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  //hobbies
  sport: { type: Number, required: true },
  culture: { type: Number, required: true },
  food: { type: Number, required: true },
  //goals
  sportsAndExtreme: {type: Number, required: false},
  cultureAndHistoricalPlaces: {type: Number, required: false},
  attractionsAndLeisure: {type: Number, required: false}, 
  rest: {type: Number, required: false},
  nightLife: {type: Number, required: false},
  shopping: {type: Number, required: false},

  arrayOfPlacesLiked: { type: Array, required: false },
  avgAgesLiked: { type: Number, required: false },
  avgFemaleLiked: { type: Number, required: false },
  avgMenLiked: { type: Number, required: false },
  //avg hobbies
  avgSport: { type: Number, required: false },
  avgCulture: { type: Number, required: false },
  avgFood: { type: Number, required: false },
 //avg goals
  avgSportsAndExtreme: { type: Number, required: false },
  avgCultureAndHistoricalPlaces: { type: Number, required: false },
  avgAttractionsAndLeisure: { type: Number, required: false },
  avgRest: { type: Number, required: false },
  avgNightLife: { type: Number, required: false },
  avgShopping: { type: Number, required: false },
  
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);


