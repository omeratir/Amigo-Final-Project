import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Place } from './place.model';

const BACKEND_URL = environment.apiUrl + '/places/';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private places: Place[] = [];
  private placesUpdated = new Subject<{ places: Place[]; placeCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPlaces(placesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${placesPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; places: any; maxPlaces: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(placeData => {
          return {
            places: placeData.places.map(place => {
              return {
                id: place._id,
                nameOfPlace: place.nameOfPlace,
                lat: place.lat,
                lng: place.lng,
                averageDaysOfPlace: place.averageDaysOfPlace,
                destinationForSex: place.destinationForSex,
                destinationForAges: place.destinationForAges,
                creator: place.creator
              };
            }),
            maxPlaces: placeData.maxPlaces
          };
        })
      )
      .subscribe(transformedPlaceData => {
        this.places = transformedPlaceData.places;
        this.placesUpdated.next({
          places: [...this.places],
          placeCount: transformedPlaceData.maxPlaces
        });
      });
  }

  getAllPlacesService() {
    this.http
      .get<{ places: any; maxPlaces: number }>(
        BACKEND_URL + 'all'
      ).subscribe(transformedPlaceData => {
        this.places = transformedPlaceData.places;
        this.placesUpdated.next({
          places: [...this.places],
          placeCount: transformedPlaceData.maxPlaces
        });
      });
  }

  getPlaceUpdateListener() {
    return this.placesUpdated.asObservable();
  }

  getPlace(id: string) {
    return this.http.get<{
      _id: string;
      nameOfPlace: string;
      lat: string,
      lng: string;
      averageDaysOfPlace: number;
      destinationForSex: number;
      destinationForAges: number;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addPlace(nameOfPlace: string, lat: string, lng: string ) {
    const placeData = new FormData();
    placeData.append('nameOfPlace', nameOfPlace);
    // placeData.append('averageDaysOfPlace', averageDaysOfPlace);
    // placeData.append('destinationForSex', destinationForSex);
    // placeData.append('destinationForAges', destinationForAges);
    placeData.append('lat', lat);
    placeData.append('lng', lng);
    this.http
      .post<{ message: string; place: Place }>(
        BACKEND_URL,
        placeData
      )
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  // tslint:disable-next-line: max-line-length
  updatePlace(id: string, nameOfPlace: string, lat: string, lng: string, averageDaysOfPlace: string , destinationForSex: string , destinationForAges: string) {
    let placeData: Place | FormData;
    placeData = new FormData();
    placeData.append('nameOfPlace', nameOfPlace);
    placeData.append('lat', lat);
    placeData.append('lng', lng);
    placeData.append('averageDaysOfPlace', averageDaysOfPlace);
    placeData.append('destinationForSex', destinationForSex);
    placeData.append('destinationForAges', destinationForAges);
    this.http
      .put(BACKEND_URL + id, placeData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePlace(placeId: string) {
    return this.http.delete(BACKEND_URL + placeId);
  }
}
