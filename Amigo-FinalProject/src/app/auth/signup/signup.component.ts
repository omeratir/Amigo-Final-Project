import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import {  MatRadioModule } from '@angular/material';

import { AuthService } from '../auth.service';

interface Sex {
  value: string;
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

  sexes: Sex[] = [ { value: 'Female' } , {value: 'Male' } ];

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
    this.authService.createUser(form.value.email, form.value.password, form.value.firstName, form.value.lastName, form.value.age , form.value.sex , form.value.numberOfDays, form.value.purposeOfTheTrip , form.value.hobbies );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
