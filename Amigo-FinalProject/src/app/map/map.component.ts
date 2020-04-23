import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { PlacesService } from '../places/places.service';
import { Place } from '../places/place.model';


@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  lat = 52.373169;
  lng = 4.890660;
  zoom = 12;
  previous;


  totalPlaces = 0;
  placesPerPage = 2000;
  placeslength = 1;
  currentPage = 1;

  places: Place[] = [

  ];

  private placesSub: Subscription;

  placeMarker($event) {
    console.log('lat:' + $event.coords.lat);
    console.log('lng:' + $event.coords.lng);
  }

  clickedMarker(infoWindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infoWindow;
  }

  constructor(
    public placesService: PlacesService
  ) {}

  ngOnInit() {
    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    this.placesSub = this.placesService
      .getPlaceUpdateListener()
      .subscribe((placeData: { places: Place[]; placeCount: number }) => {
        this.places = placeData.places;
      });
}

}

