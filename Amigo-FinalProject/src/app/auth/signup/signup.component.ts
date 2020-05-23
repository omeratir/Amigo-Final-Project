import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { timingSafeEqual } from 'crypto';

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

    // console.log('Hobby_Sport = ' + this.Hobby_Sport);
    // console.log('Hobby_Food = ' + this.Hobby_Food);
    // console.log('Hobby_Culture = ' + this.Hobby_Culture);

    // if (this.Hobby_Sport === true) {
    //   this.hoobies = 'Sport';
    // }
    // if (this.Hobby_Food === true ) {
    //   if (this.hoobies === '') {
    //     this.hoobies = 'Food';
    //   } else {
    //     this.hoobies.concat(',Food');
    //   }
    // }
    // if (this.Hobby_Culture === true ) {
    //   if (this.hoobies === '') {
    //     this.hoobies = 'Culture';
    //   } else {
    //     this.hoobies.concat(',Culture');
    //   }
    // }

    // console.log('hobbies = ' + this.hoobies);

    // tslint:disable-next-line: max-line-length
    this.authService.createUser(form.value.email, form.value.password, form.value.firstName, form.value.lastName, form.value.age , form.value.gender, form.value.hobbies );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
