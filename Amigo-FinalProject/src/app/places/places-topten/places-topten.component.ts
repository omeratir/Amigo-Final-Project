import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PlacesService } from 'src/app/places/places.service';
import { Place } from 'src/app/places/place.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

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

}
