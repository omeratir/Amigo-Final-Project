import { Component, OnInit } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { bufferTime } from 'rxjs/operators';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { User } from 'src/app/auth/user.model';
import { Kmeans } from '../kmeans.model';

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
  // tslint:disable-next-line: variable-name
  kmean_model: Kmeans;

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

  splitArray: string[] = [

  ];

  private placesSub: Subscription;

  like: boolean;
  unlike: boolean;

  ifLikePlace: boolean;

  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;

  placelist: string;

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

  onClickFindPlace(user) {
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

      this.kmean_model = {
        userid: this.userId,
        goal_Sport_And_Extreme: this.Goal_Sport_And_Extreme,
        goal_Shopping: this.Goal_Shopping,
        goal_Attractions_Leisure: this.Goal_Attractions_Leisure,
        goal_Night_Life: this.Goal_Night_Life,
        goal_Relaxing: this.Goal_Relaxing,
        goal_Culture_And_Historical_Places: this.Goal_Culture_And_Historical_Places
      };
      this.placesService.kmeans(this.kmean_model);
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
      this.placelist = this.user.liked_place;
      this.placelist = this.placelist.concat(',', place.id);
      this.user.liked_place = this.placelist;
    }

    this.placesService.updatePlace(place.id , place.name , place.lat, place.lng , this.userId, true);

    this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place);
    }


  UnLikeClicked(place) {
    console.log('UnLike Clicked');

    // remove the placeid to the list.
    this.splitArray = this.user.liked_place.split(',');
    this.user.liked_place = 'EMPTY';

    for (const placeid of this.splitArray) {
      if (placeid !== place.id) {
        if (this.user.liked_place === 'EMPTY') {
          this.user.liked_place = place.id;
        } else {
          this.placelist = this.user.liked_place;
          this.placelist = this.placelist.concat(',', placeid);
          this.user.liked_place = this.placelist;
        }
      }
    }
    this.placesService.updatePlace(place.id , place.name , place.lat, place.lng , this.userId, false);

    this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place);
  }

  checkIfUserLikeThePlace(placeid) {
    if (this.user.liked_place === 'EMPTY') {
      return false;
    }

    this.splitArray = this.user.liked_place.split(',');

    for (const place of this.splitArray) {
      if (place === placeid) {
        return true;
      }
    }

    return false;
  }



  // kmeans(place) {
  //   console.log('kmeans Go');
  //   this.placesService.kmeans(place.id);
  // }


}
