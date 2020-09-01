const mongoose = require("mongoose");

const routeSchema = mongoose.Schema({
  name: { type: String, required: true },
  places: { type: String , required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Route", routeSchema);
