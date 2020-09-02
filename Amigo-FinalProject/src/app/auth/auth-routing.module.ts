import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ChoseplaceComponent } from './choseplace/choseplace.component';
import { AccountComponent } from './account/account.component';
import { UpdateaccountComponent } from './update-account/update-account.component';
import { SuggestrouteComponent } from './suggestroute/suggestroute.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'recommend', component: ChoseplaceComponent },
  { path: 'myaccount', component: AccountComponent },
  { path: 'updatemyaccount', component: UpdateaccountComponent },
  { path: 'suggest', component: SuggestrouteComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
