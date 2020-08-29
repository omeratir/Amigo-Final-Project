import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { PlacesService } from 'src/app/places/places.service';
import { PlaceLikeData } from 'src/app/places/PlaceLikeData.model';
import { Place } from 'src/app/places/place.model';

interface Gender {
  value: string;
  viewValue: string;
}

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line: variable-name
  Hobby_Sport: boolean;
  // tslint:disable-next-line: variable-name
  Hobby_Culture: boolean;
  // tslint:disable-next-line: variable-name
  Hobby_Food: boolean;

  // tslint:disable-next-line: variable-name
  liked_places: string;
  // tslint:disable-next-line: variable-name
  kmeans_array: string;
  // tslint:disable-next-line: variable-name
  unliked_places: string;
  // tslint:disable-next-line: variable-name
  save_places: string;

  male: boolean;
  female: boolean;

  gender: string;

  hoobies: string;

  isLoading = false;
  private authStatusSub: Subscription;
  private placesSub: Subscription;

  totalPlaces = 0;
  placesPerPage = 2000;
  placeslength = 1;
  currentPage = 1;

  places: Place[] = [

  ];
  sex: string;
  // tslint:disable-next-line: variable-name
  liked_place: string;
  constructor(public authService: AuthService , public placesService: PlacesService
    ) {}

  genders: Gender[] = [
    {value: 'Female', viewValue: 'Female'},
    {value: 'Male', viewValue: 'Male'}
  ];

  ngOnInit() {
    this.Hobby_Sport = false;
    this.Hobby_Culture = false;
    this.Hobby_Food = false;

    this.female = false;
    this.male = false;

    this.hoobies = '';

    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    this.placesSub = this.placesService
        .getPlaceUpdateListener()
        .subscribe((placeData: { places: Place[]; placeCount: number }) => {
          this.places = placeData.places;
        });

    this.authStatusSub = this.authService.
    getAuthStatusListener().
    subscribe(authStatus => {
        this.isLoading = false;
      });

  }

  sortPlaces() {
    this.places = this.placesService.sortPlacesByLikes(this.places);
    return true;
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;

    if (this.male === true ) {
      this.gender = 'Male';
    } else if (this.female === true) {
      this.gender = 'Female';
    }

    this.liked_place = 'EMPTY';

    form.value.liked_place = 'EMPTY';
    form.value.kmeans_array = 'EMPTY';
    form.value.unliked_places_array = 'EMPTY';
    form.value.liked_places_array = 'EMPTY';

    form.value.gender = this.gender;

    // tslint:disable-next-line: max-line-length
    this.authService.createUser(form.value.email, form.value.password, form.value.firstName, form.value.lastName, form.value.age , form.value.gender, this.Hobby_Sport, this.Hobby_Culture, this.Hobby_Food , form.value.liked_place , form.value.liked_places_array, form.value.unliked_places_array, form.value.kmeans_array );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
