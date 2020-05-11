import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-place-create',
  templateUrl: './place-create.component.html',
  styleUrls: ['./place-create.component.css']
})

export class PlaceCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  place: Place;
  isLoading = false;
  form: FormGroup;
  private mode = 'createplace';
  private placeId: string;
  private authStatusSub: Subscription;

  lat = 52.373169;
  lng = 4.890660;
  zoom = 12;
  previous;

  constructor(
    public placesService: PlacesService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      lat: new FormControl(null, { validators: [Validators.required] }),
      lng: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('placeId')) {
        this.mode = 'placeedit';
        this.placeId = paramMap.get('placeId');
        this.isLoading = true;
        this.placesService.getPlace(this.placeId).subscribe(placeData => {
          this.isLoading = false;
          this.place = {
            id: placeData._id,
            name: placeData.name,
            lat: placeData.lat,
            lng: placeData.lng,
            creator: placeData.creator
          };
          this.form.setValue({
            name: this.place.name,
            lat: this.place.lat,
            lng: this.place.lng
          });
        });
      } else {
        this.mode = 'createplace';
        this.placeId = null;
      }
    });
  }

  onSavePlace() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'createplace') {
      this.placesService.addPlace(
        this.form.value.name,
        this.form.value.lat,
        this.form.value.lng
      );
    } else {
      this.placesService.updatePlace(
        this.placeId,
        this.form.value.name,
        this.form.value.lat,
        this.form.value.lng
      );
    }
    this.form.reset();
  }

  placeMarker($event) {
    console.log('lat:' + $event.coords.lat);
    console.log('lng:' + $event.coords.lng);

    this.form.setValue({
      name: '',
      lat: $event.coords.lat,
      lng: $event.coords.lng
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
