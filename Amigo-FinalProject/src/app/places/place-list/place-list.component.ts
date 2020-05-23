import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.css']
})
export class PlaceListComponent implements OnInit, OnDestroy {

  places: Place[] = [

  ];

  isLoading = false;
  totalPlaces = 0;
  placesPerPage = 5;
  placeslength = 1;
  currentPage = 1;
  previous;
  latitude = 52.373169;
  longitude = 4.890660;
  zoom = 12;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private placesSub: Subscription;
  private authStatusSub: Subscription;

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
}
