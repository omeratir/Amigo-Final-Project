const Route = require("../models/route");

exports.createRoute = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const route = new Route({
    name: req.body.name,
    places: req.body.places,
    creator: req.userData.userId
  });
  route
    .save()
    .then(createdRoute => {
      res.status(201).json({
        message: "Route added successfully",
        route: {
          ...createdRoute,
          id: createdRoute._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a route failed!"
      });
    });
};

exports.updateRoute = (req, res, next) => {
  const route = new Route({
    _id: req.body.id,
    name: req.body.name,
    places: req.body.places,
    creator: req.userData.userId
  });

  Route.updateOne({ _id: req.params.id, creator: req.userData.userId }, route)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate route!"
      });
    });
};

exports.getRoutes = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const routeQuery = Route.find();
  let fetchedRoutes;
  if (pageSize && currentPage) {
    routeQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  routeQuery
    .then(documents => {
      fetchedRoutes = documents;
      return Route.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Routes fetched successfully!",
        routes: fetchedRoutes,
        maxRoutes: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching routes failed!"
      });
    });
};

exports.getRoute = (req, res, next) => {
  Route.findById(req.params.id)
    .then(route => {
      if (route) {
        res.status(200).json(route);
      } else {
        res.status(404).json({ message: "Route not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching route failed!"
      });
    });
};

exports.deleteRoute = (req, res, next) => {
  Route.deleteOne({ _id: req.params.id, creator: req.userData.userId })
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
        message: "Deleting routes failed!"
      });
    });
};

