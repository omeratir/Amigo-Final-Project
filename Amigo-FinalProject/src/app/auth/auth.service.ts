import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthData } from './auth-data.model';
import { User } from './user.model';
import { UserData } from './userData.model';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private user: User;
  private email: string;
  private userSavedPlaces: string;

  private tempplaces: string[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserSavedPlaces() {
    return this.userSavedPlaces;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, firstName: string, lastName: string,
             // tslint:disable-next-line: max-line-length tslint:disable-next-line: variable-name
             age: string, gender: string, sport: boolean, culture: boolean, food: boolean , liked_place: string , unliked_place: string , save_place: string , kmeans_array: string) {
    const authData: AuthData = { email, password };
    localStorage.setItem('email', email);
    // tslint:disable-next-line: max-line-length
    const user: User = {email , password , firstName, lastName, age, gender , sport, culture, food , liked_place , unliked_place, save_place, kmeans_array  };
    this.userSavedPlaces = save_place;
    this.http.post(BACKEND_URL + '/signup', user).subscribe(
      () => {
        this.router.navigate(['/auth/recommend']);
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + '/login',
        authData
      )
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(['/']);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  onSignUpAfterChosePlace(places: string) {
    this.email = localStorage.getItem('email');
    console.log('email = ' + this.email);

    let userData: User;

    userData = {
      email: this.email,
      password: 'null',
      firstName: 'null',
      lastName: 'null',
      age: 'null',
      gender: 'null',
      sport: true,
      culture: true,
      food: true,
      liked_place: places,
      unliked_place: 'null',
      save_place: 'null',
      kmeans_array: 'null'
    };

    this.http
    .put(BACKEND_URL + 'update/' + this.email , userData)
    .subscribe(response => {
      // this.router.navigate(['/']);
    });
  }

  getUserData(id: string) {
      return this.http.get<{
       // _id: string,
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        age: string;
        gender: string;
        sport: boolean;
        culture: boolean;
        food: boolean;
        liked_place: string;
        unliked_place: string;
        save_place: string;
        kmeans_array: string;
      }>(BACKEND_URL + id);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    };
  }

  upadateUserAfterSavePlace(placeid: string , id: string, email: string, password: string, firstName: string, lastName: string, age: string,
    // tslint:disable-next-line: variable-name tslint:disable-next-line: max-line-length
                            gender: string, sport: boolean, culture: boolean, food: boolean, liked_place: string , unliked_place: string , save_place: string ,  kmeans_array: string) {
      if (save_place === 'EMPTY') {
         save_place = placeid;
      } else {
       save_place = save_place.concat(',', placeid);
      }
      this.userSavedPlaces = save_place;
      let userData: UserData | FormData;
      userData = new FormData();

      userData = {
        id,
        email,
        password,
        firstName,
        lastName,
        age,
        gender,
        sport,
        culture,
        food,
        liked_place,
        unliked_place,
        save_place,
        kmeans_array
      };

      this.http
        .put(BACKEND_URL + id, userData)
        .subscribe(response => {
          // this.router.navigate(['/']);
        });
    }

    // tslint:disable-next-line: max-line-length
    upadateUserAfterUnSavePlace(placeid: string , id: string, email: string, password: string, firstName: string, lastName: string, age: string,
      // tslint:disable-next-line: variable-name tslint:disable-next-line: max-line-length
                                gender: string, sport: boolean, culture: boolean, food: boolean, liked_place: string , unliked_place: string , save_place: string ,  kmeans_array: string) {

        this.tempplaces = save_place.split(',');
        save_place = '';
        for (const place of this.tempplaces) {
          if (place !== placeid) {
            save_place = save_place.concat(place, ',');
          }
        }
        if (save_place === '') {
          save_place = 'EMPTY';
        }
        this.userSavedPlaces = save_place;
        let userData: UserData | FormData;
        userData = new FormData();

        userData = {
          id,
          email,
          password,
          firstName,
          lastName,
          age,
          gender,
          sport,
          culture,
          food,
          liked_place,
          unliked_place,
          save_place,
          kmeans_array
        };

        this.http
          .put(BACKEND_URL + id, userData)
          .subscribe(response => {
            // this.router.navigate(['/']);
          });
      }

  updateUser(id: string, email: string, password: string, firstName: string, lastName: string, age: string,
             // tslint:disable-next-line: variable-name tslint:disable-next-line: max-line-length
             gender: string, sport: boolean, culture: boolean, food: boolean, liked_place: string , unliked_place: string , save_place: string ,  kmeans_array: string) {

  let userData: UserData | FormData;
  userData = new FormData();
  this.userSavedPlaces = save_place;

  userData = {
    id,
    email,
    password,
    firstName,
    lastName,
    age,
    gender,
    sport,
    culture,
    food,
    liked_place,
    unliked_place,
    save_place,
    kmeans_array
  };

  this.http
    .put(BACKEND_URL + id, userData)
    .subscribe(response => {
      // this.router.navigate(['/']);
    });
}

updateUserData(id: string, email: string, password: string, firstName: string, lastName: string, age: string,
             // tslint:disable-next-line: variable-name tslint:disable-next-line: max-line-length
               gender: string, sport: boolean, culture: boolean, food: boolean, liked_place: string , unliked_place: string , save_place: string ,  kmeans_array: string) {

  let userData: UserData | FormData;
  userData = new FormData();
  this.userSavedPlaces = save_place;

  userData = {
  id,
  email,
  password,
  firstName,
  lastName,
  age,
  gender,
  sport,
  culture,
  food,
  liked_place,
  unliked_place,
  save_place,
  kmeans_array
  };

  this.http
  .put(BACKEND_URL + 'update/' + id, userData)
  .subscribe(response => {
  // this.router.navigate(['/']);
  });
}

updateUserData2(id: string, email: string, password: string, firstName: string, lastName: string, age: string,
                             // tslint:disable-next-line: variable-name tslint:disable-next-line: max-line-length
                gender: string, sport: boolean, culture: boolean, food: boolean, liked_place: string , unliked_place: string , save_place: string ,  kmeans_array: string) {

  let userData: UserData | FormData;
  userData = new FormData();
  this.userSavedPlaces = save_place;

  userData = {
  id,
  email,
  password,
  firstName,
  lastName,
  age,
  gender,
  sport,
  culture,
  food,
  liked_place,
  unliked_place,
  save_place,
  kmeans_array
  };

  this.http
  .put(BACKEND_URL + 'updateuser/' + id, userData)
  .subscribe(response => {
  // this.router.navigate(['/']);
  });
}

}
