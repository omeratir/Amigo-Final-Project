const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  place: { type: String, required: true },
  rating: { type: String , required: true },
  content: { type: String, required: true },
  time_of_place : {type : String, required : true},
  purpose_of_place : {type: String , required: true},
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Post", postSchema);
