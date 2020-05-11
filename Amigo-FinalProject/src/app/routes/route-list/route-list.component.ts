import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Route } from '../route.model';
import { RoutesService } from '../routes.service';
import { AuthService } from '../../auth/auth.service';
import { Place } from 'src/app/places/place.model';
import { PlacesService } from 'src/app/places/places.service';

interface PlaceValue {
  name: string;
  lat: string;
  lng: string;
}

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.css']
})
export class RouteListComponent implements OnInit, OnDestroy {
  placesValues: Array<PlaceValue> = new Array();
  placeValue: PlaceValue;
  routes: Route[] = [];
  isLoading = false;
  totalRoutes = 0;
  routesPerPage = 100;
  routeslength = 1;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  flagName = false;
  countPlaces: number;
  latitude = 52.373169;
  longitude = 4.890660;
  zoom = 12;
  previous;
  countNumOfPlaces = 0;
  placesListStringArray: string[] = [

  ];
  place: Place;

  name = '';
  lat = '';
  lng = '';

  ifNameNext = false;
  ifLatNext = false;
  ifLngNext = false;

  totalPlaces = 0;
  placesPerPage = 2000;
  placeslength = 1;

  places: Place[] = [

  ];

  private placesSub: Subscription;


  private routesSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public routesService: RoutesService,
    private authService: AuthService,
    public placesService: PlacesService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.routesService.getRoutes(this.routesPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.routesSub = this.routesService
      .getRouteUpdateListener()
      .subscribe((routeData: { routes: Route[]; routeCount: number }) => {
        this.isLoading = false;
        this.totalRoutes = routeData.routeCount;
        this.routes = routeData.routes;
      });
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
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.routesPerPage = pageData.pageSize;
    this.routesService.getRoutes(this.routesPerPage, this.currentPage);
  }

  onDelete(routeId: string) {
    this.isLoading = true;
    this.routesService.deleteRoute(routeId).subscribe(() => {
      this.routesService.getRoutes(this.routesPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.routesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  routePlaces(routePlacesString: string) {
    this.countPlaces = 0;
    this.placesListStringArray = [ ];
    this.placesListStringArray = routePlacesString.split(',');
    return true;
   }

  ifPlaceName(placeData) {
    if (placeData.charAt(0) === 'n') {
      this.name = placeData.substring(5);
      this.countPlaces ++;
      return true;
    }
  }

  checkPlace(name) {
    for (const placename of this.placesListStringArray) {
      if (placename.substring(5) === name) {
        this.countNumOfPlaces++;
        return true;
      }
    }
    return false;
  }

  clickedMarker(infoWindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infoWindow;
  }
}
