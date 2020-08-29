import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { PlacesService } from '../places/places.service';
import { Place } from '../places/place.model';
import { User } from '../auth/user.model';
import { AuthService } from '../auth/auth.service';


@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  lat = 52.373169;
  lng = 4.890660;
  zoom = 12;
  previous;

  user: User;
  isLoading = false;

  splitArray: string[] = [

  ];

  placelist: string;

  userIsAuthenticated = false;
  userId: string;

  totalPlaces = 0;
  placesPerPage = 2000;
  placeslength = 1;
  currentPage = 1;

  places: Place[] = [

  ];

  private placesSub: Subscription;
  private authStatusSub: Subscription;


  placeMarker($event) {
    console.log('lat:' + $event.coords.lat);
    console.log('lng:' + $event.coords.lng);
  }

  clickedMarker(infoWindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infoWindow;
  }

  constructor(
    public placesService: PlacesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.placesSub = this.placesService
      .getPlaceUpdateListener()
      .subscribe((placeData: { places: Place[]; placeCount: number }) => {
        this.isLoading = false;
        this.totalPlaces = placeData.placeCount;
        this.places = placeData.places;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    if (this.userIsAuthenticated) {
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
}

LikeClicked(place) {
  console.log('Like Clicked');
  // add the placeid to the list.
  console.log(this.user.liked_place);
  if (this.user.liked_place === 'EMPTY') {
    this.user.liked_place = place.id;
  } else {
    this.placelist = this.user.liked_place;
    this.placelist = this.placelist.concat(',', place.id);
    this.user.liked_place = this.placelist;
  }
  console.log(this.user.liked_place);
    // tslint:disable-next-line: max-line-length
  this.placesService.updatePlace(place.id , place.name , place.lat, place.lng , this.userId, true, place.photo);

  this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
    // tslint:disable-next-line: max-line-length
    , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.liked_places_array, this.user.unliked_places_array, this.user.kmeans_array );

  }


UnLikeClicked(place) {
  console.log('UnLike Clicked');
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
}

checkIfUserLikeThePlace(placeid) {
  if (this.user.liked_place === 'EMPTY') {
    return false;
  }
  if (this.user.liked_place.includes(placeid)) {
    return true;
  }
  // this.splitArray = this.user.liked_place.split(',');

  // for (const place of this.splitArray) {
  //   if (place === placeid) {
  //     return true;
  //   }
  // }

  return false;
}

}

