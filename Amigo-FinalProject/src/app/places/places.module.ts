import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PlaceCreateComponent } from './place-create/place-create.component';
import { PlaceListComponent } from './place-list/place-list.component';
import { AngularMaterialModule } from '../angular-material.module';

import {MatGridListModule} from '@angular/material/grid-list';
import { AgmCoreModule } from '@agm/core';
import { PlaceFindComponent } from './place-find/placefind.component';
import { PlacestoptenComponent } from './places-topten/places-topten.component';
import { PlaceItemComponent } from './place-find/components/place-item/place-item.component';


@NgModule({
  declarations: [
    PlaceCreateComponent,
    PlaceListComponent,
    PlaceFindComponent,
    PlacestoptenComponent,
    PlaceItemComponent
  ],
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
