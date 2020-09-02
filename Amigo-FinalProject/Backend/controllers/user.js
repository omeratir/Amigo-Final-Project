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
      avg_age20: 0,  // avg age of liked places
      avg_age35: 0, //avg age of liked places
      avg_age50: 0, //avg age of liked places
      avg_age_120: 0, //avg age of liked places
      liked_place: 'EMPTY',
      kmeans_array: 'EMPTY',
      liked_places_array: 'EMPTY',
      unliked_places_array: 'EMPTY',
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

exports.getUserFullData = (req, res, next) => {
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
    var avg_culture_places = 0;
    var avg_food_places = 0;
    var avg_sport_places =0;
    var avg_AttractionsLeisure = 0;
    var avg_SportExtreme = 0;
    var avg_NightLife = 0;
    var avg_CultureHistorical = 0;
    var avg_Rest = 0;
    var avg_Shopping = 0;
    var tempLikePlace = new Array();
    var countHobbiesIfZero = 0;
    if(req.body.liked_place == 'EMPTY'){
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
        liked_places_array: req.body.liked_places_array,
        unliked_places_array: req.body.unliked_places_array,
        kmeans_array: req.body.kmeans_array,
        //req.body.kmeans_array,

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
        avg_sport_place: avg_sport_places,
        avg_culture_place:avg_culture_places,
        avg_food_place: avg_food_places
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

    }
else{

    tempLikePlace = req.body.liked_place.split(',');
    //for(let placeid of tempLikePlace) {
      for(var index2 = 0; index2<(tempLikePlace.length); index2++){
        console.log('placeid :' + tempLikePlace);
      console.log('placeid[index] :' + tempLikePlace[index2]);
      
      Place.findById(tempLikePlace[index2])
      .then(place => {
        if (place) {
          countlikes = countlikes + 1;
          avg_gender += place.gender_avg;// the avg_gender of each place
          console.log('place_avg_age: ' + avg_gender);

          avg_culture_places +=place.avg_culture; //the avg_cultue of each place
          avg_sport_places +=place.avg_sport; //the avg_sport of each place
          avg_food_places +=place.avg_food; //the avg_food of each place
          if( place.count_of_likes != 0 || countlikes ==1){
              countHobbiesIfZero++;
              console.log('countHobbiesIfZero++: '+ countHobbiesIfZero);
          }
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
                var avg_age = age35 + age20 + age50 + age120;
                avg_AttractionsLeisure= avg_AttractionsLeisure/countlikes;
                avg_SportExtreme= avg_SportExtreme/countlikes;
                avg_NightLife= avg_NightLife/countlikes;
                avg_CultureHistorical= avg_CultureHistorical/countlikes;
                avg_Rest=avg_Rest/countlikes;
                avg_Shopping= avg_Shopping/countlikes;
                avg_gender= avg_gender/countHobbiesIfZero;
                avg_culture_places= avg_culture_places/countHobbiesIfZero;
                avg_sport_places=  avg_sport_places/countHobbiesIfZero;
                avg_food_places= avg_food_places/countHobbiesIfZero;
                age20= age20/avg_age;
                age35=  age35/avg_age;
                age50= age50/avg_age;
                age120=  age120/avg_age;

                console.log('avg_food_places: '+ avg_food_places);
                console.log('avg_sport_places: '+ avg_sport_places);
                console.log('avg_culture_places: '+ avg_culture_places);
                console.log('age120: '+ countHobbiesIfZero);


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
                   liked_places_array: req.body.liked_places_array,
                   unliked_places_array: req.body.unliked_places_array,
                   kmeans_array: req.body.kmeans_array,

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
                   avg_sport_place: avg_sport_places,
                   avg_culture_place:avg_culture_places,
                   avg_food_place: avg_food_places
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
                message: "Fetching user failed2!"
              });
            });
          }
        } else {
          res.status(404).json({ message: "Place not found!" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching place failed2!"
        });
      });
  }
}

};


exports.updateUserAfterRecommend = (req, res, next) => {
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
      liked_places_array: req.body.liked_places_array,
      unliked_places_array: req.body.unliked_places_array,
      liked_place: req.body.liked_place,
      kmeans_array: 'EMPTY',
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

};

exports.UpdateUserByEmail = (req, res, next) => {
  var countlikes = 0;
  var age20 =0;
  var age35 =0;
  var age50 =0;
  var age120 =0;
  var avg_gender = 0;
  var avg_culture_places = 0;
  var avg_food_places = 0;
  var avg_sport_places =0;
  var avg_AttractionsLeisure = 0;
  var avg_SportExtreme = 0;
  var avg_NightLife = 0;
  var avg_CultureHistorical = 0;
  var avg_Rest = 0;
  var avg_Shopping = 0;
  var tempLikePlace = new Array();

  console.log('email = ' + req.params.email);
  console.log('array = ' + req.body.liked_place);
  tempLikePlace = req.body.liked_place.split(',');
  console.log('TEMPLIKEPLACES ' + tempLikePlace[0]);
  console.log('TEMPLIKEPLACES_lentgh ' + tempLikePlace.length);
  var indexShure =0;
  for(var index =0; index<tempLikePlace.length; index++)
    {
      console.log('indexshure: '+ indexShure)
    Place.findById(tempLikePlace[index])
    .then(place => {
      if (place) {
        console.log('tempLikePlace.length');
        avg_gender += place.gender_avg;// the avg_gender of each place
        console.log('gender_avg: '+ place.gender_avg);
        avg_culture_places +=place.avg_culture; //the avg_cultue of each place
        avg_sport_places +=place.avg_sport; //the avg_sport of each place
        avg_food_places +=place.avg_food; //the avg_food of each place

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
        console.log('tmep-1: ' + (tempLikePlace.length-1));
        console.log('index: ' + index);

     // }
      } else {
        res.status(404).json({ message: "Place not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching place failed2!"
      });
    });
}

//if ((tempLikePlace.length) == index) {
  console.log('yay we here!!');
  setTimeout(function() {
  User.findOne({ email : req.params.email})
  .then(user => {
    if (user) {
      var avg_age = age35 + age20 + age50 + age120;
      avg_AttractionsLeisure= avg_AttractionsLeisure/tempLikePlace.length;
      avg_SportExtreme= avg_SportExtreme/tempLikePlace.length;
      avg_NightLife= avg_NightLife/tempLikePlace.length;
      avg_CultureHistorical= avg_CultureHistorical/tempLikePlace.length;
      avg_Rest=avg_Rest/tempLikePlace.length;
      avg_Shopping= avg_Shopping/tempLikePlace.length;
      avg_gender= avg_gender/tempLikePlace.length;
      console.log('gender_avg2: '+ avg_gender);
      console.log('tempLikePlace.length: ' + tempLikePlace.length);

      avg_culture_places= avg_culture_places/tempLikePlace.length;
      avg_sport_places=  avg_sport_places/tempLikePlace.length;
      avg_food_places= avg_food_places/tempLikePlace.length;
      age20= age20/avg_age;
      age35=  age35/avg_age;
      age50= age50/avg_age;
      age120=  age120/avg_age;

      const userData = new User({
               _id: user.id,
               email: user.email,
               password: user.password,
               firstName: user.firstName,
               lastName: user.lastName,
               age: user.age,
               gneder: user.gender,
               sport: user.sport,
               culture: user.culture,
               food: user.food,
               liked_place: user.liked_place,
               liked_places_array: user.liked_places_array,
               unliked_places_array: user.unliked_places_array,
               kmeans_array: user.kmeans_array,

         count_of_liked_places: 0,
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
         avg_sport_place: avg_sport_places,
         avg_culture_place:avg_culture_places,
         avg_food_place: avg_food_places
       });

       User.updateOne({ email: req.params.email}, userData)
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

  }else {
      res.status(404).json({ message: "User not found!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching user failed2!"
    });
  });
},1000);

};

exports.updateUserData = (req, res, next) => {
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
    unliked_places_array: req.body.unliked_places_array,
    liked_places_array: req.body.liked_places_array,
    kmeans_array: req.body.kmeans_array
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
};











  // User.findOne({ email : req.params.email})
  // .then(user => {
  //   if (user) {
  //     const userData = new User({
  //        _id: user.id,
  //        email: user.email,
  //        password: user.password,
  //        firstName: user.firstName,
  //        lastName: user.lastName,
  //        age: user.age,
  //        gneder: user.gender,
  //        sport: user.sport,
  //        culture: user.culture,
  //        food: user.food,
  //        liked_place: user.liked_place,
  //        kmeans_array: user.kmeans_array,
  //      });

  //      User.updateOne({ email: req.params.email}, userData)
  //      .then(result => {
  //          if (result.n > 0) {
  //            res.status(200).json({ message: "Update successful!" });
  //          } else {
  //            res.status(401).json({ message: "Not authorized!" });
  //          }
  //   })
  //   .catch(error => {
  //     res.status(500).json({
  //       message: "Couldn't udpate user!"
  //     });
  //   });

  //   } else {
  //     res.status(404).json({ message: "User not found!" });
  //   }
  // })
  // .catch(error => {
  //   res.status(500).json({
  //     message: "Fetching user failed2!"
  //   });
  // });


