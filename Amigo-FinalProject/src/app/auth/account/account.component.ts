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

  ifuserlikedplaces: boolean;
  colorurl: string;

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


    // this.placesService.getPlaceFullData('5f49f6fcdd1d6828683cc1ad').subscribe(placeData => {
    //         this.placeFull = {
    //           id: placeData._id,
    //           name: placeData.name,
    //           lat: placeData.lat,
    //           lng: placeData.lng,
    //           goal: placeData.goal,
    //           count_of_likes: placeData.count_of_likes,
    //           count_of_place_likes: placeData.count_of_place_likes,
    //           count_of_place_unlikes: placeData.count_of_place_unlikes,
    //           creator: placeData.creator,
    //           photo: placeData.photo,
    //           gender_avg: placeData.gender_avg,
    //           count_sport: placeData.count_sport,
    //           count_culture: placeData.count_culture,
    //           count_food: placeData.count_food,
    //           count_female: placeData.count_female,
    //           count_male: placeData.count_male,
    //           avg_sport: placeData.avg_sport,
    //           avg_culture: placeData.gender_avg,
    //           avg_food: placeData.avg_food,
    //           count_age20: placeData.count_age20,
    //           count_age35: placeData.count_age35,
    //           count_age50: placeData.count_age50,
    //           count_age120: placeData.count_age120
    //         };
    //         console.log('place data');
    //         console.log(placeData);
    //       });

    // this.authService.getUserFullData(this.userId).subscribe(userData => {
    //   this.userFulldata = {
    //     email: userData.email,
    //     password: userData.password,
    //     firstName: userData.firstName,
    //     lastName: userData.lastName,
    //     age: userData.age,
    //     gender: userData.gender,
    //     sport: userData.sport,
    //     culture: userData.culture,
    //     food: userData.food,
    //     liked_place: userData.liked_place,
    //     liked_places_array: userData.liked_places_array,
    //     unliked_places_array: userData.unliked_places_array,
    //     kmeans_array: userData.kmeans_array,
    //     count_of_liked_places: userData.count_of_liked_places,
    //     sportsAndExtreme: userData.sportsAndExtreme,
    //     cultureAndHistoricalPlaces: userData.cultureAndHistoricalPlaces,
    //     attractionsAndLeisure: userData.attractionsAndLeisure,
    //     rest: userData.rest,
    //     nightLife: userData.nightLife,
    //     shopping: userData.shopping,
    //     avg_age20: userData.avg_age20,
    //     avg_age35: userData.avg_age35,
    //     avg_age50: userData.avg_age50,
    //     avg_age_120: userData.avg_age_120,
    //     avg_gender_place: userData.avg_gender_place,
    //     avg_sport_place: userData.avg_sport_place,
    //     avg_culture_place: userData.avg_culture_place,
    //     avg_food_place: userData.avg_food_place
    //   };
    //   console.log('user data');
    //   console.log(userData);

    // });


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
              // this.likedPlaces.push(this.place);


              //for (i = 0; i < this.splitArray.length; i++) {
              tempArr[this.index] = placeData;
              this.index++;
              console.log(tempArr[0]);
              // console.log(tempArr);
              // this.likedPlaces = this.distanceFromStart(tempArr);
              // console.log('check avu');
              // console.log(this.likedPlaces );
              // if (this.origin.lat === 0) {
              //   this.origin.lat = +tempArr[0].lat;
              //   this.origin.lng = +tempArr[0].lng;
              //   this.index ++;
              // } else {
              //   this.destination.lat = +tempArr[1].lat;
              //   this.destination.lng = +tempArr[1].lng;
              //   if (this.index === this.splitArray.length) {
              //     this.tempDir = new Dir(this.origin, this.destination);
              //     this.directions.push(this.tempDir);
              //   } else {
              //     this.waypoints.push( {location: { lat: this.destination.lat , lng: this.destination.lng }});
              //     this.index ++;
              //   }
              // }
            });

          }

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
              this.likedPlaces.push(this.place);
            });
          }
        }
        }
    });


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

  // getDirection(likedPlaces: Place[]) {
  //   console.log('get');
  //   console.log(likedPlaces);
  //   this.index = 0;

  //   this.origin = {lat: 0, lng: 0};
  //   this.destination = {lat: 0, lng: 0};
  //   this.directions = [];

  //   this.tempDir = new Dir(this.origin, this.destination);
  //   console.log(this.tempDir);

  //   this.placesfordir = likedPlaces;
  //   console.log('places');
  //   console.log(this.placesfordir);
  //   console.log('len = ' + this.placesfordir.length);
  //   console.log('len = ' + this.likedPlaces.length);

  //   for (const place of this.placesfordir) {
  //     console.log('for loop');
  //     if (this.origin.lat === 0) {
  //         console.log('first');
  //         this.origin = { lat: place.lat , lng: place.lng };
  //       } else {
  //         console.log('second');
  //         this.destination = { lat: place.lat , lng: place.lng };

  //         this.tempDir = new Dir(this.origin, this.destination);
  //         console.log(this.tempDir);
  //         this.directions.push(this.tempDir);

  //         this.origin = this.destination;
  //       }
  //     }

  //   console.log('directions');
  //   console.log(this.directions);
  //   return true;
  // }


}

