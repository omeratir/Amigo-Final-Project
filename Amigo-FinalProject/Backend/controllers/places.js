const Place = require("../models/place");

exports.createPlace = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const place = new Place({
    name: req.body.name,
    lat: req.body.lat,
    lng: req.body.lng,
    goal: req.body.goal,
    genbder_avg: 0,
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
  const place = new Place({
    _id: req.body.id,
    name: req.body.name,
    lat: req.body.lat,
    lng: req.body.lng,
    creator: req.userData.userId
  });
  Place.updateOne({ _id: req.params.id, creator: req.userData.userId }, place)
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
