import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Place } from 'src/app/places/place.model';

@Component({
    selector: 'app-place-item',
    templateUrl: 'place-item.component.html',
    styleUrls: ['place-item.component.css']
})
export class PlaceItemComponent implements OnInit, OnChanges {
    @Input() place: Place;
    @Input() userLikedPlaces: string;
    @Input() userUnLikedPlaces:string;
    @Input() userSavedPlaces: string;
    @Input() chartPercent = 0;
    @Input() countLikes = 0;
    @Input() countUnlikes = 0;
    @Output() onSavePlace = new EventEmitter<any>();
    @Output() onUnSavePlace = new EventEmitter<any>();
    @Output() onLikePlace = new EventEmitter<any>();
    @Output() onUnLikePlace = new EventEmitter<any>();
    @Output() removeLikePlace = new EventEmitter<any>();
    @Output() removeUnLikePlace = new EventEmitter<any>();
    @Output() onDeletePlace = new EventEmitter<any>();
    public isLiked = false;
    public isUnLiked = false;
    public isFavorite = false;
    public placeUrl: string;
    public likeMap= {};
    public likeTFMap= {};

    ngOnInit() {
        this.setPlaceUrl();
    }

    ngOnChanges({place, userLikedPlaces, userUnLikedPlaces, userSavedPlaces}: SimpleChanges) {
        if (userLikedPlaces) {
            this.isLiked = this.getIsLiked(userLikedPlaces.currentValue);
        }
        if (userUnLikedPlaces) {
            this.isUnLiked = this.getIsUnLiked(userUnLikedPlaces.currentValue);
        }

        if (userSavedPlaces) {
            this.isFavorite = this.getIsFavorite(userSavedPlaces.currentValue);
        }
    }

    getIsLiked(userLikedPlaces: string) {
        if (userLikedPlaces === 'EMPTY') {
            return false;
          }
        if (userLikedPlaces.includes(this.place.id)) {
            console.log('placeid' + this.place.id);
            return true;
          }
        return false;
    }

    getIsUnLiked(userUnLikedPlaces: string) {
        if (userUnLikedPlaces === 'EMPTY') {
            return false;
          }
        if (userUnLikedPlaces.includes(this.place.id)) {
            console.log('placeid' + this.place.id);
            return true;
          }
        return false;

    }

    getIsFavorite(userSavedPlaces: string) {
        if (userSavedPlaces === 'EMPTY') {
            return false;
          }
        if (userSavedPlaces.includes(this.place.id)) {
            return true;
          }
        return false;
    }

    setPlaceUrl() {
        let placeurl = 'https://www.google.com/search?q=';
        const placeName = this.place.name.split(' ');

        for (const temp of placeName) {
            placeurl = placeurl.concat(temp);
            placeurl = placeurl.concat('+');
        }

        this.placeUrl = placeurl;
    }

}
