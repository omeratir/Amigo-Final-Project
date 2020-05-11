import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from '../../auth/auth.service';
import { Place } from 'src/app/places/place.model';
import { PlacesService } from 'src/app/places/places.service';


interface Rate {
  value: string;
  viewValue: string;
}

interface Purpose {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'postcreate';
  private postId: string;
  private authStatusSub: Subscription;

  rates: Rate[] = [
    {value: '1-Very Bad', viewValue: '1-Very Bad'},
    {value: '2-Bad', viewValue: '2-Bad'},
    {value: '3-Nice', viewValue: '3-Nice'},
    {value: '4-Very Good', viewValue: '4-Very Good'},
    {value: '5-Excellent', viewValue: '5-Exellent'}
  ];

  purpose: Purpose[] = [
    {value: 'Attractions & Leisure', viewValue: 'Attractions & Leisure'},
    {value: 'Sport & Extreme', viewValue: 'Sport & Extreme'},
    {value: 'Night Life', viewValue: 'Night Life'},
    {value: 'Culture &  Historical Places', viewValue: 'Culture &  Historical Places'},
    {value: 'Rest', viewValue: 'Rest'},
    {value: 'Shopping', viewValue: 'Shopping'}
  ];

  places: Place[] = [

  ];

  private placesSub: Subscription;

  placesPerPage = 2000;
  currentPage = 1;


  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    public placesService: PlacesService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });

    this.placesService.getPlaces(this.placesPerPage, this.currentPage);
    this.placesSub = this.placesService
          .getPlaceUpdateListener()
          .subscribe((placeData: { places: Place[]; placeCount: number }) => {
            this.places = placeData.places;
          });

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)]
      }),
      place: new FormControl(null, { validators: [Validators.required] }),
      rating: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      purpose_of_place: new FormControl(null, { validators: [Validators.required] }),
      time_of_place: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            place: postData.place,
            rating: postData.rating,
            content: postData.content,
            time_of_place: postData.time_of_place,
            purpose_of_place: postData.purpose_of_place,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            place: this.post.place,
            rating: this.post.rating,
            content: this.post.content,
            time_of_place: this.post.time_of_place,
            purpose_of_place: this.post.purpose_of_place,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'postcreate';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'postcreate') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.place,
        this.form.value.rating,
        this.form.value.content,
        this.form.value.time_of_place,
        this.form.value.purpose_of_place,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.place,
        this.form.value.rating,
        this.form.value.content,
        this.form.value.time_of_place,
        this.form.value.purpose_of_place,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
