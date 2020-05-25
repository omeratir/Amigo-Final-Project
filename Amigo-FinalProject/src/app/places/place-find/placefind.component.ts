import { Component, OnInit } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { bufferTime } from 'rxjs/operators';

@Component({
  templateUrl: './placefind.component.html',
  styleUrls: ['./placefind.component.css']
})

export class PlaceFindComponent implements OnInit {
  // tslint:disable-next-line: variable-name
  Goal_Sport_And_Extreme: boolean;
  // tslint:disable-next-line: variable-name
  Goal_Shopping: boolean;
  // tslint:disable-next-line: variable-name
  Goal_Attractions_Leisure: boolean;
  // tslint:disable-next-line: variable-name
  Goal_Night_Life: boolean;
  // tslint:disable-next-line: variable-name
  Goal_Relaxing: boolean;
  // tslint:disable-next-line: variable-name
  Goal_Culture_And_Historical_Places: boolean;

  placeFindBtnClicked: boolean;
  checked: boolean;
  likeClicked: boolean;

  lat = 52.373169;
  lng = 4.890660;
  zoom = 12;
  previous;

  like: boolean;
  unlike: boolean;

  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    this.placeFindBtnClicked = false;
    this.Goal_Attractions_Leisure = false;
    this.Goal_Culture_And_Historical_Places = false;
    this.Goal_Night_Life = false;
    this.Goal_Relaxing = false;
    this.Goal_Shopping = false;
    this.Goal_Sport_And_Extreme = false;
    this.likeClicked = false;
    this.like = false;
    this.unlike = false;
  }

  onChangeCheckBox() {
    console.log('Goal_Attractions_Leisure = ' + this.Goal_Attractions_Leisure);
    this.Goal_Attractions_Leisure = !this.Goal_Attractions_Leisure;
  }

  onClickFindPlace() {
    console.log('Clicked on find place');
    this.placeFindBtnClicked = true;
    console.log('Goal_Attractions_Leisure = ' + this.Goal_Attractions_Leisure);
    console.log('Goal_Culture_And_Historical_Places = ' + this.Goal_Culture_And_Historical_Places);
    console.log('Goal_Night_Life = ' + this.Goal_Night_Life);
    console.log('Goal_Relaxing = ' + this.Goal_Relaxing);
    console.log('Goal_Shopping = ' + this.Goal_Shopping);
    console.log('Goal_Sport_And_Extreme = ' + this.Goal_Sport_And_Extreme);

  }

  clickedMarker(infoWindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infoWindow;
  }

  LikeClicked() {
    console.log('Like Clicked');
  }

  UnLikeClicked() {
    console.log('UnLike Clicked');
  }



}
