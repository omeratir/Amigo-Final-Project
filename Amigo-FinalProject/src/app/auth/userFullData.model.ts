export interface UserFullData {
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

  sportsAndExtreme: string;
  cultureAndHistoricalPlaces: string;
  attractionsAndLeisure: string;
  rest: string;
  nightLife: string;
  shopping: string;

  avg_age20: number;
  avg_age35: number;
  avg_age50: number;
  avg_age_120: number;

  avg_gender_place: number;
  avg_sport_place: number;
  avg_culture_place: number;
  avg_food_place: number;

}
