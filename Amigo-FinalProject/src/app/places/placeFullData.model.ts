export interface PlaceFullData {
  id: string;
  name: string;
  lat: string;
  lng: string;
  goal: string;
  count_of_likes: number;
  count_of_place_likes: number;
  count_of_place_unlikes: number;
  creator: string;
  photo: string;

  gender_avg: number;

  count_sport: number;
  count_culture: number;
  count_food: number;

  count_female: number;
  count_male: number;

  avg_sport: number;
  avg_culture: number;
  avg_food: number;

  count_age20: number;
  count_age35: number;
  count_age50: number;
  count_age120: number;
}
