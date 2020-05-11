import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Route } from '../route.model';
import { RoutesService } from '../routes.service';
import { AuthService } from '../../auth/auth.service';
import { Place } from 'src/app/places/place.model';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.css']
})
export class RouteListComponent implements OnInit, OnDestroy {

  routes: Route[] = [];
  isLoading = false;
  totalRoutes = 0;
  routesPerPage = 100;
  routeslength = 1;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private routesSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public routesService: RoutesService,
    private authService: AuthService
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

  // tslint:disable-next-line: member-ordering
  placesList: Place[] = [

  ];

  // tslint:disable-next-line: member-ordering
  placesListStringArray: string[] = [

  ];

  routePlaces(routePlacesString: string) {
    this.placesList = null;
    this.placesListStringArray = routePlacesString.split(',');
    // for (const placename of this.placesListStringArray) {

    // }
    return true;
  }

}
