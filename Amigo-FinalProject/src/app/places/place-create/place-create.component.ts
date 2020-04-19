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
      nameOfPlace: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      averageDaysOfPlace: new FormControl(null, { validators: [Validators.nullValidator] }),
      destinationForSex: new FormControl(null, { validators: [Validators.nullValidator] }),
      destinationForAges: new FormControl(null, { validators: [Validators.nullValidator] }),
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
            nameOfPlace: placeData.nameOfPlace,
            averageDaysOfPlace: placeData.averageDaysOfPlace,
            destinationForSex: placeData.destinationForSex,
            destinationForAges: placeData.destinationForAges,
            lat: placeData.lat,
            lng: placeData.lng,
            creator: placeData.creator
          };
          this.form.setValue({
            nameOfPlace: this.place.nameOfPlace,
            averageDaysOfPlace: this.place.averageDaysOfPlace,
            destinationForSex: this.place.destinationForSex,
            destinationForAges: this.place.destinationForAges,
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
        this.form.value.nameOfPlace,
        // this.form.value.averageDaysOfPlace,
        // this.form.value.destinationForSex,
        // this.form.value.destinationForAges,
        this.form.value.lat,
        this.form.value.lng
      );
    } else {
      this.placesService.updatePlace(
        this.placeId,
        this.form.value.nameOfPlace,
        this.form.value.averageDaysOfPlace,
        this.form.value.destinationForSex,
        this.form.value.destinationForAges,
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
