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
  isLoading = false;
  private authStatusSub: Subscription;
  sex: string;
  constructor(public authService: AuthService) {}

  genders: Gender[] = [
    {value: 'Female', viewValue: 'Female'},
    {value: 'Male', viewValue: 'Male'}
  ];

  ngOnInit() {
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

    // tslint:disable-next-line: max-line-length
    this.authService.createUser(form.value.email, form.value.password, form.value.firstName, form.value.lastName, form.value.age , form.value.gender, form.value.hobbies );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
