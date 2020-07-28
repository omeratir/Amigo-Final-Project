const Place = require("../models/place");
const User = require("../models/user");
const KmeansLib = require('kmeans-same-size');
const KNearestNeighbors = require('k-nearest-neighbors');

exports.createPlace = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const place = new Place({
    name: req.body.name,
    lat: req.body.lat,
    lng: req.body.lng,
    goal: 'GOAL',
    users_array: 'EMPTY',
    gender_avg: 0,
    count_of_likes: 0,
    count_age20: 0,
    count_age35: 0,
    count_age50: 0,
    count_age120: 0,
    count_sport: 0,
    count_culture: 0,
    count_food: 0,
    count_female: 0,
    count_male: 0,
    avg_sport: 0, //avg hobby of users
    avg_culture: 0, //avg hobby of users
    avg_food: 0, //avg hobby of users
    count_of_post_added_to_place: 0,
    creator: req.userData.userId
  });
  place.save()
    .then(createdPlace => {
      res.status(201).json({
        message: "Place added successfully",
        place: {
          ...createdPlace,
          id: createdPlace._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a place failed!"
      });
    });
};

exports.updatePlace = (req, res, next) => {
  var count_of_likes = 0;

  var count_sport = 0;
  var count_culture = 0;
  var count_food = 0;

  var count_female = 0;
  var count_male = 0;

  var count_age20 = 0;
  var count_age35 = 0;
  var count_age50 = 0;
  var count_age120 = 0;

  var avg_food = 0;
  var avg_sport = 0;
  var avg_culture = 0;

  var avg_gender = 0;

  User.findById(req.body.users_array)
  .then(user => {
    if (user) {
      if (user.gender === 'Female') {
        count_female = 1;
      } else {
        count_male = 1;
      }

      if (user.sport === true ) {
        count_sport = 1;
      }
      if (user.culture === true) {
        count_culture = 1;
      }
      if (user.food === true) {
        count_food = 1;
      }

      if (user.age < 21) {
        count_age20 = 1;
      }
      if (user.age > 20 && user.age < 36) {
          count_age35 = 1;
        }
      if (user.age > 35 && user.age < 51) {
            count_age50 = 1;
          }
      if (user.age > 50 ) {
            count_age120 = 1;
      }

      Place.findById(req.body.id)
      .then(place => {
        if (place) {
          if(place.flagLike == true){
          count_of_likes = place.count_of_likes + 1;

          count_sport = count_sport + place.count_sport;
          count_food = count_food + place.count_food;
          count_culture = count_culture + place.count_culture;

          count_female = count_female + place.count_female;
          count_male = count_male + place.count_male;

          count_age20 = count_age20 + place.count_age20;
          count_age35 = count_age35 + place.count_age35;
          count_age50 = count_age50 + place.count_age50;
          count_age120 = count_age120 + place.count_age120;

          avg_sport = count_sport / count_of_likes;
          avg_culture = count_culture / count_of_likes;
          avg_food = count_food / count_of_likes;

          avg_gender = (1 * count_male + 2 * count_female) / count_of_likes;
          }
          if(place.flagLike == false){
            count_of_likes = place.count_of_likes - 1;

            count_sport = count_sport + place.count_sport;
            count_food = count_food + place.count_food;
            count_culture = count_culture + place.count_culture;

            count_female = count_female + place.count_female;
            count_male = count_male + place.count_male;

            count_age20 = count_age20 + place.count_age20;
            count_age35 = count_age35 + place.count_age35;
            count_age50 = count_age50 + place.count_age50;
            count_age120 = count_age120 + place.count_age120;

            avg_sport = count_sport / count_of_likes;
            avg_culture = count_culture / count_of_likes;
            avg_food = count_food / count_of_likes;

            avg_gender = (1 * count_male + 2 * count_female) / count_of_likes;
          }
          const placeData = new Place({
            _id: req.body.id,
            name: req.body.name,
            lat: req.body.lat,
            lng: req.body.lng,

            count_of_likes: count_of_likes,

            count_sport: count_sport,
            count_culture: count_culture,
            count_food: count_food,

            count_female: count_female,
            count_male: count_male,

            count_age20: count_age20,
            count_age35: count_age35,
            count_age50: count_age50,
            count_age120: count_age120,

            avg_culture: avg_culture,
            avg_sport: avg_sport,
            avg_food: avg_food,

            avg_gender: avg_gender,

            users_array: req.body.users_array,
            flagLike: req.body.flagLike
            // creator: req.userData.userId
          });

          Place.updateOne({ _id: req.params.id /*, creator: req.userData.userId */}, placeData)
            .then(result => {
              if (result.n > 0) {
                res.status(200).json({ message: "Update successful!" });
              } else {
                res.status(401).json({ message: "Not authorized!" });
              }
            })
            .catch(error => {
              res.status(500).json({
                message: "Couldn't udpate place!"
              });
            });
        } else {
          res.status(404).json({ message: "Place not found!" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching place failed!"
        });
      });
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching user failed!"
    });
  });
};

exports.getPlaces = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const placeQuery = Place.find(); //bring all data from db
  let fetchedPlaces;
  if (pageSize && currentPage) {
    placeQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  placeQuery
    .then(documents => {
      fetchedPlaces = documents;
      return Place.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Placed fetched successfully!",
        places: fetchedPlaces,
        maxPlaces: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching places failed!"
      });
    });
};

exports.getPlace = (req, res, next) => {
  Place.findById(req.params.id)
    .then(place => {
      if (place) {
        res.status(200).json(place);
      } else {
        res.status(404).json({ message: "Place not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching place failed!"
      });
    });
};

exports.deletePlace = (req, res, next) => {
  Place.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting place failed!"
      });
    });
};

exports.kmeans = (req, res, next) => {
  console.log(req.body.goal_Attractions_Leisure);
  console.log(req.body.goal_Relaxing);
  var id =0;
  var vectors = [];
  var count =0;
  var i =0;
    console.log('aviad try3');
    console.log(req.body.userid);
    User.find({}, function(err, users) {
      var userMap = {};

      users.forEach(function(user) {
        userMap[user._id] = user;
        count++;
        if(userMap[user._id].id != req.body.userid){
          console.log('aviad tryX');
        vectors[i] = {
          x: userMap[user._id].age,
          y: userMap[user._id].sportsAndExtreme,
          s:userMap[user._id].cultureAndHistoricalPlaces,
          m:userMap[user._id].attractionsAndLeisure,
          d:userMap[user._id].rest }
        vectors[i].id = (userMap[user._id].id);
        console.log(userMap[user._id].email);
        i++;
        }

      });
      console.log('avu');
      console.log(vectors);

      var kmeans = new KmeansLib();
      const k = 2; // Groups Number
      const size = 2 // Group size

      var id =0;
      //var vectors = [];
      // for(var i=0;i<20;i++){
      // vectors[i] = { x: i, y: i,s:i,m:i,d:i }
      // vectors[i].id = 'a'+i;
      // }
      //kmeans.init({})
      kmeans.init({k: k,runs: size,normalize: false });
      // kmeans.init({k: k,normalize: false });
      var sum = kmeans.calc(vectors);
      //The vector is mutated
      console.log(vectors);
      console.log('aviad');
      const machine = new KNearestNeighbors(
        vectors,
      [
        'x',
        'y',
        's',
        'm',
        'd',
      ]);
      var placeInKnn = machine.classify({
        x: 5,
        y: 5,
        s: 5,
        m: 1,
        d: 5,
        q:'q493'
      }, 1, 'k');
     // console.log(vectors);
      console.log('the palce' + placeInKnn)
     console.log('the palce' + placeInKnn)
      //console.log(res.send(userMap));
    });





  //var newVec = new Array();
  // for(var x=0;x<count-1;x++){
  //  // if(vectors[x].k ==placeInKnn){
  //   console.log("yay");
  // //newVec[0]= vectors[x].id;
  //  // console.log(vectors[x].id);
  //   console.log(vectors.includes('a3'));
  //  // }
  // }
};

exports.getAllPlaces = (req, res, next) => {
  const placeQuery = Place.find();
  let fetchedPlaces;
  placeQuery
    .then(documents => {
      fetchedPlaces = documents;
      return Place.count();
    })
    .then(count => {
      res.status(200).json({
        message: "All Places fetched successfully!",
        places: fetchedPlaces,
        maxPlaces: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching places failed!"
      });
    });
  }

  exports.onLikedPlace = (req, res, next) => {
    console.log('server user id get = ' + req.body.userId);
  }


