const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongodb = require("mongodb").MongoClient;
const fs = require("fs");
const fastcsv = require("fast-csv");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const placesRoutes = require("./routes/places");
const routesRoutes = require("./routes/routes");
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
app.use("/api/routes", routesRoutes);


// ********* One time - Import the csv file of places ********** //

// Amsterdamplaces.csv - 100 items
// Attraction.csv - 1370 items
// AttractionRecommends.csv

// **** Add places csv **** //

// let stream = fs.createReadStream("./Backend/csv/Attraction.csv");
// let csvData = [];
// let csvStream = fastcsv
//   .parse()
//   .on("data", function(data) {
//     csvData.push({
//       name: data[0],
//       lat: data[1],
//       lng: data[2],
//           count_of_post_added_to_place: 0,
//           place_for_gender: 0,
//           sum_place_for_gender: 0,
//           sum_place_for_age: 0,
//           avg_ages_of_place: 0,
//           sport: 0,
//           culture: 0,
//           food: 0,
//           hobbies: 0,
//           sportsAndExtreme: 0,
//           cultureAndHistoricalPlaces: 0,
//           attractionsAndLeisure: 0,
//           rest: 0,
//           nightLife: 0,
//           shopping: 0
//     });
//   })
//   .on("end", function() {
//     // remove the first line: header
//     csvData.shift();

//     // save to the MongoDB database collection
//   });

// stream.pipe(csvStream);

// let url = "mongodb+srv://amigoadmindb:" + process.env.MONGO_ATLAS_PW +"@amigofinalproject-yputx.mongodb.net/test?retryWrites=true&w=majority";

// mongodb.connect(
//   url,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   (err, client) => {
//     if (err) throw err;
//     client
//       .db("test")
//       .collection("places")
//       .insertMany(csvData, (err, res) => {
//         if (err) throw err;
//         console.log(`Inserted: ${res.insertedCount} rows`);
//         client.close();
//       });
//   }
// );


// // **** Add reviews csv **** //

// let stream = fs.createReadStream("./Backend/csv/AttractionRecommends.csv");
// let csvData = [];
// let csvStream = fastcsv
//   .parse()
//   .on("data", function(data) {
//     csvData.push({
//       title: data[0],
//       place: data[1],
//       rating: data[2],
//       content: data[3],
//       time_of_place: data[4],
//       purpose_of_place: data[5],
//       age: data[6],
//       gender: data[7],
//       hobbies: data[8]
//     });
//   })
//   .on("end", function() {
//     // remove the first line: header
//     csvData.shift();

//     // save to the MongoDB database collection
//   });

// stream.pipe(csvStream);

// let url = "mongodb+srv://amigoadmindb:" + process.env.MONGO_ATLAS_PW +"@amigofinalproject-yputx.mongodb.net/test?retryWrites=true&w=majority";

// mongodb.connect(
//   url,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   (err, client) => {
//     if (err) throw err;
//     client
//       .db("test")
//       .collection("posts")
//       .insertMany(csvData, (err, res) => {
//         if (err) throw err;
//         console.log(`Inserted: ${res.insertedCount} rows`);
//         client.close();
//       });
//   }
// );



module.exports = app;
