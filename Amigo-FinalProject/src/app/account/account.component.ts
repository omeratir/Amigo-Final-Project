import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';
import { Place } from '../places/place.model';
import { PlacesService } from '../places/places.service';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit {
  userIsAuthenticated = false;
  userId: string;
  user: User;

  latitude = 52.373169;
  longitude = 4.890660;
  zoom = 12;
  previous;
  place: Place;

  name = '';
  lat = '';
  lng = '';

  totalPlaces = 0;
  placesPerPage = 2000;
  placeslength = 1;
  currentPage = 1;

  places: Place[] = [

  ];

  private placesSub: Subscription;


  userPlacesArray: string[] = [

  ];
  private authListenerSubs: Subscription;

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
          liked_place: userData.liked_place
        };
    });

    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    this.placesSub = this.placesService
        .getPlaceUpdateListener()
        .subscribe((placeData: { places: Place[]; placeCount: number }) => {
          this.places = placeData.places;
        });
    this.place = null;
}

  // tslint:disable-next-line: variable-name
  splitArray(liked_place) {
    if (liked_place === 'EMPTY') {
      return false;
    }
    this.userPlacesArray = liked_place.split('');
    return true;
  }

  checkPlace(placeID) {
    this.placesService.getPlace(placeID).subscribe(placeData => {
      this.place = {
        id: placeData._id,
        name: placeData.name,
        lat: placeData.lat,
        lng: placeData.lng,
        creator: placeData.creator
      };
    });
  }

  clickedMarker(infoWindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infoWindow;
  }


}

