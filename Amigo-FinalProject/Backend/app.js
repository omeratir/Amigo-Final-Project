const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const placesRoutes = require("./routes/places");
const tracksRoutes = require("./routes/tracks");
const app = express();

const io = require("socket.io");

mongoose
  .connect(
    "mongodb+srv://amigoadmindb:" + process.env.MONGO_ATLAS_PW +"@amigofinalproject-yputx.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database *Success!!!!");
  })
  .catch(() => {
    console.log("Connection to database *Failed!!!!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/tracks", tracksRoutes);

// One time - Import the csv file of places

const mongodb = require("mongodb").MongoClient;

const fs = require("fs");
const fastcsv = require("fast-csv");
// Amsterdamplaces.csv
// Attraction.csv
let stream = fs.createReadStream("./Backend/csv/Amsterdamplaces.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push({
      nameOfPlace: data[0],
      lat: data[1],
      lng: data[2],
      averageDaysOfPlace: data[3],
      destinationForSex: data[4],
      destinationForAges: data[5]
    });
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();

    // save to the MongoDB database collection
  });

stream.pipe(csvStream);

let url = "mongodb+srv://amigoadmindb:" + process.env.MONGO_ATLAS_PW +"@amigofinalproject-yputx.mongodb.net/test?retryWrites=true&w=majority";

mongodb.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) throw err;
    client
      .db("test")
      .collection("places")
      .insertMany(csvData, (err, res) => {
        if (err) throw err;
        console.log(`Inserted: ${res.insertedCount} rows`);
        client.close();
      });
  }
);


module.exports = app;
