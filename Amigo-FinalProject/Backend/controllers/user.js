const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Place = require("../models/place");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      gender: req.body.gender,
      sport: req.body.sport,
      culture: req.body.culture,
      food: req.body.food,
      avg20: 0,  // avg age of liked places
      avg35: 0, //avg age of liked places
      avg50: 0, //avg age of liked places
      avg120: 0, //avg age of liked places
      liked_place: 'EMPTY',
      count_of_liked_places: 0,

      //goals
      sportsAndExtreme: 0,
      cultureAndHistoricalPlaces: 0,
      attractionsAndLeisure: 0,
      rest: 0,
      nightLife: 0,
      shopping: 0,

      //avg
      avg_gender_place: 0,
      avg_sport_place: 0, //avg hobby of liked places
      avg_culture_place: 0, //avg hobby of liked places
      avg_food_place: 0, //avg hobby of likes places
    });

    user.save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}

exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
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


exports.updateUser = (req, res, next) => {
    // vars
    var countlikes = 0;
    var age20 =0;
    var age35 =0;
    var age50 =0;
    var age120 =0;
    var avg_gender = 0;
    var avg_culture_place = 0;
    var avg_food_place = 0;
    var avg_sport_place =0;
    var avg_AttractionsLeisure = 0;
    var avg_SportExtreme = 0;
    var avg_NightLife = 0;
    var avg_CultureHistorical = 0;
    var avg_Rest = 0;
    var avg_Shopping = 0;
    var tempLikePlace = new Array();
    tempLikePlace = req.body.liked_place.split(',');

    console.log('temp length = ' + tempLikePlace.length);

    for(let placeid of tempLikePlace) {
      Place.findById(placeid)
      .then(place => {
        if (place) {
          console.log('yolo');
          countlikes = countlikes + 1;

          avg_gender += place.gender_avg;// the avg_gender of each place
          avg_culture_place +=place.avg_culture; //the avg_cultue of each place
          avg_sport_place +=place.avg_sport; //the avg_sport of each place
          avg_food_place +=place.avg_food; //the avg_food of each place

          age20 +=place.count_age20; //השם של העמודה בדאטה בייס
          age35 +=place.count_age35;
          age50 +=place.count_age50;
          age120 +=place.count_age120;

          switch(place.goal) {
            case "Attractions & Leisure":
              avg_AttractionsLeisure +=1;
            break;
            case "Sport & Extreme":
              avg_SportExtreme +=1;
            break;
            case "Night Life":
              avg_NightLife +=1;
            break;
            case "Culture & Historical Places":
              avg_CultureHistorical +=1;
            break;
            case "Relaxing":
              avg_Rest +=1;
            break;
            case "Shopping":
              avg_Shopping +=1;
            break;
          }

          if (tempLikePlace.length === countlikes) {
            User.findById(req.body.id)
            .then(user => {
              if (user) {
                console.log('yolo2');
                console.log('countlikes = ' + countlikes);

                avg_AttractionsLeisure= avg_AttractionsLeisure/countlikes;
                avg_SportExtreme= avg_SportExtreme/countlikes;
                avg_NightLife= avg_NightLife/countlikes;
                avg_CultureHistorical= avg_CultureHistorical/countlikes;
                avg_Rest=avg_Rest/countlikes;
                avg_Shopping= avg_Shopping/countlikes;
                avg_gender= avg_gender/countlikes;
                avg_culture_place= avg_culture_place/countlikes;
                avg_sport_place=  avg_sport_place/countlikes;
                avg_food_place= avg_food_place/countlikes;
                age20= age20/countlikes;
                age35=  age35/countlikes;
                age50= age50/countlikes;
                age120=  age120/countlikes;

                const userData = new User({
                   _id: req.body.id,
                   email: req.body.email,
                   password: req.body.password,
                   firstName: req.body.firstName,
                   lastName: req.body.lastName,
                   age: req.body.age,
                   gneder: req.body.gender,
                   sport: req.body.sport,
                   culture: req.body.culture,
                   food: req.body.food,
                   liked_place: req.body.liked_place,

                   count_of_liked_places: countlikes,
                   sportsAndExtreme: avg_SportExtreme,
                   cultureAndHistoricalPlaces:avg_CultureHistorical,
                   attractionsAndLeisure:avg_AttractionsLeisure,
                   rest: avg_Rest,
                   nightLife:avg_NightLife,
                   shopping:avg_Shopping,

                   //avg
                   avg_age20:age20,
                   avg_age35:age35,
                   avg_age50:age50,
                   avg_age_120:age120,

                   avg_gender_place:avg_gender,
                   avg_sport_place: avg_sport_place,
                   avg_culture_place:avg_culture_place,
                   avg_food_place: avg_food_place
                 });

                 User.updateOne({ _id: req.params.id}, userData)
                 .then(result => {
                     if (result.n > 0) {
                       res.status(200).json({ message: "Update successful!" });
                     } else {
                       res.status(401).json({ message: "Not authorized!" });
                     }
              })
              .catch(error => {
                res.status(500).json({
                  message: "Couldn't udpate user!"
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
          }
        } else {
          res.status(404).json({ message: "Place not found!" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching place failed!"
        });
      });
  }


};
