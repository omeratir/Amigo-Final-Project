import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                place: post.place,
                rating: post.rating,
                content: post.content,
                time_of_place: post.time_of_place,
                purpose_of_place: post.purpose_of_place,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      place: string,
      rating: string,
      content: string;
      time_of_place: string,
      purpose_of_place: string,
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  // tslint:disable-next-line: variable-name
  addPost(title: string, place: string, rating: string, content: string, time_of_place: string, purpose_of_place: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('place', place);
    postData.append('rating', rating);
    postData.append('content', content);
    postData.append('time_of_place', time_of_place);
    postData.append('purpose_of_place', purpose_of_place);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  // tslint:disable-next-line: max-line-length   // tslint:disable-next-line: variable-name
  updatePost(id: string, title: string, place: string, rating: string, content: string, time_of_place: string , purpose_of_place: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('place', place);
      postData.append('rating', rating);
      postData.append('content', content);
      postData.append('time_of_place', time_of_place);
      postData.append('purpose_of_place', purpose_of_place);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        place,
        rating,
        content,
        time_of_place,
        purpose_of_place,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }

}
