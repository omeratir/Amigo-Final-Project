import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { PlacesService } from 'src/app/places/places.service';
import { Place } from 'src/app/places/place.model';
import { Router } from '@angular/router';

@Component({
  templateUrl: './choseplace.component.html',
  styleUrls: ['./choseplace.component.css']
})
export class ChoseplaceComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription;
  private placesSub: Subscription;

  totalPlaces = 0;
  placesPerPage = 2000;
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
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userId = this.authService.getUserId();
      });


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
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  clickedMarker(infoWindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infoWindow;
  }
}
