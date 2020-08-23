import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../user.model';
import { Place } from 'src/app/places/place.model';
import { AuthService } from '../auth.service';
import { PlacesService } from 'src/app/places/places.service';
import { Directionality } from '@angular/cdk/bidi';
import { Stringifiable } from 'd3';
import { LatLng } from '@agm/core';

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
          unliked_place: userData.unliked_place,
          save_place: userData.save_place,
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
          this.index = 1;

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
              this.likedPlaces.push(this.place);

              if (this.origin.lat === 0) {
                this.origin.lat = +placeData.lat;
                this.origin.lng = +placeData.lng;
                this.index ++;
              } else {
                this.destination.lat = +placeData.lat;
                this.destination.lng = +placeData.lng;
                if (this.index === this.splitArray.length) {
                  this.tempDir = new Dir(this.origin, this.destination);
                  this.directions.push(this.tempDir);
                } else {
                  this.waypoints.push( {location: { lat: this.destination.lat , lng: this.destination.lng }});
                  this.index ++;
                }
              }
            });
          }
        }

        }
    });
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
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.unliked_place, this.user.save_place, this.user.kmeans_array );

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
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.unliked_place, this.user.save_place, this.user.kmeans_array );

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
          unliked_place: userData.unliked_place,
          save_place: userData.save_place,
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

