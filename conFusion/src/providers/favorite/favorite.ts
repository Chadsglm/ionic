import { Http }                               from '@angular/http';
import { Injectable }                         from '@angular/core';

import { Storage }                            from '@ionic/storage';
import { LocalNotifications }                 from '@ionic-native/local-notifications';

import { Dish }                               from '../../shared/dish';
import { Observable }                         from 'rxjs/Observable';
import { DishProvider }                       from '../dish/dish';

/*
  Generated class for the FavoriteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class FavoriteProvider {

  favorites: Array<any>;

  constructor(public http: Http,
              private dishservice: DishProvider, 
              private storage: Storage,
              private localNotifications: LocalNotifications) {
      this.storage.get('favorites').then(res => {this.favorites = res;});
  }

  getFavorites() {
    return this.storage.get('favorites');
  }
  
  isFavorite(id) {
    return this.favorites.some(el => el === id);
  }

  deleteByValue(array, elm) {
     const arr = [];
     array.forEach(element => {
       if(element != elm) {
         arr.push(element);
       }
     });
     return arr;
  }

  deleteFavorite(id){ 
    return this.storage.get('favorites').then(favs => {
      const rest = this.deleteByValue(favs, id);
      return this.storage.set('favorites', rest).then(() => {
        return this.getFavorites();
      })
    }); 
  }
  
  addFavorite(id){
    if (!this.isFavorite(id)) {
      this.favorites.push(id);
      this.storage.set('favorites', this.favorites);

      this.localNotifications.schedule({
        id: id,
        text: 'Dish ' + id + ' added as a favorite successfully '
      });
    } 
    return Promise.reject('this id has already been saved!'); ;
  }
/*
  addFavorite(id: number): boolean {
    if (!this.isFavorite(id))
      this.favorites.push(id);
    console.log('favorites', this.favorites);
    return true;
  }

  isFavorite(id: number): boolean {
    return this.favorites.some(el => el === id);
  }

  getFavorites(): Observable<Dish[]> {
    return this.dishservice.getDishes()
               .map(dishes => dishes
               .filter(dish => this.favorites.some(el => el === dish.id)));
  }

  deleteFavorite(id: number): Observable<Dish[]> {
    let index = this.favorites.indexOf(id);
    if (index >= 0) {
      this.favorites.splice(index,1);
      return this.getFavorites();
    }
    else {
      console.log('Deleting non-existant favorite', id);
      return Observable.throw('Deleting non-existant favorite' + id);
    }
  }
  */
}
