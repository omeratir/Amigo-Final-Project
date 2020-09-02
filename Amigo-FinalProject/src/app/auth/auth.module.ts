import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { ChoseplaceComponent } from './choseplace/choseplace.component';
import { AgmCoreModule } from '@agm/core';
import { AccountComponent } from './account/account.component';
import { UpdateaccountComponent } from './update-account/update-account.component';
import { AgmDirectionModule } from 'agm-direction';
import { SuggestrouteComponent } from './suggestroute/suggestroute.component';
import { ReactiveFormsModule } from '@angular/forms';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ChoseplaceComponent, AccountComponent, UpdateaccountComponent, SuggestrouteComponent],
  imports: [CommonModule, AngularMaterialModule, FormsModule, AuthRoutingModule ,  ReactiveFormsModule,

    AgmCoreModule.forRoot(
      {
      }
    ), AgmDirectionModule]
})
export class AuthModule {}
