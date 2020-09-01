import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { RoutesService } from '../routes.service';
import { Route } from '../route.model';
import { AuthService } from '../../auth/auth.service';
import { Place } from 'src/app/places/place.model';
import { PlacesService } from 'src/app/places/places.service';


interface Rate {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-route-create',
  templateUrl: './route-create.component.html',
  styleUrls: ['./route-create.component.css']
})

export class RouteCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  route: Route;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  placeSaved: string;
  private mode = 'routecreate';
  private routeId: string;
  private authStatusSub: Subscription;

  rates: Rate[] = [
    {value: '1-Very Bad', viewValue: '1-Very Bad'},
    {value: '2-Bad', viewValue: '2-Bad'},
    {value: '3-Nice', viewValue: '3-Nice'},
    {value: '4-Very Good', viewValue: '4-Very Good'},
    {value: '5-Excellent', viewValue: '5-Exellent'}
  ];

  placesList: Place[] = [

  ];

  private placesSub: Subscription;

  placesPerPage = 2000;
  currentPage = 1;

  clickedAddPlace: boolean;
  routeCreateForm;


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

    this.clickedAddPlace = false;

    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    this.placesSub = this.placesService
          .getPlaceUpdateListener()
          .subscribe((placeData: { places: Place[]; placeCount: number }) => {
            this.placesList = placeData.places;
          });

    this.routeCreateForm = this.fb.group({
    name: [null, Validators.required],
    places: this.fb.array([
      this.fb.control('')
    ])
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
            places: routeData.places,
            creator: routeData.creator
          };
          this.form.setValue({
            name: this.route.name,
            places: this.route.places,
          });
        });
      } else {
        this.mode = 'routecreate';
        this.routeId = null;
      }
    });
  }

  // tslint:disable-next-line: member-ordering
  place = '';
  // tslint:disable-next-line: member-ordering
  counter: number;

  // tslint:disable-next-line: member-ordering
  tempPlace: Place;

  onSaveRoute() {
    console.log('submit clicked ');
    this.counter = 0;
    for (const place of this.places.controls) {
      if (this.counter === 0) {
        this.place = this.routeCreateForm.get('places' , this.counter ).value;
        this.counter ++;
      } else {
        this.place.concat(',');
        this.place.concat(this.routeCreateForm.get('places' , this.counter ).value);
        this.counter ++;
      }
    }

    console.log('Places after append = ' + this.place);

    if (this.routeCreateForm.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'routecreate') {
      this.routesService.addRoute(
        this.routeCreateForm.get('name').value,
        this.place,
      );
    } else {
      this.routesService.updateRoute(
        this.routeId,
        this.routeCreateForm.get('name').value,
        this.place
      );
    }
    this.routeCreateForm.reset();
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
}
