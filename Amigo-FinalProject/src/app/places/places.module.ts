import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PlaceCreateComponent } from './place-create/place-create.component';
import { PlaceListComponent } from './place-list/place-list.component';
import { AngularMaterialModule } from '../angular-material.module';

import {MatGridListModule} from '@angular/material/grid-list';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [PlaceCreateComponent, PlaceListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    MatGridListModule,
    AgmCoreModule.forRoot(
      {
        // apiKey: ''
      }
    )
  ]
})
export class PlacesModule {}
