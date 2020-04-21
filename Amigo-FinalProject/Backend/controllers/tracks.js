const Track = require("../models/track");
exports.createTrack = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const track = new Track({ 
    hobbies: req.body.hobbies,
    purposeOfTheTrip: req.body.purposeOfTheTrip,
    sexRecommands: req.body.sexRecommands,
    rangeAges: req.body.rangeAges,
    amountOfDays: req.body.amountOfDays,
    amountOfLikes: req.body.amountOfLikes,
    listOfPlaces: req.body.listOfPlaces
    // creator: req.userData.userId
  }); 
  track.save()
    .then(createdTrack => {
      res.status(201).json({
        message: "Track added successfully",
        place: {
          ...createdTrack,
          id: createdTrack._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a track failed!"
      });
    });
};

exports.updateTrack = (req, res, next) => {
  const track = new Track({
    hobbies: req.body.hobbies,
    purposeOfTheTrip: req.body.purposeOfTheTrip,
    sexRecommands: req.body.sexRecommands,
    rangeAges: req.body.rangeAges,
    amountOfDays: req.body.amountOfDays,
    amountOfLikes: req.body.amountOfLikes,
    listOfPlaces: req.body.listOfPlaces
  });
  Place.updateOne({ _id: req.params.id, creator: req.userData.userId }, track)
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

exports.getTracks = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const placeQuery = Place.find();
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

exports.getTrack = (req, res, next) => {
  Place.findById(req.params.id)
    .then(place => {
      if (place) {
        res.status(200).json(place);
      } else {
        res.status(404).json({ message: "Track not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching track failed!"
      });
    });
};

exports.deletePlace = (req, res, next) => {
  Track.deleteOne({ _id: req.params.id, creator: req.userData.userId })
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
