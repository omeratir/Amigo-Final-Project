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
      address: new FormControl(null, { validators: [Validators.required] }),
      city: new FormControl(null, { validators: [Validators.required] }),
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
            address: placeData.address,
            city: placeData.city,
            lat: placeData.lat,
            lng: placeData.lng,
            creator: placeData.creator
          };
          this.form.setValue({
            name: this.place.name,
            address: this.place.address,
            city: this.place.city,
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
        this.form.value.address,
        this.form.value.city,
        this.form.value.lat,
        this.form.value.lng
      );
    } else {
      this.placesService.updatePlace(
        this.placeId,
        this.form.value.name,
        this.form.value.address,
        this.form.value.city,
        this.form.value.lat,
        this.form.value.lng
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
