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

@NgModule({
  declarations: [LoginComponent, SignupComponent, ChoseplaceComponent, AccountComponent, UpdateaccountComponent],
  imports: [CommonModule, AngularMaterialModule, FormsModule, AuthRoutingModule ,
    AgmCoreModule.forRoot(
      {
        apiKey: 'AIzaSyDr3IHfD-66OkEpHEg-KscblaXiEA0YeHA'
      }
    ), AgmDirectionModule]
})
export class AuthModule {}
