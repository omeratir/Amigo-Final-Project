const Post = require("../models/post");
const Place = require("../models/place");
const User = require("../models/user");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    place: req.body.place,
    rating: req.body.rating,
    content: req.body.content,
    time_of_place: req.body.time_of_place,
    purpose_of_place: req.body.purpose_of_place,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
    //  Place.findOne({ name: req.body.place })
    //  .then(place => {
    //    // count number of posts
    //    ++place.count_of_post_added_to_place;
    //    console.log("post number " + place.count_of_post_added_to_place);
    //    User.findById(req.userData.userId)
    //    .then(user => {
    //      // check the place gender
    //      console.log("The user gender is: "+ user.gender);
    //      if(user.gender == 'male'){
    //        place.sum_place_for_gender += 1000;
    //       }
    //       if(user.gender == 'female'){
    //         place.sum_place_for_gender += 3000;
    //       }
    //       place.place_for_gender = place.sum_place_for_gender/place.count_of_post_added_to_place;

    //       if(place.place_for_gender > 2000){
    //         console.log("The place is for female");
    //       }
    //         if(place.place_for_gender < 2000){
    //           console.log("The place is for male");
    //         }
    //         if(place.place_for_gender == 2000){
    //           console.log("This the place is for both, the number is: "+ place.place_for_gender);
    //         }

    //         // check the place hobbie
    //         if(user.hobbies == 'Sport'){ // 7
    //           place.sport++;
    //           console.log("Sport" + place.sport);
    //         }
    //         if(user.hobbies == 'Culture'){ //8
    //           place.culture++;
    //           console.log("Culture " + place.culture);
    //         }
    //         if(user.hobbies == 'Food'){ //9
    //           place.food++;
    //           console.log("Food " + place.food);
    //         }
    //         let max = Math.max(place.sport, place.culture, place.food);
    //         if(max == place.sport){ // Sport
    //           place.hobbies = 7;
    //         }
    //         if(max == place.culture){ //Culture
    //           place.hobbies = 8;
    //         }
    //         if(max == place.food){ // Food
    //           place.hobbies = 9;
    //         }
    //         console.log(place.hobbies);

    //         // check the age
    //         console.log("The user age is: " + user.age);
    //         place.sum_place_for_age += user.age;
    //         console.log(place.sum_place_for_age);
    //         place.avg_ages_of_place = place.sum_place_for_age/place.count_of_post_added_to_place;
    //         console.log("The avg age of the place is: " + place.avg_ages_of_place);


    //         // purpoes
    //         if(req.body.purpose_of_place == 'Attractions & Leisure'){
    //           place.attractionsAndLeisure++;
    //         }
    //         if(req.body.purpose_of_place == 'Sport & Extreme'){
    //           place.sportsAndExtreme++;
    //         }
    //         if(req.body.purpose_of_place == 'Night Life'){
    //           place.nightLife++;
    //         }
    //         if(req.body.purpose_of_place == 'Culture &  Historical Places'){
    //           place.cultureAndHistoricalPlaces++;
    //         }
    //         if(req.body.purpose_of_place == 'Rest'){
    //           place.rest++;
    //         }
    //         if(req.body.purpose_of_place == 'Shopping'){
    //           place.shopping++;
    //         }
    //         let maxpurpose = Math.max(place.sportsAndExtreme, place.cultureAndHistoricalPlaces, place.attractionsAndLeisure, place.rest, place.nightLife, place.shopping);

    //         if(max == place.attractionsAndLeisure){
    //           place.purpose_of_place = 1;
    //           console.log("The place is attractionsAndLeisure")
    //         }
    //         if(max == place.sportsAndExtreme){
    //           place.purpose_of_place = 2;
    //           console.log("The place is sportsAndExtreme")
    //         }
    //         if(max == place.cultureAndHistoricalPlaces){
    //           place.purpose_of_place = 3;
    //           console.log("The place is cultureAndHistoricalPlaces")
    //         }
    //         if(max == place.nightLife){
    //           place.purpose_of_place = 4;
    //           console.log("The place is nightLife")
    //         }
    //         if(max == place.rest){
    //           place.purpose_of_place = 5;
    //           console.log("The place is rest")
    //         }
    //         if(max == place.shopping){
    //           place.purpose_of_place = 6;
    //           console.log("The place is shopping")
    //         }
    //         console.log("The purpse is: " + place.purpose_of_place);

    //         place.save();
    //       })
    // })

  post
    .save()
    .then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed!"
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    place: req.body.place,
    rating: req.body.rating,
    content: req.body.content,
    time_of_place: req.body.time_of_place,
    purpose_of_place: req.body.purpose_of_place,
    imagePath: imagePath,
    creator: req.userData.userId
  });

  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
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
        message: "Deleting posts failed!"
      });
    });
};

