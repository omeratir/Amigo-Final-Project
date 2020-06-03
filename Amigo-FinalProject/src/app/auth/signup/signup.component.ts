import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

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

  male: boolean;
  female: boolean;

  gender: string;

  hoobies: string;

  isLoading = false;
  private authStatusSub: Subscription;
  sex: string;
  constructor(public authService: AuthService) {}

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

    this.authStatusSub = this.authService.
    getAuthStatusListener().
    subscribe(authStatus => {
        this.isLoading = false;
      });

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

    form.value.gender = this.gender;

    // tslint:disable-next-line: max-line-length
    this.authService.createUser(form.value.email, form.value.password, form.value.firstName, form.value.lastName, form.value.age , form.value.gender, this.Hobby_Sport, this.Hobby_Culture, this.Hobby_Food , 'null' );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
