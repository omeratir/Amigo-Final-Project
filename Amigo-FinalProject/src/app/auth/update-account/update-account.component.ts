import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';


import { AuthService } from '../../auth/auth.service';
import { User } from '../user.model';

@Component({
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.css']
})

export class UpdateaccountComponent implements OnInit {


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

  male: boolean;
  female: boolean;

  gender: string;

  hoobies: string;

  isLoading = false;
  private authStatusSub: Subscription;
  private placesSub: Subscription;
  private userId: string;

  user: User;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.Hobby_Sport = false;
    this.Hobby_Culture = false;
    this.Hobby_Food = false;

    this.female = false;
    this.male = false;

    this.hoobies = '';

    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService.getAuthStatusListener().
    subscribe(authStatus => {
        this.isLoading = false;
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

        // this.form.setValue({
        //   email: userData.email,
        //   firstname: this.user.firstName,
        //   lastname: this.user.lastName,
        //   age: this.user.age
        // });
    });

  }


  onSignup(form: NgForm) {
    if (form.invalid) {
      form.value.firstname = this.user.firstName;
      return;
    }
    this.isLoading = true;

    if (this.male === true ) {
      this.gender = 'Male';
    } else if (this.female === true) {
      this.gender = 'Female';
    }

    form.value.liked_place = 'EMPTY';
    form.value.kmeans_array = 'EMPTY';

    form.value.gender = this.gender;

  }
}
