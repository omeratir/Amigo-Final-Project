import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PlacesService } from 'src/app/places/places.service';
import { Place } from 'src/app/places/place.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { PageEvent } from '@angular/material';

@Component({
  templateUrl: './places-topten.component.html',
  styleUrls: ['./places-topten.component.css']
})
export class PlacestoptenComponent implements OnInit {

  isLoading = false;
  private authStatusSub: Subscription;
  private placesSub: Subscription;

  placeLiked: string;
  splitArray: string[] = [

  ];

  totalPlaces = 0;
  placesPerPage = 1000;
  placeslength = 1;
  currentPage = 1;

  lat = 52.373169;
  lng = 4.890660;
  zoom = 12;
  previous;

  userId: string;

  places: Place[] = [

  ];

  placeurl: string;
  placeName: string;
  index = 0;
  name = '';
  userIsAuthenticated = false;
  user: User;
  usersavedplaces: string;
  tempplacessave = [];
  pageSizeOptions = [1, 20, 40, 60];

  constructor(public authService: AuthService , public placesService: PlacesService, private router: Router
    ) {}

  ngOnInit() {
    this.placeLiked = 'EMPTY';
    this.splitArray = [' '];

    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    this.placesSub = this.placesService
        .getPlaceUpdateListener()
        .subscribe((placeData: { places: Place[]; placeCount: number }) => {
          // this.places = placeData.places;
          this.places = this.placesService.sortPlaces(placeData.places);
        });
  }

  clickedMarker(infoWindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infoWindow;
  }

  LikeClicked(placeid) {
    console.log('Like Clicked');
    console.log(placeid);
    if (this.placeLiked === 'EMPTY') {
      this.placeLiked = placeid;
    } else {
      this.placeLiked = this.placeLiked.concat(',');
      this.placeLiked = this.placeLiked.concat(placeid);
    }
  }


  UnLikeClicked(placeid) {
    console.log('UnLike Clicked');

    this.splitArray = this.placeLiked.split(',');
    this.placeLiked = 'EMPTY';

    for (const temp of this.splitArray) {
      if (temp !== placeid) {
        if (this.placeLiked === 'EMPTY') {
          this.placeLiked = temp;
        } else {
          this.placeLiked = this.placeLiked.concat(',');
          this.placeLiked = this.placeLiked.concat(temp);
        }
      }
    }
  }

  checkIfUserLikeThePlace(placeid) {
    if (this.placeLiked === 'EMPTY') {
      return false;
    }

    if (this.placeLiked.includes(placeid)) {
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
ifUserSaveThisPlace(placeid: string) {
  if (this.user.liked_place === 'EMPTY') {
    return false;
  }
  if (this.user.liked_place.includes(placeid)) {
    return true;
  }
  return false;
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

  onDelete(placeId: string) {
    this.isLoading = true;
    this.placesService.deletePlace(placeId).subscribe(() => {
      this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.placesPerPage = pageData.pageSize;
    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
  }


}