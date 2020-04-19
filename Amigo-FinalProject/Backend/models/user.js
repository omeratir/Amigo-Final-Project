const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  age: { type: String, required: false },
  sex: { type: String, required: false },
  addressOfStart: { type: String, required: false },
  addressOfEnd: { type: String, required: false },
  numberOfDays: { type: String, required: false },
  purposeOfTheTrip: { type: String, required: false },
  hobbies: { type: String, required: false },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

