import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Route } from '../route.model';
import { RoutesService } from '../routes.service';
import { AuthService } from '../../auth/auth.service';
import { Place } from 'src/app/places/place.model';
import { PlacesService } from 'src/app/places/places.service';
import { UserFullData } from 'src/app/auth/userfulldata.model';
import { PlaceFullData } from 'src/app/places/placeFullData.model';
import { User } from 'src/app/auth/user.model';
import { ThrowStmt } from '@angular/compiler';

interface Direction {
  origin: {lat, lng};
  destination: {lat, lng};
  // renderOptions: { polylineOptions: { strokeColor } };
}

class Dir implements Direction {
    constructor(public origin: any, public destination: any) {

    }
}

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

  placesRoute: Place[] = [];
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


  clickedAddPlace: boolean;
  routeCreateForm;
  placesList: Place[];

  user: User;
  userFulldata: UserFullData;
  username: string;

  waypoints: any[];

  ifuserlikedplaces: boolean;
  colorurl: string;

  index = 0;

  public origin: any;
  public destination: any;


  directions: Dir[] = [];

  tempDir: Dir;

  placeFull: PlaceFullData;


  likedPlaces: Place[] = [

  ];

  placesfordir: Place[] = [

  ];

  likeplaces: string;

  splitArray: string[] = [

  ];

  likedplacesarray: string[] = [

  ];

  userPlacesArray: string[] = [

  ];

  placesKMEANS: Place[] = [

  ];

  usersavedplaces: string;

  tempplacessave: string[] = [];

  tempPlaces: Place[] = [

  ];

  aviad = false;
  userFull: UserFullData;
  chartMap = {};
  placeurl: string;
  placeName: string[] = [];
  tempafterdelete: string;


  private authListenerSubs: Subscription;
  placelist: string;



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

  distanceFromStart(array) {
    console.log('distanceFromStart');
    console.log(array);
    if (array.lentgh === 1) {
      return array;
    } else {

    let dist = 0;
    let temp = 0;
    var UpdateArrayByDistance = [];
    UpdateArrayByDistance[0] = array[0];
    //UpdateArrayByDistance
    //UpdateArrayByDistance.push(array);
    console.log('distanceFromMiddle');
    console.log(UpdateArrayByDistance);
    let checkIfExistPlace = '';
    //UpdateArrayByDistance[0].name;
    console.log(array.length);
    for (let index = 0; index < array.length; index++) {
      checkIfExistPlace = checkIfExistPlace.concat(UpdateArrayByDistance[index].name);
      temp = 10000000;
      console.log('index : ' + index);
      for (let index2 = 0; index2 < array.length; index2++) {
          console.log('index2 : ' + index2);
          console.log('checkIfExistPlace: ' + checkIfExistPlace);
          console.log(array[index2].name);
          if (!checkIfExistPlace.includes(array[index2].name)) {
            console.log(UpdateArrayByDistance[index]);
            console.log(array[index2]);
            dist = this.distance(UpdateArrayByDistance[index].lat, UpdateArrayByDistance[index].lng, array[index2].lat, array[index2].lng);
            console.log('dist : ' + dist);
            console.log('temp : ' + temp);
            if (dist !== 0) {
        if ( (Math.min(dist, temp)) === dist) {
          UpdateArrayByDistance[index + 1] = array[index2];
         // checkIfExistPlace = checkIfExistPlace.concat(UpdateArrayByDistance[index + 1].name);
          console.log(UpdateArrayByDistance[index + 1]);
          temp = dist;
        }

       }
        }
      }
      }
    }
    console.log(array);
    // console.log(UpdateArrayByDistance);
    return UpdateArrayByDistance;
  }

   distance(lat1, lon1, lat2, lon2) {
    // tslint:disable-next-line: indent
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0;
    } else {
      const radlat1 = Math.PI * lat1 / 180;
      const radlat2 = Math.PI * lat2 / 180;
      const theta = lon1 - lon2;
      const radtheta = Math.PI * theta / 180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344;
      return dist;
    }
  }

  createRoute() {
    // this.placesRoute = [];
    // for (const place of this.places) {
    //   for (const placer of this.placesListStringArray) {
    //     if (placer.substring(5) === place.name) {
    //       this.placesRoute.push(place);
    //     }
    //   }
    // }
    // console.log('crreate route');
    // console.log(this.placesRoute);
    // return true;
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
    this.likedPlaces = [];
    this.directions = [];
    this.waypoints = [];
    this.index = 0;
    const tempArr = [];
    this.placesListStringArray = [ ];
    this.placesListStringArray = routePlacesString.split(',');
    this.placesRoute = [];
    // for (const place of this.places) {
    //   for (const placer of this.placesListStringArray) {
    //     if (placer.substring(5) === place.name) {
    //       this.placesRoute.push(place);
    //       tempArr[this.index] = place;
    //       this.index++;
    //     }
    //   }
    // }
    // this.origin = {lat: 0, lng: 0};
    // this.destination = {lat: 0, lng: 0};
  //   setTimeout(() => {


  //     console.log('check avu first');
  //     this.likedPlaces = this.distanceFromStart(tempArr);
  //     console.log('check avu');
  //     console.log(this.likedPlaces );
  //     for (let index2 = 0; index2 < this.likedPlaces.length; index2++) {
  //       if (this.origin.lat === 0) {
  //       this.origin.lat = +this.likedPlaces[index2].lat;
  //       this.origin.lng = +this.likedPlaces[index2].lng;
  //       //this.index ++;
  //     } else {
  //       this.destination.lat = +this.likedPlaces[index2].lat;
  //       this.destination.lng = +this.likedPlaces[index2].lng;
  //       if (index2 + 1 === this.likedPlaces.length) {
  //         console.log('index3: ' + index2);
  //         this.tempDir = new Dir(this.origin, this.destination);
  //         this.directions.push(this.tempDir);
  //       } else {
  //         this.waypoints.push( {location: { lat: this.destination.lat , lng: this.destination.lng }});
  //        // this.index ++;
  //       }
  //     }
  //   }
  // }, 1500);
    return true;
   }

  ifPlaceName(placeData) {
    this.placesRoute = [];
    if (placeData.charAt(0) === 'n') {
      this.name = placeData.substring(5);
      this.countPlaces ++;
      return true;
    }
  }

  checkPlaces(place) {
    for (const placename of this.placesListStringArray) {
      if (placename.substring(5) === place.name) {
        this.placesRoute.push(place);
        return true;
      }
    }
    return false;
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

}
