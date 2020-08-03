import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Place } from './place.model';
import { PlaceData } from './placeData.model';
import { Kmeans } from './kmeans.model';
import { PlaceLikeData } from './PlaceLikeData.model';

const BACKEND_URL = environment.apiUrl + '/places/';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private places: Place[] = [];
  private temp: Place[] = [];
  private likeplaces: PlaceLikeData[] = [];
  private placesUpdated = new Subject<{ places: Place[]; placeCount: number }>();
  private placesLikedUpdated = new Subject<{ like_places: PlaceLikeData[]; placeCount: number }>();

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
                name: place.name,
                lat: place.lat,
                lng: place.lng,
                goal: place.goal,
                count_of_likes: place.count_of_likes,
                id: place._id,
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

  getPlacesLike(placesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${placesPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; places: any; maxPlaces: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(placeData => {
          return {
            like_places: placeData.places.map(place => {
              return {
                name: place.name,
                count_of_likes: place.count_of_likes,
                goal: place.goal,
                id: place._id,
                creator: place.creator
              };
            }),
            maxPlaces: placeData.maxPlaces
          };
        })
      )
      .subscribe(transformedPlaceData => {
        this.places = transformedPlaceData.like_places;
        this.placesLikedUpdated.next({
          like_places: [...this.likeplaces],
          placeCount: transformedPlaceData.maxPlaces
        });
      });
  }

  getPlaceUpdateListener() {
    return this.placesUpdated.asObservable();
  }

  getPlaceLikeUpdateListener() {
    return this.placesLikedUpdated.asObservable();
  }

  getPlace(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      lat: string,
      lng: string;
      goal: string;
      count_of_likes: number;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addPlace(name: string, lat: string, lng: string) {
    const placeData = new FormData();
    placeData.append('name', name);
    placeData.append('lat', lat);
    placeData.append('lng', lng);
    this.http
      .post<{ message: string; place: Place }>(
        BACKEND_URL,
        placeData
      )
      .subscribe(responseData => {
        // this.router.navigate(['/placelist']);
      });
  }

  // tslint:disable-next-line: variable-name
  updatePlace(id: string, name: string, lat: string, lng: string, users_array: string, flagLike: boolean) {
    let placeData: PlaceData | FormData;
    placeData = new FormData();

    // placeData.append('name', name);
    // placeData.append('lat', lat);
    // placeData.append('lng', lng);

    placeData = {
      id,
      name,
      lat,
      lng,
      users_array,
      flagLike,
      creator: null
    };

    this.http
      .put(BACKEND_URL + id, placeData)
      .subscribe(response => {
        // this.router.navigate(['/placelist']);
      });
  }


  kmeans(kmeans: Kmeans) {
    this.http
      .put(BACKEND_URL + 'kmeans/' + kmeans.userid , kmeans )
      .subscribe(response => {
        // this.router.navigate(['/placelist']);
    });
  }

  deletePlace(placeId: string) {
    return this.http.delete(BACKEND_URL + placeId);
  }

  getAllPlaces() {
    return this.http
    .get<{ message: string; places: any; maxPlaces: number }>(
      BACKEND_URL + 'all')
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
      .get<{ message: string; places: any; maxPlaces: number }>(
        BACKEND_URL + 'all'
      )
      .pipe(
        map(placeData => {
          return {
            places: placeData.places.map(place => {
              return {
                name: place.name,
                lat: place.lat,
                lng: place.lng,
                id: place._id,
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



  onLikeClicked(placeId: string, userId: string) {
    console.log('onLikeClicked placesService userId = ' + userId);
    console.log('onLikeClicked placesService placeId = ' + placeId);

    this.http.put(BACKEND_URL + placeId , userId )
    .subscribe(response => {

    });
  }

  // tslint:disable-next-line: member-ordering
  i: number;
  // tslint:disable-next-line: member-ordering
  temp1 = 0;

  sortPlacesByLikes(places: Place[]) {
    console.log('Sort By Likes');
    places.sort((a , b) => b.count_of_likes - a.count_of_likes);

    for (this.i = 0 ; this.i < 6 ; this.i ++) {
      this.temp.push(places[this.i]);
    }

    return this.temp;
  }

  // kmeans(userId: string) {
  //   console.log('aviad azliach kmeans?');
  //   this.http
  //   .get(
  //     BACKEND_URL + userId).subscribe(response => {
  //       console.log('aviad azliach kmeans?222');
  //     });


  //   // this.http.get(BACKEND_URL + userId ).subscribe(response => {

  //   // });
  // }



}
