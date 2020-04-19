const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  nameOfPlace: { type: String, required: true }, //title
  idOfUser: { type: String, required: true },
  idOfPlace: { type: String, required: true },
  stars: { type: String , required: true },
  purposeOfTheTrip: { type: String, required: true },
  hobbies: { type: String, required: true },
  purposeOfTheTrip: { type: String, required: true },
  dateAndHourOfUploadPosts: { type: String, required: true },
  post: { type: String, required: true },
  ageOfTheUser: { type: String, required: true },
  sexOfTheUser: { type: String, required: true }, 
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Post", postSchema);
