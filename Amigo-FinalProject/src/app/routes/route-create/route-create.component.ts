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
  enteredContent = '';
  route: Route;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
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

  places: Place[] = [

  ];

  private placesSub: Subscription;

  placesPerPage = 100;
  currentPage = 1;

  clickedAddPlace: boolean;


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
            this.places = placeData.places;
          });

    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)]
      }),
      places: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      time_of_route: new FormControl(null, { validators: [Validators.required] }),
      rating: new FormControl(null, { validators: [Validators.required] })
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
            content: routeData.content,
            time_of_route: routeData.time_of_route,
            rating: routeData.rating,
            creator: routeData.creator
          };
          this.form.setValue({
            name: this.route.name,
            places: this.route.places,
            content: this.route.content,
            time_of_route: this.route.time_of_route,
            rating: this.route.rating,
          });
        });
      } else {
        this.mode = 'routecreate';
        this.routeId = null;
      }
    });
  }

  onAddPlace() {
    console.log('Add Place Function Clicked');
    this.clickedAddPlace = true;
  }

  ifClickedPlace() {
    if (this.clickedAddPlace) {
      this.clickedAddPlace = false;
      return true;
    } else {
      return false;
    }
  }

  onSaveRoute() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'routecreate') {
      this.routesService.addRoute(
        this.form.value.name,
        this.form.value.places,
        this.form.value.content,
        this.form.value.time_of_route,
        this.form.value.rating
      );
    } else {
      this.routesService.updateRoute(
        this.routeId,
        this.form.value.name,
        this.form.value.places,
        this.form.value.content,
        this.form.value.time_of_route,
        this.form.value.rating
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
