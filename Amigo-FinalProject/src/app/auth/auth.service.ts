import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthData } from './auth-data.model';
import { User } from './user.model';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private user: User;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, firstName: string, lastName: string,
             // tslint:disable-next-line: variable-name
             age: string, gender: string, sport: boolean, culture: boolean, food: boolean , liked_place: string) {
    const authData: AuthData = { email, password };
    const user: User = {email , password , firstName, lastName, age, gender , sport, culture, food , liked_place  };
    this.http.post(BACKEND_URL + '/signup', user).subscribe(
      () => {
        this.router.navigate(['/auth/login']);
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
            this.router.navigate(['/home']);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
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

  updateUser(email: string, password: string, firstName: string, lastName: string, age: string, gender: string, sport: boolean, culture: boolean, food: boolean, liked_place: string) {
  let userData: User | FormData;
  userData = {
    email,
    password,
    firstName,
    lastName,
    age,
    gender,
    sport,
    culture,
    food,
    liked_place
  };
  // userData = new FormData();
  // userData.append('email', email);
  // userData.append('password', password);
  // userData.append('firstName', firstName);
  // userData.append('lastName', lastName);
  // userData.append('age', age);
  // userData.append('gender', gender);
  // userData.append('sport', sport);
  // userData.append('culture', culture);
  // userData.append('food', food);
  // userData.append('liked_place', liked_place);

  this.http
    .put(BACKEND_URL + this.getUserId(), userData)
    .subscribe(response => {
      this.router.navigate(['/']);
    });
}
}
