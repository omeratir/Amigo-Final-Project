import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RouteCreateComponent } from './route-create/route-create.component';
import { RouteListComponent } from './route-list/route-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { AgmCoreModule } from '@agm/core';

import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  declarations: [RouteCreateComponent, RouteListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    MatGridListModule,
    AgmCoreModule.forRoot(
      {
        // apiKey: '',
        // libraries: ['places']
      }
    )
  ]
})
export class RoutesModule {}
