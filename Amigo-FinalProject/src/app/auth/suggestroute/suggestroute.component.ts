import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Place } from 'src/app/places/place.model';
import { PlacesService } from 'src/app/places/places.service';
import { Route } from 'src/app/routes/route.model';
import { RoutesService } from 'src/app/routes/routes.service';
import { ReactiveFormsModule } from '@angular/forms';
import { UserFullData } from '../userfulldata.model';
import { PlaceFullData } from 'src/app/places/placeFullData.model';
import { User } from '../user.model';


interface Rate {
  value: string;
  viewValue: string;
}

interface Direction {
  origin: {lat, lng};
  destination: {lat, lng};
  // renderOptions: { polylineOptions: { strokeColor } };
}

class Dir implements Direction {
    constructor(public origin: any, public destination: any) {

    }
}

@Component({
  templateUrl: './suggestroute.component.html',
  styleUrls: ['./suggestroute.component.css']
})

export class SuggestrouteComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  route: Route;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  placeSaved: string;
  private mode = 'routecreate';
  private routeId: string;
  private authStatusSub: Subscription;
  name: string;
  placestring = '';


  private placesSub: Subscription;

  placesPerPage = 2000;
  currentPage = 1;

  clickedAddPlace: boolean;
  routeCreateForm;
  placesList: Place[];

  userIsAuthenticated = false;
  userId: string;
  user: User;
  userFulldata: UserFullData;
  username: string;

  waypoints: any[];

  ifuserlikedplaces: boolean;
  colorurl: string;

  index = 0;

  latitude = 52.373169;
  longitude = 4.890660;
  zoom = 12;
  previous;
  place: Place;

  public origin: any;
  public destination: any;

  lat = '';
  lng = '';

  totalPlaces = 0;
  placeslength = 1;

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



  constructor(
    public routesService: RoutesService,
    public route2: ActivatedRoute,
    private authService: AuthService,
    public placesService: PlacesService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });

    this.userId = this.authService.getUserId();

    this.clickedAddPlace = false;

    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    this.placesSub = this.placesService
          .getPlaceUpdateListener()
          .subscribe((placeData: { places: Place[]; placeCount: number }) => {
            this.placesList = placeData.places;
          });

    this.form = new FormGroup({
            name: new FormControl(null, { validators: [Validators.required] })
          });


    this.route2.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('routeId')) {
        this.mode = 'edit';
        this.routeId = paramMap.get('routeId');
        this.isLoading = true;
        this.routesService.getRoute(this.routeId).subscribe(routeData => {
          this.isLoading = false;
          this.route = {
            id: routeData._id,
            name: routeData.name,
            places: this.placestring,
            creator: routeData.creator
          };
          this.form.setValue({
            name: this.route.name
          });
        });
      } else {
        this.mode = 'routecreate';
        this.routeId = null;
      }
    });


    this.authService.getUserData(this.userId).subscribe(userData => {
      this.user = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age,
        gender: userData.gender,
        sport: userData.sport,
        culture: userData.culture,
        food: userData.food,
        liked_place: userData.liked_place,
        liked_places_array: userData.liked_places_array,
        unliked_places_array: userData.unliked_places_array,
        kmeans_array: userData.kmeans_array
      };

      this.username = userData.firstName;

      if (this.notEmpty(userData.liked_place)) {
        this.splitArray = userData.liked_place.split(',');

        this.origin = {lat: 0, lng: 0};
        this.destination = {lat: 0, lng: 0};

        this.likedPlaces = [];
        this.directions = [];
        this.waypoints = [];
        this.index = 0;
        const tempArr = [];


        for (const place of this.splitArray) {
          if (place) {
          this.placesService.getPlace(place).subscribe(placeData => {
            this.place = {
              id: placeData._id,
              name: placeData.name,
              lat: placeData.lat,
              lng: placeData.lng,
              goal: placeData.goal,
              count_of_likes: placeData.count_of_likes,
              count_of_place_likes: placeData.count_of_place_likes,
              count_of_place_unlikes: placeData.count_of_place_unlikes,
              creator: placeData.creator,
              photo: placeData.photo
            };

            tempArr[this.index] = placeData;
            this.index++;
            console.log(tempArr[0]);

          });

        }

      }
        setTimeout(() => {


        console.log('check avu first');
        this.likedPlaces = this.distanceFromStart(tempArr);
        console.log('check avu');
        console.log(this.likedPlaces );
        for (let index2 = 0; index2 < this.likedPlaces.length; index2++) {
          if (this.origin.lat === 0) {
          this.origin.lat = +this.likedPlaces[index2].lat;
          this.origin.lng = +this.likedPlaces[index2].lng;
          //this.index ++;
        } else {
          this.destination.lat = +this.likedPlaces[index2].lat;
          this.destination.lng = +this.likedPlaces[index2].lng;
          if (index2 + 1 === this.likedPlaces.length) {
            console.log('index3: ' + index2);
            this.tempDir = new Dir(this.origin, this.destination);
            this.directions.push(this.tempDir);
          } else {
            this.waypoints.push( {location: { lat: this.destination.lat , lng: this.destination.lng }});
           // this.index ++;
          }
        }
      }
    }, 1500);
      }

  });


  }

  // tslint:disable-next-line: member-ordering
  // tslint:disable-next-line: member-ordering
  counter: number;

  // tslint:disable-next-line: member-ordering
  tempPlace: Place;


  notEmpty(likedplace) {
    if (likedplace !== 'EMPTY') {
      this.ifuserlikedplaces = true;
      return true;
    }
    this.ifuserlikedplaces = false;
    return false;
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


  onSaveRoute() {
    console.log('submit clicked ');
    if (this.form.invalid) {
      return;
    }

    this.placestring = '';

    for (const place of this.likedPlaces) {
      this.placestring = this.placestring.concat('name:' , place.name, ',lat:', place.lat, ',lng:', place.lng, ',');
    }

    this.isLoading = true;
    this.routesService.addRoute(
      this.form.get('name').value,
      this.placestring
    );
    this.form.reset();
  }

  clickedMarker(infoWindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infoWindow;
  }

  onSave() {
    console.log('route name = ' + name);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  get places() {
    return this.routeCreateForm.get('places') as FormArray;
  }

  addNewPlace() {
    this.places.push(this.fb.control(''));
  }

  savePlace(place) {
    this.placeSaved.concat(place.name);
    this.placeSaved.concat(',');
    this.placeSaved.concat(place.lat);
    this.placeSaved.concat(',');
    this.placeSaved.concat(place.lng);
    this.placeSaved.concat(',');
    return this.placeSaved;
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
