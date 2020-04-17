import { Component, OnInit } from '@angular/core';
import { Post } from '../posts/post.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { PostsService } from '../posts/posts.service';
import { PlacesService } from '../places/places.service';
import { Place } from '../places/place.model';


@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  lat = 31.968910;
  lng = 34.770729;
  zoom = 9;
  previous;

  posts: Post[] = [

  ];

  places: Place[] = [

  ];

  private postsSub: Subscription;

  postsPerPage = 100;
  currentPage = 1;

  private placesSub: Subscription;

  placesPerPage = 100;

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
    public postsService: PostsService,
    public placesService: PlacesService
  ) {}

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.posts = postData.posts;
      });

    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    this.placesSub = this.placesService
        .getPlaceUpdateListener()
        .subscribe((placeData: { places: Place[]; placeCount: number }) => {
          this.places = placeData.places;
        });
  }


}
