import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../user.model';
import { Place } from 'src/app/places/place.model';
import { AuthService } from '../auth.service';
import { PlacesService } from 'src/app/places/places.service';
import { Directionality } from '@angular/cdk/bidi';
import { Stringifiable } from 'd3';
import { LatLng } from '@agm/core';
import { identifierModuleUrl } from '@angular/compiler';
import { callbackify } from 'util';
import { PlaceFullData } from 'src/app/places/placeFullData.model';
import { UserFullData } from '../userfulldata.model';

interface Direction {
  origin: {lat, lng};
  destination: {lat, lng};
  // renderOptions: { polylineOptions: { strokeColor } };
}

class Dir implements Direction {
    constructor(public origin: any, public destination: any) {

    }
}

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})


export class AccountComponent implements OnInit {
  userIsAuthenticated = false;
  userId: string;
  user: User;
  userFulldata: UserFullData;
  username: string;

  waypoints: any[];
  placesroute = '';
  ifuserlikedplaces: boolean;
  colorurl: string;
  allPlaces: Place[] = [

  ];
  index = 0;

  latitude = 52.373169;
  longitude = 4.890660;
  zoom = 12;
  previous;
  place: Place;

  public origin: any;
  public destination: any;

  name = '';
  lat = '';
  lng = '';

  totalPlaces = 0;
  placesPerPage = 2000;
  placeslength = 1;
  currentPage = 1;

  directions: Dir[] = [];

  tempDir: Dir;

  placeFull: PlaceFullData;

  places: Place[] = [

  ];

  likedPlaces: Place[] = [

  ];

  placesfordir: Place[] = [

  ];

  likeplaces: string;

  splitArray: string[] = [

  ];

  likedplacesarray: string[] = [

  ];

  private placesSub: Subscription;


  userPlacesArray: string[] = [

  ];

  placesKMEANS: Place[] = [

  ];

  usersavedplaces: string;

  tempplacessave: string[] = [];

  tempPlaces: Place[] = [

  ];

  aviad = false;
  userFull: UserFullData;
  chartMap = {};
  placeurl: string;
  placeName: string[] = [];
  tempafterdelete: string;


  private authListenerSubs: Subscription;
  placelist: string;

  constructor(
    private authService: AuthService,
    public placesService: PlacesService
    ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    this.placesSub = this.placesService
          .getPlaceUpdateListener()
          .subscribe((placeData: { places: Place[]; placeCount: number }) => {
            this.places = placeData.places;
          });


    this.authService.getUserData(this.userId).subscribe(userData => {
        this.user = {
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          age: userData.age,
          gender: userData.gender,
          sport: userData.sport,
          culture: userData.culture,
          food: userData.food,
          liked_place: userData.liked_place,
          liked_places_array: userData.liked_places_array,
          unliked_places_array: userData.unliked_places_array,
          kmeans_array: userData.kmeans_array
        };

        this.username = userData.firstName;

        if (this.notEmpty(userData.liked_place)) {
          this.splitArray = userData.liked_place.split(',');

          this.origin = {lat: 0, lng: 0};
          this.destination = {lat: 0, lng: 0};

          this.likedPlaces = [];
          this.directions = [];
          this.waypoints = [];
          this.index = 0;
          const tempArr = [];


          for (const place of this.splitArray) {
            if (place) {
            this.placesService.getPlace(place).subscribe(placeData => {
              this.place = {
                id: placeData._id,
                name: placeData.name,
                lat: placeData.lat,
                lng: placeData.lng,
                goal: placeData.goal,
                count_of_likes: placeData.count_of_likes,
                count_of_place_likes: placeData.count_of_place_likes,
                count_of_place_unlikes: placeData.count_of_place_unlikes,
                creator: placeData.creator,
                photo: placeData.photo
              };
              //
              
              tempArr[this.index] = this.place;
              //this.likedPlaces.push(this.place);
              console.log('aviad2',tempArr );
              //this.allPlaces.push(tempArr[0);
              this.index++;
              console.log(tempArr[0]);
            });
            this.likedPlaces.push(tempArr[0]);
          }
          console.log('shiran',this.likedPlaces);
        }
          setTimeout(() => {


          console.log('check avu first');
          this.likedPlaces = this.distanceFromStart(tempArr);
          console.log('check avu');
          console.log(this.likedPlaces );
          for (let index2 = 0; index2 < this.likedPlaces.length; index2++) {

            if (this.origin.lat === 0) {
            this.origin.lat = +this.likedPlaces[index2].lat;
            this.origin.lng = +this.likedPlaces[index2].lng;
            //this.index ++;
          } else {
            this.destination.lat = +this.likedPlaces[index2].lat;
            this.destination.lng = +this.likedPlaces[index2].lng;
            if (index2 + 1 === this.likedPlaces.length) {
              console.log('index3: ' + index2);
              this.tempDir = new Dir(this.origin, this.destination);
              this.directions.push(this.tempDir);
            } else {
              this.waypoints.push( {location: { lat: this.destination.lat , lng: this.destination.lng }});
             // this.index ++;
            }
          }
        }
      }, 1500);
        }

    });
   
}

distanceFromStart(array) {
  console.log('distanceFromStart');
  console.log(array);
  if (array.lentgh === 1) {
    return array;
  } else {

  let dist = 0;
  let temp = 0;
  var UpdateArrayByDistance = [];
  UpdateArrayByDistance[0] = array[0];
  //UpdateArrayByDistance
  //UpdateArrayByDistance.push(array);
  console.log('distanceFromMiddle');
  console.log(UpdateArrayByDistance);
  let checkIfExistPlace = '';
  //UpdateArrayByDistance[0].name;
  console.log(array.length);
  for (let index = 0; index < array.length; index++) {
    checkIfExistPlace = checkIfExistPlace.concat(UpdateArrayByDistance[index].name);
    temp = 10000000;
    console.log('index : ' + index);
    for (let index2 = 0; index2 < array.length; index2++) {
        console.log('index2 : ' + index2);
        console.log('checkIfExistPlace: ' + checkIfExistPlace);
        console.log(array[index2].name);
        if (!checkIfExistPlace.includes(array[index2].name)) {
          console.log(UpdateArrayByDistance[index]);
          console.log(array[index2]);
          dist = this.distance(UpdateArrayByDistance[index].lat, UpdateArrayByDistance[index].lng, array[index2].lat, array[index2].lng);
          console.log('dist : ' + dist);
          console.log('temp : ' + temp);
          if (dist !== 0) {
      if ( (Math.min(dist, temp)) === dist) {
        UpdateArrayByDistance[index + 1] = array[index2];
       // checkIfExistPlace = checkIfExistPlace.concat(UpdateArrayByDistance[index + 1].name);
        console.log(UpdateArrayByDistance[index + 1]);
        temp = dist;
      }

     }
      }
    }
    }
  }
  console.log(array);
  // console.log(UpdateArrayByDistance);
  return UpdateArrayByDistance;
}

 distance(lat1, lon1, lat2, lon2) {
	// tslint:disable-next-line: indent
	if ((lat1 === lat2) && (lon1 === lon2)) {
		return 0;
	} else {
		const radlat1 = Math.PI * lat1 / 180;
		const radlat2 = Math.PI * lat2 / 180;
		const theta = lon1 - lon2;
		const radtheta = Math.PI * theta / 180;
		let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180 / Math.PI;
		dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;
		return dist;
	}
}


checkPlaceGoal(place) {
  this.colorurl = './assets/images/red-dot.png';

  if (place.goal === 'Attractions & Leisure') {
    this.colorurl = './assets/images/green-dot.png';
  }

  if (place.goal === 'Shopping') {
    this.colorurl = './assets/images/blue-dot.png';
  }

  if (place.goal === 'Culture & Historical Places') {
    this.colorurl = './assets/images/purple-dot.png';
  }


  if (place.goal === 'Relaxing') {
    this.colorurl = './assets/images/pink-dot.png';
  }

  if (place.goal === 'Sport & Extreme') {
    this.colorurl = './assets/images/yellow-dot.png';
  }

  if (place.goal === 'Night Life') {
    this.colorurl = './assets/images/orange-dot.png';
  }

  return true;
}

  notEmpty(likedplace) {
    if (likedplace !== 'EMPTY') {
      this.ifuserlikedplaces = true;
      return true;
    }
    this.ifuserlikedplaces = false;
    return false;
  }

  clickedMarker(infoWindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infoWindow;
  }

  LikeClicked(place, infoWindow) {
    // add the placeid to the list.
    if (this.user.liked_place === 'EMPTY') {
      this.user.liked_place = place.id;
    } else {
      this.placelist = this.user.liked_place;
      this.placelist = this.placelist.concat(',', place.id);
      this.user.liked_place = this.placelist;
    }
    this.placesService.updatePlace(place.id , place.name , place.lat, place.lng , this.userId, true, place.photo);

    this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
      // tslint:disable-next-line: max-line-length
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.liked_places_array, this.user.unliked_places_array, this.user.kmeans_array );

    }


UnLikeClicked(place, infoWindow) {
    // remove the placeid to the list.
    this.splitArray = this.user.liked_place.split(',');

    this.user.liked_place = 'EMPTY';

    for (const placeid of this.splitArray) {
      if (placeid !== place.id) {
        if (this.user.liked_place === 'EMPTY') {
          this.user.liked_place = placeid;
        } else {
          this.placelist = this.user.liked_place;
          this.placelist = this.placelist.concat(',', placeid);
          this.user.liked_place = this.placelist;
        }
      }
      
  }
    // tslint:disable-next-line: max-line-length
    this.placesService.updatePlace(place.id , place.name , place.lat, place.lng , this.userId, true, place.photo);

    this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
      // tslint:disable-next-line: max-line-length
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.liked_places_array, this.user.unliked_places_array, this.user.kmeans_array );

    this.authService.getUserData(this.userId).subscribe(userData => {
        this.user = {
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          age: userData.age,
          gender: userData.gender,
          sport: userData.sport,
          culture: userData.culture,
          food: userData.food,
          liked_place: userData.liked_place,
          liked_places_array: userData.liked_places_array,
          unliked_places_array: userData.unliked_places_array,
          kmeans_array: userData.kmeans_array
        };

        if (this.notEmpty(userData.liked_place)) {
          this.splitArray = userData.liked_place.split(',');

          this.likedPlaces = [];
          var tempArr = [];
          var index2 = 0;
          for (const placeid of this.splitArray) {
            if (placeid) {
            this.placesService.getPlace(placeid).subscribe(placeData => {
              this.place = {
                id: placeData._id,
                name: placeData.name,
                lat: placeData.lat,
                lng: placeData.lng,
                goal: placeData.goal,
                count_of_likes: placeData.count_of_likes,
                count_of_place_likes: placeData.count_of_place_likes,
                count_of_place_unlikes: placeData.count_of_place_unlikes,
                creator: placeData.creator,
                photo: placeData.photo
              };
              tempArr[index2] = placeData;
              index2++;
              //this.likedPlaces.push(this.place);
            });
            this.likedPlaces.push(tempArr[0]);
          }
        }
        this.ifuserlikedplaces=true;
        setTimeout(() => {
          

          console.log('check avu first');
          this.likedPlaces = this.distanceFromStart(tempArr);
          console.log('check avu');
          console.log(this.likedPlaces );
          this.origin.lat =0;
          this.directions = [];
          this.waypoints = [];
          for (let index2 = 0; index2 < this.likedPlaces.length; index2++) {

            if (this.origin.lat === 0) {
              console.log('chen');
            this.origin.lat = +this.likedPlaces[index2].lat;
            this.origin.lng = +this.likedPlaces[index2].lng;
            //this.index ++;
          } else {
            this.destination.lat = +this.likedPlaces[index2].lat;
            this.destination.lng = +this.likedPlaces[index2].lng;
            if (index2 + 1 === this.likedPlaces.length) {
              console.log('index3: ' + index2);
              this.tempDir = new Dir(this.origin, this.destination);
              this.directions.push(this.tempDir);
            } else {
              this.waypoints.push( {location: { lat: this.destination.lat , lng: this.destination.lng }});
             // this.index ++;
            }
          }
        }
      }, 1500);


        }
    });
    //window.location.reload();
    location.reload();
  }

checkIfUserLikeThePlace(placeid) {
    if (this.user.liked_place === 'EMPTY') {
      return false;
    }
    if (this.user.liked_place.includes(placeid)) {
      return true;
    }

    return false;
  }

  ifUserSaveThisPlace(placeid: string) {
    if (this.user.liked_place === 'EMPTY') {
      return false;
    }
    if (this.user.liked_place.includes(placeid)) {

      return true;
    }
    return false;
  }

  onUnSavePlaceClicked(place: Place) {
    this.usersavedplaces = this.user.liked_place;

    this.tempplacessave = this.user.liked_place.split(',');
    this.user.liked_place = '';
    for (const temp of this.tempplacessave) {
      if (temp !== place.id) {
        this.user.liked_place = this.user.liked_place.concat(temp, ',');
      }
    }
    if (this.user.liked_place === '') {
      this.user.liked_place = 'EMPTY';
    }

    // tslint:disable-next-line: max-line-length
    this.placesService.updatePlace(place.id , place.name , place.lat, place.lng , this.userId, true, place.photo);

      // tslint:disable-next-line: max-line-length
    this.authService.upadateUserAfterUnSavePlace(place.id, this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
        // tslint:disable-next-line: max-line-length
        , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.usersavedplaces, this.user.liked_places_array, this.user.unliked_places_array, this.user.kmeans_array );
    // this.user.liked_place = this.authService.getUserSavedPlaces();
    // this.updateUser();
    this.updateListAfterLikeOrUnlikeClicked(place);
}

updateListAfterLikeOrUnlikeClicked(place: Place) {
  var placeid = ''
  this.tempPlaces = [];
  this.placesService.getPlaceFullData(place.id).subscribe(placeData => {
    this.placeFull = {
      ...placeData,
      id: placeData._id
    };

    for (const temp of this.placesKMEANS) {
      if (temp.id === placeData._id) {
        placeid = temp.id;
        this.tempPlaces.push(this.placeFull);
      } else {
        this.tempPlaces.push(temp);
      }
    }
    this.placesKMEANS = [];
    this.placesKMEANS = this.tempPlaces;
});
  this.checkIfUserLikeThePlace(placeid);
  this.checkIfUserUnLikeThePlace(placeid);

}


  checkIfUserUnLikeThePlace(placeid) {
    if (this.user.unliked_places_array === 'EMPTY') {
      return false;
    }
    if (this.user.unliked_places_array.includes(placeid)) {
      return true;
    }
    return false;
  }

  linkPlace(placename) {
    this.placeurl = 'https://www.google.com/search?q=';
    this.placeName = placename.split(' ');
    this.index = 0;
    this.name = '';

    for (const temp of this.placeName) {
      this.placeurl = this.placeurl.concat(temp);
      this.placeurl = this.placeurl.concat('+');
    }
    return true;
  }

  onSavePlaceClicked(place: Place) {
    this.usersavedplaces = this.user.liked_place;
    if (this.user.liked_place === 'EMPTY') {
      this.user.liked_place = place.id;
   } else {
    this.user.liked_place = this.user.liked_place.concat(',', place.id);
   }
    // tslint:disable-next-line: max-line-length
    this.placesService.updatePlace(place.id , place.name , place.lat, place.lng , this.userId, true, place.photo);

    // tslint:disable-next-line: max-line-length
    this.authService.upadateUserAfterSavePlace(place.id, this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
      // tslint:disable-next-line: max-line-length
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.usersavedplaces, this.user.liked_places_array, this.user.unliked_places_array, this.user.kmeans_array );
    this.user.liked_place = this.authService.getUserSavedPlaces();
    this.updateUser();
    this.updateListAfterLikeOrUnlikeClicked(place);
  }

  updateUser() {
    this.authService.getUserData(this.userId).subscribe(userData => {
      this.user = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age,
        gender: userData.gender,
        sport: userData.sport,
        culture: userData.culture,
        food: userData.food,
        liked_place: userData.liked_place,
        liked_places_array: userData.liked_places_array,
        unliked_places_array: userData.unliked_places_array,
        kmeans_array: userData.kmeans_array
    };
  });
  }

  removeLike(place) {
    console.log('Remove Like Clicked');
      // remove the placeid to the list.
    this.splitArray = [];
    this.splitArray = this.user.liked_places_array.split(',');

    this.user.liked_places_array = 'EMPTY';

    for (const placeid of this.splitArray) {
        if (placeid !== place.id) {
          if (this.user.liked_places_array === 'EMPTY') {
            this.user.liked_places_array = placeid;
          } else {
            this.placelist = this.user.liked_places_array;
            this.placelist = this.placelist.concat(',', placeid);
            this.user.liked_places_array = this.placelist;
          }
        }
      }


    this.placesService.updatePlaceOnLikeOrUnlike(place.id , place.name , place.lat, place.lng , place.goal, place.count_of_likes, place.count_of_place_likes - 1, place.count_of_place_unlikes , place.photo);

    this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName

        , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.liked_places_array, this.user.unliked_places_array, this.user.kmeans_array );


    this.updateListAfterLikeOrUnlikeClicked(place);

    }

    removeUnlike(place) {
      console.log('Remove UnLike Clicked');
      ////////////////////////////////////////////////
      const regex = `${place.id},*`;
      this.user.unliked_places_array = this.user.unliked_places_array.replace(new RegExp(regex, 'g') , '');

      if (this.user.unliked_places_array === ',' || this.user.unliked_places_array === '') {
        this.user.unliked_places_array = 'EMPTY';
      }

      this.placesService.updatePlaceOnLikeOrUnlike(place.id , place.name , place.lat, place.lng , place.goal, place.count_of_likes, place.count_of_place_likes , place.count_of_place_unlikes - 1, place.photo);

      this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
          // tslint:disable-next-line: max-line-length
          , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.liked_places_array, this.user.unliked_places_array, this.user.kmeans_array );


      this.updateListAfterLikeOrUnlikeClicked(place);

      }

      deletePlace(placeid) {
        console.log('place id = ' + placeid);

        this.tempPlaces = [];
        this.tempafterdelete = 'EMPTY';
        for (const temp of this.placesKMEANS) {
          if (temp.id !== placeid) {
            this.tempPlaces.push(temp);

            if (this.tempafterdelete === 'EMPTY') {
              this.tempafterdelete = temp.id;
            } else {
              this.tempafterdelete.concat(',');
              this.tempafterdelete.concat(temp.id);
            }
          }
        }
        this.placesKMEANS = [];
        this.placesKMEANS = this.tempPlaces;

        console.log('kmeans array : ' + this.user.kmeans_array);
        console.log('after delete = ' + this.tempafterdelete);

        this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
          , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.liked_places_array, this.user.unliked_places_array, this.user.kmeans_array );
      }



}