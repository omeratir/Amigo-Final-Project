const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: String, required: true },
  sex: { type: String, required: true },
  addressOfStart: { type: String, required: false },
  addressOfEnd: { type: String, required: false },
  numberOfDays: { type: String, required: true },
  purposeOfTheTrip: { type: String, required: true },
  hobbies: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

