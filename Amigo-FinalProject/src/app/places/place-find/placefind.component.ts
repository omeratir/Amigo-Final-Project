import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
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

  colorurl: string;
  place: Place;

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

  placesKMEANS: Place[] = [

  ];

  tempPlaces: Place[] = [

  ];

  tempstringplaces: string[] = [

  ];

  user: User;

  splitArray: string[] = [

  ];

  placelist: string;


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
            kmeans_array: userData.kmeans_array
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

    // if (this.placeFindBtnClicked) {
    //   return true;
    // }

    // if ((!this.Goal_Attractions_Leisure) && (!this.Goal_Culture_And_Historical_Places) && (!this.Goal_Night_Life)
    // && (!this.Goal_Relaxing) && (!this.Goal_Shopping) && (!this.Goal_Sport_And_Extreme)) {
    //   this.placeFindBtnClicked = false;
    // } else {
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

      // this.placesService.kmeans(this.kmean_model);
    this.placesService.kmeans2(this.kmean_model).subscribe(userData => {
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
          kmeans_array: userData.kmeans_array
        };
        console.log('kmeans done2');

      // this.authService.getUserData(this.userId).subscribe(userData => {
      //   this.user = {
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
      //     kmeans_array: userData.kmeans_array
      //   };

        console.log(userData);

        console.log(this.userId);
        console.log('KMEANS ARRAY 1 = ' + userData.kmeans_array);
        this.tempstringplaces = userData.kmeans_array.split(',');

        this.placesKMEANS = [];

        for (const place of this.tempstringplaces) {
          if (place) {
          this.placesService.getPlace(place).subscribe(placeData => {
            this.place = {
              id: placeData._id,
              name: placeData.name,
              lat: placeData.lat,
              lng: placeData.lng,
              goal: placeData.goal,
              count_of_likes: placeData.count_of_likes,
              creator: placeData.creator,
              photo: placeData.photo
            };
            console.log('place id =' + place);
            console.log('place id 2 =' + this.place.id);
            this.placesKMEANS.push(this.place);
            console.log(this.placesKMEANS);
          });
        }
      }
      });
    console.log('kmeans done');
    // }
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
    console.log(this.user.liked_place);
    if (this.user.liked_place === 'EMPTY') {
      this.user.liked_place = place.id;
    } else {
      this.placelist = this.user.liked_place;
      this.placelist = this.placelist.concat(',', place.id);
      this.user.liked_place = this.placelist;
    }
    console.log(this.user.liked_place);
    this.placesService.updatePlace(place.id , place.name , place.lat, place.lng , this.userId, true, place.photo);

    this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
      // tslint:disable-next-line: max-line-length
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.kmeans_array );

    this.tempPlaces = [];

    this.updateListAfterLikeOrUnlikeClicked(place);
  }

  updateMarkerColorByGoal(place) {
    this.colorurl = './assets/images/red-dot.png';

    if (place.goal === 'Attractions & Leisure') {
      this.colorurl = './assets/images/green-dot.png';
    }

    if (place.goal === 'Shopping') {
      this.colorurl = './assets/images/red-dot.png';
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

  updateListAfterLikeOrUnlikeClicked(place: Place) {
    this.placesService.getPlace(place.id).subscribe(placeData => {
      this.place = {
        id: placeData._id,
        name: placeData.name,
        lat: placeData.lat,
        lng: placeData.lng,
        goal: placeData.goal,
        count_of_likes: placeData.count_of_likes,
        creator: placeData.creator,
        photo: placeData.photo
      };

      for (const temp of this.placesKMEANS) {
        if (temp.id === placeData._id) {
          this.tempPlaces.push(this.place);
        } else {
          this.tempPlaces.push(temp);
        }
      }

      this.placesKMEANS = [];
      this.placesKMEANS = this.tempPlaces;
  });

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
    this.placesService.updatePlace(place.id , place.name , place.lat, place.lng , this.userId, false, place.photo);

    this.authService.updateUser(this.userId , this.user.email, this.user.password , this.user.firstName, this.user.lastName
      // tslint:disable-next-line: max-line-length
      , this.user.age, this.user.gender, this.user.sport, this.user.culture, this.user.food , this.user.liked_place, this.user.kmeans_array);
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




  // kmeans(place) {
  //   console.log('kmeans Go');
  //   this.placesService.kmeans(place.id);
  // }


}
