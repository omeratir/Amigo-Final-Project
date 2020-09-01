import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { AuthService } from '../../auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { PlaceFullData } from '../placeFullData.model';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.css']
})
export class PlaceListComponent implements OnInit, OnDestroy {

  places: Place[] = [

  ];

  user: User;

  splitArray: string[] = [

  ];
  aviad = false;
  tempPlaces = [];
  placeFull : PlaceFullData;
  tempplacessave = [];
  placelist: string;
  placeurl:string;
  userIsAuthenticated = false;
  userId: string;
  placeName:string;
  index = 0;
  name = '';
  usersavedplaces: string;
  isLoading = false;
  totalPlaces = 0;
  placesPerPage = 20;
  placeslength = 1;
  currentPage = 1;
  previous;
  latitude = 52.373169;
  longitude = 4.890660;
  zoom = 12;
  pageSizeOptions = [1, 20, 40, 60];
  private placesSub: Subscription;
  private authStatusSub: Subscription;

  public isLiked = false;
  public isUnLiked = false;
  public isFavorite = false;
  public placeUrl: string;

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

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.placesPerPage = pageData.pageSize;
    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
  }

  onDelete(placeId: string) {
    this.isLoading = true;
    this.placesService.deletePlace(placeId).subscribe(() => {
      this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.placesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  clickedMarker(infoWindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infoWindow;
  }

  setMapValues(place: Place) {
    this.latitude = +place.lat;
    this.longitude = +place.lng;
    return true;
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



LikeClicked(place) {
  this.aviad = false;
  console.log('Like Clicked');
    // add the placeid to the list.
  this.placelist = '';
  if (this.user.liked_places_array === 'EMPTY') {
      this.user.liked_places_array = place.id;
    } else {
      this.placelist = this.user.liked_places_array;
      this.placelist = this.placelist.concat(',', place.id);
      this.user.liked_places_array = this.placelist;
    }

    if (this.checkIfUserUnLikeThePlace(place.id)) {
      this.splitArray = [];
      this.splitArray = this.user.unliked_places_array.split(',');

      this.user.unliked_places_array = 'EMPTY';

      for (const placeid of this.splitArray) {
        if (placeid !== place.id) {
          if (this.user.unliked_places_array === 'EMPTY') {
            this.user.unliked_places_array = placeid;
          } else {
            this.placelist = this.user.unliked_places_array;
            this.placelist = this.placelist.concat(',', placeid);
            this.user.unliked_places_array = this.placelist;
          }
        }
      }

    // tslint:disable-next-line: max-line-length
      this.placesService.updatePlaceOnLikeOrUnlike(place.id , place.name , place.lat, place.lng , place.goal, place.count_of_likes, place.count_of_place_likes + 1 , place.count_of_place_unlikes - 1, place.photo);

      this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
      // tslint:disable-next-line: max-line-length
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.liked_places_array, this.user.unliked_places_array, this.user.kmeans_array );

    // tslint:disable-next-line: align
    } else {
    // tslint:disable-next-line: max-line-length
    this.placesService.updatePlaceOnLikeOrUnlike(place.id , place.name , place.lat, place.lng , place.goal, place.count_of_likes, place.count_of_place_likes + 1 , place.count_of_place_unlikes, place.photo);

    this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
      // tslint:disable-next-line: max-line-length
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.liked_places_array, this.user.unliked_places_array, this.user.kmeans_array );
    }

  this.tempPlaces = [];

}

UnLikeClicked(place) {
  this.aviad = false;
  console.log('UnLike Clicked');
    // remove the placeid to the list.
    // add the placeid to the list.
  this.placelist = '';
  if (this.user.unliked_places_array === 'EMPTY') {
      this.user.unliked_places_array = place.id;
    } else {
      this.placelist = this.user.unliked_places_array;
      this.placelist = this.placelist.concat(',', place.id);
      this.user.unliked_places_array = this.placelist;
    }

  if (this.checkIfUserLikeThePlace(place.id)) {
      this.splitArray = [];
      this.splitArray = this.user.liked_places_array.split(',');

      this.user.liked_places_array = 'EMPTY';

      for (const placeid of this.splitArray) {
        if (placeid !== place.id) {
          if (this.user.liked_places_array === 'EMPTY') {
            this.user.liked_places_array = placeid;
            //this.aviad=true;
          } else {
            this.placelist = this.user.liked_places_array;
            this.placelist = this.placelist.concat(',', placeid);
            this.user.liked_places_array = this.placelist;
            //this.aviad=true;
          }
        }
    }
    // tslint:disable-next-line: max-line-length
      this.placesService.updatePlaceOnLikeOrUnlike(place.id , place.name , place.lat, place.lng , place.goal, place.count_of_likes, place.count_of_place_likes - 1, place.count_of_place_unlikes + 1, place.photo);

      this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
      // tslint:disable-next-line: max-line-length
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.liked_places_array, this.user.unliked_places_array, this.user.kmeans_array );
    } else {
      //this.aviad=true;
          // tslint:disable-next-line: max-line-length
    this.placesService.updatePlaceOnLikeOrUnlike(place.id , place.name , place.lat, place.lng , place.goal, place.count_of_likes, place.count_of_place_likes , place.count_of_place_unlikes + 1, place.photo);

    this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
      // tslint:disable-next-line: max-line-length
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.liked_places_array, this.user.unliked_places_array, this.user.kmeans_array );

    }


  }

removeLike(place) {
  this.aviad = false;
  console.log('Remove Like Clicked');
    // remove the placeid to the list.
  this.splitArray = [];
  this.splitArray = this.user.liked_places_array.split(',');

  this.user.liked_places_array = 'EMPTY';

  for (const placeid of this.splitArray) {
      if (placeid !== place.id) {
        if (this.user.liked_places_array === 'EMPTY') {
          this.user.liked_places_array = placeid;
          //this.aviad=true;
        } else {
          this.placelist = this.user.liked_places_array;
          this.placelist = this.placelist.concat(',', placeid);
          this.user.liked_places_array = this.placelist;
          //this.aviad=true;
        }
      }
    }

    // tslint:disable-next-line: max-line-length
  this.placesService.updatePlaceOnLikeOrUnlike(place.id , place.name , place.lat, place.lng , place.goal, place.count_of_likes, place.count_of_place_likes - 1, place.count_of_place_unlikes , place.photo);

  this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
      // tslint:disable-next-line: max-line-length
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.liked_places_array, this.user.unliked_places_array, this.user.kmeans_array );



  }

removeUnlike(place) {
  console.log('Remove UnLike Clicked');
  ////////////////////////////////////////////////
  const regex = `${place.id},*`;
  this.user.unliked_places_array = this.user.unliked_places_array.replace(new RegExp(regex, 'g') , '');

  if (this.user.unliked_places_array === ',' || this.user.unliked_places_array === '') {
    this.user.unliked_places_array = 'EMPTY';
  }

  /////////////////////////////////////////////////
    // remove the placeid to the list.
    // this.splitArray = [];
    // this.splitArray = this.user.unliked_places_array.split(',');

    // this.user.unliked_places_array = 'EMPTY';

    // for (const placeid of this.splitArray) {
    //   if (placeid !== place.id) {
    //     if (this.user.unliked_places_array === 'EMPTY') {
    //       this.user.unliked_places_array = placeid;
    //     } else {
    //       this.placelist = this.user.unliked_places_array;
    //       this.placelist = this.placelist.concat(',', placeid);
    //       this.user.unliked_places_array = this.placelist;
    //     }
    //   }
    // }

    // tslint:disable-next-line: max-line-length
  this.placesService.updatePlaceOnLikeOrUnlike(place.id , place.name , place.lat, place.lng , place.goal, place.count_of_likes, place.count_of_place_likes , place.count_of_place_unlikes - 1, place.photo);

  this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
      // tslint:disable-next-line: max-line-length
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.liked_places_array, this.user.unliked_places_array, this.user.kmeans_array );



  }

checkIfUserLikeThePlace(placeid) {

    if (this.user.liked_places_array === 'EMPTY') {
      return false;
    }
    if (this.user.liked_places_array.includes(placeid)) {
      console.log('placeid' + placeid);
      return true;
    }
    return false;
  }

checkIfUserUnLikeThePlace(placeid) {
    if (this.user.unliked_places_array === 'EMPTY') {
      return false;
    }
    if (this.user.unliked_places_array.includes(placeid)) {
     // this.aviad=false;
      return true;
    }
    return false;
  }


}
