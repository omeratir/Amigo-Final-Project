const mongoose = require("mongoose");

const goalSchema = mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Goal", goalSchema);
