import { Component, OnInit } from '@angular/core';
import { google } from '@agm/core/services/google-maps-types';
import { Place } from '../places/place.model';
import { Subscription } from 'rxjs';
import { PlacesService } from '../places/places.service';
import { PageEvent } from '@angular/material';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  goalclicked: boolean;

  places: Place[] = [

  ];

  night: Place[] = [

  ];

  attraction: Place[] = [

  ];

  sport: Place[] = [

  ];

  culture: Place[] = [

  ];

  shop: Place[] = [

  ];

  relax: Place[] = [

  ];

  tempPlacesList: Place[] = [];

  goals: string[] = ['Attractions & Leisure', 'Sport & Extreme', 'Night Life', 'Culture & Historical Places', 'Relaxing', 'Shopping'];

  isLoading = false;
  totalPlaces = 0;
  placesPerPage = 20;
  placeslength = 1;
  currentPage = 1;
  previous;
  latitude = 52.373169;
  longitude = 4.890660;
  zoom = 12;
  pageSizeOptions = [1, 20, 40, 60];
  private placesSub: Subscription;

  constructor(
    public placesService: PlacesService
  ) {}


  ngOnInit(): void  {
    this.goalclicked = false;
    this.isLoading = true;
    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    this.placesSub = this.placesService
      .getPlaceUpdateListener()
      .subscribe((placeData: { places: Place[]; placeCount: number }) => {
        this.isLoading = false;
        this.totalPlaces = placeData.placeCount;
        this.places = placeData.places;
        this.tempPlacesList = placeData.places;
        this.night = placeData.places.filter(place => (place.goal === 'Night Life'));
        this.shop = placeData.places.filter(place => (place.goal === 'Shopping'));
        this.relax = placeData.places.filter(place => (place.goal === 'Relaxing'));
        this.attraction = placeData.places.filter(place => (place.goal === 'Attractions & Leisure'));
        this.sport = placeData.places.filter(place => (place.goal === 'Sport & Extreme'));
        this.culture = placeData.places.filter(place => (place.goal === 'Culture & Historical Places'));
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.placesPerPage = pageData.pageSize;
    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
  }

  filtering(goal: string) {
    this.goalclicked = true;
    console.log('g ' + goal);
    this.places = this.tempPlacesList;

    this.night = this.tempPlacesList.filter(place => (place.goal === 'Night Life'));
    this.shop = this.tempPlacesList.filter(place => (place.goal === 'Shopping'));
    this.relax = this.tempPlacesList.filter(place => (place.goal === 'Relaxing'));
    this.attraction = this.tempPlacesList.filter(place => (place.goal === 'Attractions & Leisure'));
    this.sport = this.tempPlacesList.filter(place => (place.goal === 'Sport & Extreme'));
    this.culture = this.tempPlacesList.filter(place => (place.goal === 'Culture & Historical Places'));


    if (goal === 'Night Life') {
      this.places = this.night;
    }

    if (goal === 'Attractions & Leisure') {
      this.places = this.attraction;
    }

    if (goal === 'Sport & Extreme') {
      this.places = this.sport;
    }

    if (goal === 'Culture & Historical Places') {
      this.places = this.culture;
    }

    if (goal === 'Relaxing') {
      this.places = this.relax;
    }

    if (goal === 'Shopping') {
      this.places = this.shop;
    }
  }

  clickedMarker(infoWindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infoWindow;
  }

  setMapValues(place: Place) {
    this.latitude = +place.lat;
    this.longitude = +place.lng;
    return true;
  }

}
