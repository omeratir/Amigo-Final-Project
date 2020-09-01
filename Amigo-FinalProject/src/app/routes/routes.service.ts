import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Route } from './route.model';
import { Place } from '../places/place.model';

const BACKEND_URL = environment.apiUrl + '/routes/';

@Injectable({ providedIn: 'root' })
export class RoutesService {
  private routes: Route[] = [];
  private routesUpdated = new Subject<{ routes: Route[]; routeCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getRoutes(routesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${routesPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; routes: any; maxRoutes: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(routeData => {
          return {
            routes: routeData.routes.map(route => {
              return {
                name: route.name,
                places: route.places,
                id: route._id,
                creator: route.creator
              };
            }),
            maxRoutes: routeData.maxRoutes
          };
        })
      )
      .subscribe(transformedRouteData => {
        this.routes = transformedRouteData.routes;
        this.routesUpdated.next({
          routes: [...this.routes],
          routeCount: transformedRouteData.maxRoutes
        });
      });
  }

  getRouteUpdateListener() {
    return this.routesUpdated.asObservable();
  }

  getRoute(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      places: string,
      creator: string;
    }>(BACKEND_URL + id);
  }

  addRoute(name: string, places: string) {
    const routeData = new FormData();
    routeData.append('name', name);
    routeData.append('places', places);
    this.http
      .post<{ message: string; route: Route }>(
        BACKEND_URL,
        routeData
      )
      .subscribe(responseData => {
        this.router.navigate(['/routelist']);
      });
  }

  // tslint:disable-next-line: variable-name
  updateRoute(id: string, name: string, places: string) {
    let routeData: Route | FormData;
    routeData = {
        id,
        name,
        places,
        creator: null
      };
    this.http
      .put(BACKEND_URL + id, routeData)
      .subscribe(response => {
        this.router.navigate(['/routelist']);
      });
  }

  deleteRoute(routeId: string) {
    return this.http.delete(BACKEND_URL + routeId);
  }

}
