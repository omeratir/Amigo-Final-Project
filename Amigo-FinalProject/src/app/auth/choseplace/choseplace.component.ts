import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { PlacesService } from 'src/app/places/places.service';
import { Place } from 'src/app/places/place.model';
import { Router } from '@angular/router';
import { UserData } from '../userData.model';

@Component({
  templateUrl: './choseplace.component.html',
  styleUrls: ['./choseplace.component.css']
})
export class ChoseplaceComponent implements OnInit {

  isLoading = false;
  private authStatusSub: Subscription;
  private placesSub: Subscription;

  placeLiked: string;
  colorurl: string;
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
  user: UserData;

  places: Place[] = [

  ];

  constructor(public authService: AuthService , public placesService: PlacesService, private router: Router
    ) {}

  ngOnInit() {
    this.placeLiked = 'EMPTY';
    this.splitArray = [];

    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    this.placesSub = this.placesService
        .getPlaceUpdateListener()
        .subscribe((placeData: { places: Place[]; placeCount: number }) => {
          // this.places = placeData.places;
          this.places = this.placesService.sortPlacesByLikes(placeData.places);
        });
  }

  sortPlaces() {
    this.places = this.placesService.sortPlacesByLikes(this.places);
    return true;
  }

  SignUp() {
    console.log(this.placeLiked);
    this.authService.onSignUpAfterChosePlace(this.placeLiked);
    this.router.navigate(['/auth/login']);
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

}
