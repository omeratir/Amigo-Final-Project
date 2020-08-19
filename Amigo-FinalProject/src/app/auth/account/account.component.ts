import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../user.model';
import { Place } from 'src/app/places/place.model';
import { AuthService } from '../auth.service';
import { PlacesService } from 'src/app/places/places.service';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit {
  userIsAuthenticated = false;
  userId: string;
  user: User;

  colorurl: string;

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

  likedPlaces: Place[] = [

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
          kmeans_array: userData.kmeans_array
        };

        if (this.notEmpty(userData.liked_place)) {
          this.splitArray = userData.liked_place.split(',');
          console.log(this.splitArray);

          this.likedPlaces = [];

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
                creator: placeData.creator,
                photo: placeData.photo
              };
              console.log('place id =' + place);
              console.log('place id 2 =' + this.place.id);
              this.likedPlaces.push(this.place);
              console.log(this.likedPlaces);
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
    console.log(likedplace);
    if (likedplace !== 'EMPTY') {
      return true;
    }
    return false;
  }

  clickedMarker(infoWindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infoWindow;
  }

  LikeClicked(place, infoWindow) {
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

    }


UnLikeClicked(place, infoWindow) {
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

        if (this.notEmpty(userData.liked_place)) {
          this.splitArray = userData.liked_place.split(',');
          console.log(this.splitArray);

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
                creator: placeData.creator,
                photo: placeData.photo
              };
              console.log('place id =' + placeid);
              console.log('place id 2 =' + this.place.id);
              this.likedPlaces.push(this.place);
              console.log(this.likedPlaces);
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


}

