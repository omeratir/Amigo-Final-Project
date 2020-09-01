const Place = require("../models/place");
const User = require("../models/user");
const KmeansLib = require('kmeans-same-size');
const KNearestNeighbors = require('k-nearest-neighbors');
const user = require("../models/user");

// omer omer omer good version

exports.createPlace = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const place = new Place({
    name: req.body.name,
    lat: req.body.lat,
    lng: req.body.lng,
    goal: req.body.goal,
    users_array: 'EMPTY',
    gender_avg: 0,
    count_of_likes: 0,
    count_of_place_likes: 0,
    count_of_place_unlikes: 0,
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

exports.updatePlaceAfterSave = (req, res, next) => {
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
  var count_hobbies =0;
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
   //   if(user.count_of_liked_places < 1 && req.body.flagLike == false){
      Place.findById(req.body.id)
      .then(place => {
        if (place) {
          if(req.body.flagLike == true){
          console.log('how much likes' + place.count_of_likes);
          count_of_likes = place.count_of_likes + 1;
          console.log(count_of_likes);
          count_sport = count_sport + place.count_sport;
          count_food = count_food + place.count_food;
          count_culture = count_culture + place.count_culture;

          count_female = count_female + place.count_female;
          count_male = count_male + place.count_male;

          count_age20 = count_age20 + place.count_age20;
          count_age35 = count_age35 + place.count_age35;
          count_age50 = count_age50 + place.count_age50;
          count_age120 = count_age120 + place.count_age120;
            count_hobbies = count_sport + count_food + count_culture ;
          avg_sport = count_sport / count_hobbies;
          avg_culture = count_culture / count_hobbies;
          avg_food = count_food / count_hobbies;

          avg_gender = (1 * count_male + 2 * count_female) / count_of_likes;
          }
          if(req.body.flagLike == false){
            console.log('how much unlikes' + place.count_of_likes);
            count_of_likes = place.count_of_likes - 1;

            count_sport = place.count_sport - count_sport;
            count_food = place.count_food - count_food;
            count_culture = place.count_culture - count_culture;

            count_female =  place.count_female - count_female;
            count_male = place.count_male - count_male;

            count_age20 = place.count_age20 - count_age20;
            count_age35 = place.count_age35 - count_age35;
            count_age50 = place.count_age50 - count_age50;
            count_age120 = place.count_age120 - count_age120;
            count_hobbies = count_sport + count_food + count_culture ;
            if (count_of_likes > 0) {
              avg_sport = count_sport/count_hobbies;
              avg_culture = count_culture/count_hobbies;
              avg_food = count_food/count_hobbies;

              avg_gender = (1 * count_male + 2 * count_female) / count_of_likes;
              console.log('avu3');
            }
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

            gender_avg: avg_gender,

            users_array: req.body.users_array
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
     // }
    }
     else {
      res.status(404).json({ message: "User not found!" });
    }

  })

  .catch(error => {
    res.status(500).json({
      message: "Fetching user failed3!"
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

exports.getPlaceFullData = (req, res, next) => {
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
  var userid = req.params.id;
  var id =0;
  var vectors = [];
  var vectors2 = [];
  var currentUserVector = {};
  var currentUserVector2 = {};
  var count =0;
  var i =0;
  User.find({}, function(err, users) {
      var userMap = {};

      users.forEach(function(user) {
        userMap[user._id] = user;
        count++;
        if(userMap[user._id].id != req.body.userid){
        vectors[i] = {
         // x: userMap[user._id].age,
        // x: 1,
          x: userMap[user._id].sportsAndExtreme,
          y:userMap[user._id].cultureAndHistoricalPlaces,
          m:userMap[user._id].attractionsAndLeisure,
          d:userMap[user._id].rest,
          a: userMap[user._id].nightLife,
          b: userMap[user._id].shopping
         }
         vectors2[i] = {
          //  x: userMap[user._id].avg_age20,
          //  y:userMap[user._id].avg_age35,
          //  m:userMap[user._id].avg_age50,
          //  d:userMap[user._id].avg_age_120,
          //  a: userMap[user._id].avg_gender_place,
          //  b: userMap[user._id].age
          x: userMap[user._id].sportsAndExtreme,
          y:userMap[user._id].cultureAndHistoricalPlaces,
          m:userMap[user._id].attractionsAndLeisure,
          d:userMap[user._id].rest,
          a: userMap[user._id].nightLife,
          b: userMap[user._id].shopping
          }
        vectors[i].id = (userMap[user._id].id);
        vectors2[i].id = (userMap[user._id].id);
        i++;
        }
        else{
          currentUserVector = {
          //  x: userMap[user._id].age,
          //x: 1,
          x: 1,
          y:userMap[user._id].cultureAndHistoricalPlaces,
          m:userMap[user._id].attractionsAndLeisure,
          d:userMap[user._id].rest,
          a: userMap[user._id].nightLife,
          b: userMap[user._id].shopping
         }
           // q: userMap[user._id].id }
            currentUserVector.id = (userMap[user._id].id);

            currentUserVector2 = {
              // x: userMap[user._id].avg_age20,
              // y:userMap[user._id].avg_age35,
              // m:userMap[user._id].avg_age50,
              // d:userMap[user._id].avg_age_120,
              // a: userMap[user._id].avg_gender_place,
              // b: userMap[user._id].age
              x: userMap[user._id].sportsAndExtreme,
              y:userMap[user._id].cultureAndHistoricalPlaces,
              m:userMap[user._id].attractionsAndLeisure,
              d:userMap[user._id].rest,
              a: userMap[user._id].nightLife,
              b: userMap[user._id].shopping
            }
               // q: userMap[user._id].id }
                currentUserVector2.id = (userMap[user._id].id);

        }

      });
      console.log('currentUser');
      console.log(currentUserVector);


      var kmeans = new KmeansLib();
      const k = vectors.length/5; // Groups Number
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
      console.log('vectors:');
      console.log(vectors);
      console.log('end vectors');
      const machine = new KNearestNeighbors(
        vectors,
      [
        'x',
        'y',
        'm',
        'd',
        'a',
        'b',
      ]);
      var placeInKnn = machine.classify(
        currentUserVector
      , 1, 'k');
     // console.log(vectors);
      console.log('the palce is: ' + placeInKnn)
var m=0;
var vectors3=[];
//try the second kmeans
    for(var z=0;z< vectors.length;z++){
  if(vectors[z].k==placeInKnn){
    vectors3[m]=vectors2[z];
    m++;
  }
}
console.log(vectors3);
      var kmeans2 = new KmeansLib();
      const k2 = vectors2.length/10; // Groups Number
      console.log(k2);
      console.log('k2');
      const size2 = 2 // Group size

      var id2 =0;

      kmeans2.init({k: k2,runs: size2,normalize: false });
      // kmeans.init({k: k,normalize: false });
      var sum2 = kmeans2.calc(vectors3);
      //The vector is mutated
      console.log('currentUser2');
      console.log(currentUserVector2);
      console.log('end currentUser2');
      console.log(vectors3);
      const machine2 = new KNearestNeighbors(
        vectors3,
      [
        'x',
        'y',
        'm',
        'd',
        'a',
        'b',
      ]);
      var placeInKnn2 = machine2.classify(
        currentUserVector2
      , 1, 'k');
     // console.log(vectors);
      console.log('the palce is: ' + placeInKnn2)

      var lengthStringUsers = '';
      for(var index =0; index<vectors3.length;index++){
        if(vectors3[index].k == placeInKnn2){
          lengthStringUsers = lengthStringUsers.concat(vectors3[index].id,',');
        }
      }
      lengthStringUsers = lengthStringUsers.concat(userid,',');
      console.log('userid = ' + userid);
      console.log('The user list is:' + lengthStringUsers);
      var splitArray =[];
      var splitArray2 =[];
      splitArray = lengthStringUsers.split(',');
     // console.log('splituser: ' + splitArray[0]);
      var lengthStringPlaces = '';
    //  console.log('length: ' + splitArray.length);
      for (var index = 0; index<(splitArray.length-1);index++)
      {
        // console.log('which user: ' + splitArray[index]);
        User.findById(splitArray[index])
        .then(usertemp => {
        if (usertemp) {
          if (userid == usertemp._id) {
            console.log('good');
            const userData = new User({
              _id: usertemp.id,
              email: usertemp.email,
              password: usertemp.password,
              firstName: usertemp.firstName,
              lastName: usertemp.lastName,
              age: usertemp.age,
              gneder: usertemp.gender,
              sport: usertemp.sport,
              culture: usertemp.culture,
              food: usertemp.food,
              liked_place: usertemp.liked_place,
              liked_places_array: usertemp.liked_places_array,
              unliked_places_array: usertemp.unliked_places_array,
              kmeans_array: lengthStringPlaces
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
            splitArray2 = usertemp.liked_place.split(',');
          }

        // console.log('all the split2 in user: ' + splitArray2);
        if(splitArray2.length>10){
          var lengthPlaces = 10;
        }
        else{
          var lengthPlaces = splitArray2.length;
        }
        console.log('userid = ' + userid);
        console.log('index = ' + usertemp._id);
          for(var index2=0; index2<lengthPlaces;index2++)
          {
          // console.log('which index in split2 : ' + splitArray2[index2]);
            if((!lengthStringPlaces.includes(splitArray2[index2])) && (!splitArray2[index2].includes('EMPTY'))){
            lengthStringPlaces = lengthStringPlaces.concat(splitArray2[index2],',');
            console.log('the string of user is: ' + lengthStringPlaces);
            }
          }
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



  });
};

exports.updateUser = (req,res,next) => {
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

exports.getAllPlaces = (req, res, next) => {
  const placeQuery = Place.find(); //bring all data from db
  let fetchedPlaces;
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
  }

  exports.onLikedPlace = (req, res, next) => {
    console.log('server user id get = ' + req.body.userId);
  }


  exports.kmeansGet = (req, res, next) => {
    var userid = req.params.id;
    //var id =0;
    var vectors = [];
    var vectors2 = [];
    var currentUserVector = {};
    var currentUserVector2 = {};
    var count =0;
    var i =0;
    var stringOfPlaceOfCurrentUser = '';
    User.find({}, function(err, users) {
        var userMap = {};

        users.forEach(function(user) {
          userMap[user._id] = user;
          count++;
          if(userMap[user._id].id != userid){
          vectors[i] = {
           // x: userMap[user._id].age,
          // x: 1,
            x: userMap[user._id].avg_age20,
            y:userMap[user._id].avg_age35,
            m:userMap[user._id].avg_age50,
            d:userMap[user._id].avg_age_120
            //a: userMap[user._id].nightLife,
            //b: userMap[user._id].shopping
           }
           vectors2[i] = {
            //  x: userMap[user._id].avg_age20,
            //  y:userMap[user._id].avg_age35,
            //  m:userMap[user._id].avg_age50,
            //  d:userMap[user._id].avg_age_120,
            //  a: userMap[user._id].avg_gender_place,
            //  b: userMap[user._id].age
            x: userMap[user._id].avg_gender_place,
            y:userMap[user._id].avg_sport_place,
            m:userMap[user._id].avg_culture_place,
            d:userMap[user._id].avg_food_place
            //a: userMap[user._id].nightLife,
            //b: userMap[user._id].shopping
            }
          vectors[i].id = (userMap[user._id].id);
          vectors2[i].id = (userMap[user._id].id);
          i++;
          }
          else{
            stringOfPlaceOfCurrentUser = userMap[user._id].liked_place;
            currentUserVector = {
            x: userMap[user._id].avg_age20,
            y:userMap[user._id].avg_age35,
            m:userMap[user._id].avg_age50,
            d:userMap[user._id].avg_age_120
           }
             // q: userMap[user._id].id }
              currentUserVector.id = (userMap[user._id].id);

              currentUserVector2 = {
                // x: userMap[user._id].avg_age20,
                // y:userMap[user._id].avg_age35,
                // m:userMap[user._id].avg_age50,
                // d:userMap[user._id].avg_age_120,
                // a: userMap[user._id].avg_gender_place,
                // b: userMap[user._id].age
                x: userMap[user._id].avg_gender_place,
            y:userMap[user._id].avg_sport_place,
            m:userMap[user._id].avg_culture_place,
            d:userMap[user._id].avg_food_place
               // b: userMap[user._id].shopping
              }
                 // q: userMap[user._id].id }
                  currentUserVector2.id = (userMap[user._id].id);
          }

        });
        var kmeans = new KmeansLib();
        var k =5;
        console.log(vectors.length);
        switch(true){
          case (vectors.length<25):
            k=vectors.length/5;
            console.log('k '+ k);
            break;
          case (vectors.length<48):
            k=vectors.length/8;
            console.log('k '+ k);
            break;
          case (vectors.length<100):
            k=vectors.length/10;
            console.log('k '+ k);
            break;
          case (vectors.length<200):
            k=vectors.length/20;
            console.log('k '+ k);
            break;
            case (vectors.length>=300):
            k=vectors.length/30;
            console.log('k '+ k);
            break;
        }
         //= vectors.length/7; // Groups Number
        const size = 2 // Group size

        var id =0;
        //var vectors = [];
        // for(var i=0;i<20;i++){
        // vectors[i] = { x: i, y: i,s:i,m:i,d:i }
        // vectors[i].id = 'a'+i;
        // }
        //kmeans.init({})
        console.log('k: ' + k);
        kmeans.init({k: k,runs: size,normalize: false });
        // kmeans.init({k: k,normalize: false });
        var sum = kmeans.calc(vectors);
        //The vector is mutated
        console.log('currentUser: ');
        console.log(currentUserVector);
        console.log('end currentUser');
        console.log('vectors :');
        console.log(vectors);
        console.log('end vectors');
        const machine = new KNearestNeighbors(
          vectors,
        [
          'x',
          'y',
          'm',
          'd',
         // 'a',
         // 'b',
        ]);
        var placeInKnn = machine.classify(
          currentUserVector
        , 1, 'k');

       // console.log(vectors);
        console.log('In first time the palce is: ' + placeInKnn)
  var m=0;
  var vectors3=[];
  //try the second kmeans
      for(var z=0;z< vectors.length;z++){
    if(vectors[z].k==placeInKnn){
      vectors3[m]=vectors2[z];
      m++;
    }
  }

        var kmeans2 = new KmeansLib();
        var k2 = 5; // Groups Number
        console.log('vectors3 :'+ vectors3.length);
        switch(true){
          case (vectors3.length<5):
            k2=vectors3.length/2;
            console.log('k '+ k2);
            break;
          case (vectors3.length<10):
            k2=vectors3.length/3;
            console.log('k '+ k2);
            break;
          case (vectors3.length<16):
            k2=vectors3.length/4;
            console.log('k '+ k2);
            break;
          case (vectors3.length<20):
            k2=vectors3.length/4;
            console.log('k '+ k2);
            break;
            case (vectors3.length>=25):
            k2=vectors3.length/5;
            console.log('k '+ k2);
            break;
        }
        console.log('k2: ' + k2);
        const size2 = 2 // Group size

        var id2 =0;

        kmeans2.init({k: k2,runs: size2,normalize: false });
        // kmeans.init({k: k,normalize: false });
        var sum2 = kmeans2.calc(vectors3);
        //The vector is mutated

        const machine2 = new KNearestNeighbors(
          vectors3,
        [
          'x',
          'y',
          'm',
          'd',
         // 'a',
         // 'b',
        ]);
        var placeInKnn2 = machine2.classify(
          currentUserVector2
        , 1, 'k');
        console.log('currentUser2: ')
        console.log(currentUserVector2);
        console.log('end currentUser2');
        console.log('vectors3 :');
        console.log(vectors3);
        console.log('end vectors3');
        console.log('In second time the palce is: ' + placeInKnn2)

        var lengthStringUsers = '';
        for(var index =0; index<vectors3.length;index++){
          if(vectors3[index].k == placeInKnn2){
            if(vectors3[index].id != userid){
            lengthStringUsers = lengthStringUsers.concat(vectors3[index].id,',');
            }
          }
        }
        //lengthStringUsers = lengthStringUsers.concat(userid,',');
        var splitArray =[];
        var splitArray2 =[];
        splitArray = lengthStringUsers.split(',');
       // console.log('splituser: ' + splitArray[0]);
        var lengthStringPlaces = '';
      //  console.log('length: ' + splitArray.length);
      var indexPo2 = 0;
        for (var indexPo = 0; indexPo<(splitArray.length-1);indexPo++)
        {
          // console.log('which user: ' + splitArray[index]);
          User.findById(splitArray[indexPo])
          .then(usertemp => {
            indexPo2++;
            console.log(usertemp.email);
          if (usertemp) {
          //  console.log('index: ' + splitArray);
            // if (userid == usertemp.id && indexPo2 == splitArray.length-1) {
            //   console.log('index insert id2 : ' + indexPo2);
            //   const userData = new User({
            //     _id: usertemp.id,
            //     email: usertemp.email,
            //     password: usertemp.password,
            //     firstName: usertemp.firstName,
            //     lastName: usertemp.lastName,
            //     age: usertemp.age,
            //     gneder: usertemp.gender,
            //     sport: usertemp.sport,
            //     culture: usertemp.culture,
            //     food: usertemp.food,
            //     liked_place: usertemp.liked_place,
            //     kmeans_array: lengthStringPlaces
            //   });
            //   User.updateOne({ _id: req.params.id}, userData)
            //   .then(result => {
            //       if (result.n > 0) {
            //         res.status(200).json(userData);
            //         // res.status(200).json({ message: "Update successful!" });
            //       } else {
            //         res.status(401).json({ message: "Not authorized!" });
            //       }
            //     })
            //     .catch(error => {
            //     res.status(500).json({
            //       message: "Couldn't udpate user!"
            //     });
            // });

            ////////////////////////////////////

            // User.findById(req.params.id)
            // .then(user => {
            //   if (user) {
            //     res.status(200).json(place);
            //   } else {
            //     res.status(404).json({ message: "Place not found!" });
            //   }
            // })
            // .catch(error => {
            //   res.status(500).json({
            //     message: "Fetching place failed!"
            //   });
            // });



            ///////////////////////////////////////

           // } else {
              splitArray2 = usertemp.liked_place.split(',');


          // console.log('all the split2 in user: ' + splitArray2);
          if(splitArray2.length>5){
            var lengthPlaces = 5;
          }
          else{
            var lengthPlaces = splitArray2.length;
          }
            for(var index2=0; index2<lengthPlaces;index2++)
            {
            // console.log('which index in split2 : ' + splitArray2[index2]);
              if((!lengthStringPlaces.includes(splitArray2[index2])) && (!splitArray2[index2].includes('EMPTY')) &&(!stringOfPlaceOfCurrentUser.includes(splitArray2[index2]))){
              lengthStringPlaces = lengthStringPlaces.concat(splitArray2[index2],',');
              console.log('the string of user is: ' + lengthStringPlaces + ' and the number is: ' + lengthStringPlaces.length/25);
              }
            }
          //}
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
      setTimeout(function() {
        User.findById(userid)
        .then(usertemp => {
        if (usertemp) {
          console.log('finish');
            const userData = new User({
              _id: usertemp.id,
              email: usertemp.email,
              password: usertemp.password,
              firstName: usertemp.firstName,
              lastName: usertemp.lastName,
              age: usertemp.age,
              gneder: usertemp.gender,
              sport: usertemp.sport,
              culture: usertemp.culture,
              food: usertemp.food,
              liked_place: usertemp.liked_place,
              liked_places_array: usertemp.liked_places_array,
              unliked_places_array: usertemp.unliked_places_array,
              kmeans_array: lengthStringPlaces,
              avg_gender_place: usertemp.avg_gender_place,
              avg_sport_place: usertemp.avg_sport_place,
              avg_culture_place: usertemp.avg_culture_place,
              avg_food_place: usertemp.avg_food_place,
              count_of_liked_places: usertemp.count_of_liked_places,
  sportsAndExtreme: usertemp.sportsAndExtreme,
  cultureAndHistoricalPlaces: usertemp.cultureAndHistoricalPlaces,
  attractionsAndLeisure: usertemp.attractionsAndLeisure,
  rest: usertemp.rest,
  nightLife: usertemp.nightLife,
  shopping: usertemp.shopping,
  avg_age20: usertemp.avg_age20,
  avg_age35: usertemp.avg_age35,
  avg_age50: usertemp.avg_age50,
  avg_age_120: usertemp.avg_age_120,
            });
            User.updateOne({ _id: req.params.id}, userData)
            .then(result => {
                if (result.n > 0) {
                  res.status(200).json(userData);
                  // res.status(200).json({ message: "Update successful!" });
                } else {
                  res.status(401).json({ message: "Not authorized!" });
                }
              })
              .catch(error => {
              res.status(500).json({
                message: "Couldn't udpate user!"
              });
          });

        }});
    }, 500);

    });
  }

  exports.upadePlaceAferLikeUnlike = (req, res, next) => {
    const place = new Place({
      _id: req.body.id,
      name: req.body.name,
      lat: req.body.lat,
      lng: req.body.lng,
      goal: req.body.goal,
      count_of_likes: req.body.count_of_likes,
      count_of_place_likes: req.body.count_of_place_likes,
      count_of_place_unlikes: req.body.count_of_place_unlikes
    });

    Place.updateOne({ _id: req.params.id }, place)
      .then(result => {
        if (result.n > 0) {
          res.status(200).json({ message: "Update place successful!" });
        } else {
          res.status(401).json({ message: "Not authorized to update place !" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Couldn't udpate place!!!!"
        });
      });


  }

//   exports.updatePlaceOnLikeClicked = (req, res, next) => {
//         Place.findById(req.body.id)
//         .then(place => {
//           if (place) {
//             const placeData = new Place({
//               _id: req.body.id,
//               name: req.body.name,
//               lat: req.body.lat,
//               lng: req.body.lng,
//               count_of_place_likes: place.count_of_place_likes + 1
//             });

//             Place.updateOne({ _id: req.params.id /*, creator: req.userData.userId */}, placeData)
//               .then(result => {
//                 if (result.n > 0) {
//                   res.status(200).json({ message: "Update successful!" });
//                 } else {
//                   res.status(401).json({ message: "Not authorized!" });
//                 }
//               })
//               .catch(error => {
//                 res.status(500).json({
//                   message: "Couldn't udpate place!"
//                 });
//               });
//           } else {
//             res.status(404).json({ message: "Place not found!" });
//           }
//         })
//         .catch(error => {
//           res.status(500).json({
//             message: "Fetching place failed!"
//           });
//         });

//   };

//   exports.updatePlaceOnUnLikeClicked = (req, res, next) => {
//     Place.findById(req.body.id)
//     .then(place => {
//       if (place) {
//         const placeData = new Place({
//           _id: req.body.id,
//           name: req.body.name,
//           lat: req.body.lat,
//           lng: req.body.lng,
//           count_of_place_unlikes: place.count_of_place_unlikes + 1
//         });

//         Place.updateOne({ _id: req.params.id /*, creator: req.userData.userId */}, placeData)
//           .then(result => {
//             if (result.n > 0) {
//               res.status(200).json({ message: "Update successful!" });
//             } else {
//               res.status(401).json({ message: "Not authorized!" });
//             }
//           })
//           .catch(error => {
//             res.status(500).json({
//               message: "Couldn't udpate place!"
//             });
//           });
//       } else {
//         res.status(404).json({ message: "Place not found!" });
//       }
//     })
//     .catch(error => {
//       res.status(500).json({
//         message: "Fetching place failed!"
//       });
//     });

// };


