import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { ChoseplaceComponent } from './choseplace/choseplace.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ChoseplaceComponent],
  imports: [CommonModule, AngularMaterialModule, FormsModule, AuthRoutingModule ,
    AgmCoreModule.forRoot(
      {
        // apiKey: ''
      }
    )]
})
export class AuthModule {}
