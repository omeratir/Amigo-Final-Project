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
             age: string, gender: string, sport: boolean, culture: boolean, food: boolean , liked_place: string , liked_places_array: string , unliked_places_array: string , kmeans_array: string) {
    const authData: AuthData = { email, password };
    localStorage.setItem('email', email);
    // tslint:disable-next-line: max-line-length
    const user: User = {email , password , firstName, lastName, age, gender , sport, culture, food , liked_place , liked_places_array, unliked_places_array, kmeans_array  };
    this.userSavedPlaces = liked_place;
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
      liked_places_array: 'null',
      unliked_places_array: 'null',
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
        liked_places_array: string;
        unliked_places_array: string;
        kmeans_array: string;
      }>(BACKEND_URL + id);
  }

  getUserFullData(id: string) {
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
      liked_places_array: string;
      unliked_places_array: string;
      kmeans_array: string;
      count_of_liked_places: number;

      sportsAndExtreme: number;
      cultureAndHistoricalPlaces: number;
      attractionsAndLeisure: number;
      rest: number;
      nightLife: number;
      shopping: number;

      avg_age20: number;
      avg_age35: number;
      avg_age50: number;
      avg_age_120: number;

      avg_gender_place: number;
      avg_sport_place: number;
      avg_culture_place: number;
      avg_food_place: number;

    }>(BACKEND_URL + 'userfulldata/' + id);
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
                            gender: string, sport: boolean, culture: boolean, food: boolean, liked_place: string , liked_places_array: string , unliked_places_array: string ,  kmeans_array: string) {
      if (liked_place === 'EMPTY') {
        liked_place = placeid;
      } else {
        liked_place = liked_place.concat(',', placeid);
      }
      this.userSavedPlaces = liked_place;
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
        liked_places_array,
        unliked_places_array,
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
                                gender: string, sport: boolean, culture: boolean, food: boolean, liked_place: string , liked_places_array: string , unliked_places_array: string ,  kmeans_array: string) {

        this.tempplaces = liked_place.split(',');
        liked_place = '';
        for (const place of this.tempplaces) {
          if (place !== placeid) {
            liked_place = liked_place.concat(place, ',');
          }
        }
        console.log('liked1:',liked_place);
        
        if (liked_place === '') {
          liked_place = 'EMPTY';
        }
        else{
          liked_place = liked_place.substring(0,liked_place.length-1);
        }
        this.userSavedPlaces = liked_place;
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
          liked_places_array,
          unliked_places_array,
          kmeans_array
        };
        console.log('liked:',liked_place);
        this.http
          .put(BACKEND_URL + id, userData)
          .subscribe(response => {
            // this.router.navigate(['/']);
          });
      }
    
  updateUser(id: string, email: string, password: string, firstName: string, lastName: string, age: string,
             // tslint:disable-next-line: variable-name tslint:disable-next-line: max-line-length
             gender: string, sport: boolean, culture: boolean, food: boolean, liked_place: string , liked_places_array: string , unliked_places_array: string ,  kmeans_array: string) {
              
  let userData: UserData | FormData;
  userData = new FormData();
  this.userSavedPlaces = liked_place;

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
    liked_places_array,
    unliked_places_array,
    kmeans_array
  };

  this.http
    .put(BACKEND_URL + 'updateuser/' + id, userData)
    .subscribe(response => {
      // this.router.navigate(['/']);
    });
}

updateUserData(id: string, email: string, password: string, firstName: string, lastName: string, age: string,
             // tslint:disable-next-line: variable-name tslint:disable-next-line: max-line-length
               gender: string, sport: boolean, culture: boolean, food: boolean, liked_place: string , liked_places_array: string , unliked_places_array: string ,  kmeans_array: string) {

  let userData: UserData | FormData;
  userData = new FormData();
  this.userSavedPlaces = liked_place;

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
  liked_places_array,
  unliked_places_array,
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
                gender: string, sport: boolean, culture: boolean, food: boolean, liked_place: string , liked_places_array: string , unliked_places_array: string ,  kmeans_array: string) {

  let userData: UserData | FormData;
  userData = new FormData();
  this.userSavedPlaces = liked_place;

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
  liked_places_array,
  unliked_places_array,
  kmeans_array
  };

  this.http
  .put(BACKEND_URL + 'updateuser/' + id, userData)
  .subscribe(response => {
  // this.router.navigate(['/']);
  });
}

}
