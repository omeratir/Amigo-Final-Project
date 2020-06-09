import { Component, OnInit } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { bufferTime } from 'rxjs/operators';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { User } from 'src/app/auth/user.model';

@Component({
  templateUrl: './placefind.component.html',
  styleUrls: ['./placefind.component.css']
})

export class PlaceFindComponent implements OnInit {
  // tslint:disable-next-line: variable-name
  Goal_Sport_And_Extreme: boolean;
  // tslint:disable-next-line: variable-name
  Goal_Shopping: boolean;
  // tslint:disable-next-line: variable-name
  Goal_Attractions_Leisure: boolean;
  // tslint:disable-next-line: variable-name
  Goal_Night_Life: boolean;
  // tslint:disable-next-line: variable-name
  Goal_Relaxing: boolean;
  // tslint:disable-next-line: variable-name
  Goal_Culture_And_Historical_Places: boolean;

  placeFindBtnClicked: boolean;
  checked: boolean;
  likeClicked: boolean;

  lat = 52.373169;
  lng = 4.890660;
  zoom = 12;
  previous;

  totalPlaces = 0;
  placesPerPage = 2000;
  placeslength = 1;
  currentPage = 1;

  places: Place[] = [

  ];

  user: User;

  private placesSub: Subscription;

  like: boolean;
  unlike: boolean;

  ifLikePlace: boolean;

  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;

  constructor(
    private authService: AuthService,
    public placesService: PlacesService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    this.placesSub = this.placesService
        .getPlaceUpdateListener()
        .subscribe((placeData: { places: Place[]; placeCount: number }) => {
          this.places = placeData.places;
        });

    this.authService.getUserData(this.userId).subscribe(userData => {
          this.user = {
            //id: userData.email,
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

    this.placeFindBtnClicked = false;
    this.Goal_Attractions_Leisure = false;
    this.Goal_Culture_And_Historical_Places = false;
    this.Goal_Night_Life = false;
    this.Goal_Relaxing = false;
    this.Goal_Shopping = false;
    this.Goal_Sport_And_Extreme = false;
    this.likeClicked = false;
    this.like = false;
    this.unlike = false;
  }

  onChangeCheckBox() {
    console.log('Goal_Attractions_Leisure = ' + this.Goal_Attractions_Leisure);
    this.Goal_Attractions_Leisure = !this.Goal_Attractions_Leisure;
  }

  onClickFindPlace() {
    console.log('Clicked on find place');

    if ((!this.Goal_Attractions_Leisure) && (!this.Goal_Culture_And_Historical_Places) && (!this.Goal_Night_Life)
    && (!this.Goal_Relaxing) && (!this.Goal_Shopping) && (!this.Goal_Sport_And_Extreme)) {
      this.placeFindBtnClicked = false;
    } else {
      this.placeFindBtnClicked = true;
      console.log('Goal_Attractions_Leisure = ' + this.Goal_Attractions_Leisure);
      console.log('Goal_Culture_And_Historical_Places = ' + this.Goal_Culture_And_Historical_Places);
      console.log('Goal_Night_Life = ' + this.Goal_Night_Life);
      console.log('Goal_Relaxing = ' + this.Goal_Relaxing);
      console.log('Goal_Shopping = ' + this.Goal_Shopping);
      console.log('Goal_Sport_And_Extreme = ' + this.Goal_Sport_And_Extreme);
    }
  }

  clickedMarker(infoWindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infoWindow;
  }

  LikeClicked(place) {
    console.log('Like Clicked');

    // add the placeid to the list.

    if (this.user.liked_place === 'EMPTY') {
      this.user.liked_place = place.id;
    } else {
      this.user.liked_place.concat(',');
      this.user.liked_place.concat(place.id);
    }

    this.authService.updateUser(this.user.email, this.user.password , this.user.firstName, this.user.lastName
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place);
    // this.placesService.onLikeClicked(place.id, this.userId);

    // this.placesService.updatePlace(place.id , 'TEST' , place.lat, place.lng);
  }

  UnLikeClicked() {
    console.log('UnLike Clicked');
  }

  // tslint:disable-next-line: member-ordering
  splitArray: string[] = [

  ];

  checkIfUserLikeThePlace(placeid) {
    console.log('user places = ' + this.user.liked_place);
    if (this.user.liked_place === 'EMPTY') {
      return false;
    }

    this.splitArray = this.user.liked_place.split(',');
    this.ifLikePlace = false;

    for (const place of this.splitArray) {
      if (place === placeid) {
        return true;
      }
    }

    return false;
  }



}
