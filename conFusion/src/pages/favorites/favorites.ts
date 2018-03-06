import { Component, Inject }          from '@angular/core';
import { IonicPage, NavController, 
         NavParams, ItemSliding,
         ToastController, LoadingController, 
         AlertController }            from 'ionic-angular';

import { FavoriteProvider }           from '../../providers/favorite/favorite';
import { Dish }                       from '../../shared/dish';
import { DishProvider } from '../../providers/dish/dish';
         

/**
 * Generated class for the FavoritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {
  favorites: Dish[] = [];
  errMess: string;
  dishes: Dish[];
  favoriteDishIds: number[];

  constructor( public navCtrl: NavController, 
               public navParams: NavParams,
               private favoriteservice: FavoriteProvider,
               public toastCtrl: ToastController,
               private loadingCtrl: LoadingController,
               private alertCtrl: AlertController,
               private dishservice: DishProvider,
               @Inject('BaseURL') private BaseURL) {
  }

  ngOnInit() {
    this.favoriteservice.getFavorites()
        .then(favorites => {
          this.favoriteDishIds = favorites;
          this.dishservice.getDishes().subscribe(datas => {
            this.dishes = datas;
            this.setFavorites();
          })
         
        })
        .catch(err => console.log(err));
  }

  setFavorites() {
    if(this.favoriteDishIds.length === 0) {
      this.favorites = [];
    }
    this.favoriteDishIds.forEach(element => {
      this.dishes.forEach(data => {
        if(element === data.id) {
          this.favorites.push(data);
        }
      })
    });
  }

  ionViewDidLoad() { }

  deleteFavorite(item: ItemSliding, id: number) {
    console.log('delete', id);
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you want to delete Dish '+ id,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete cancelled');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Deleting . . .'
            });
            let toast = this.toastCtrl.create({
              message: 'Dish ' + id + ' deleted successfully', 
              duration: 3000});
            loading.present();
            this.favoriteservice.deleteFavorite(id)
                .then(favorites => { 
                  this.favorites = [];
                  this.favoriteDishIds = favorites;
                  this.setFavorites();
                  loading.dismiss(); 
                  toast.present(); 
                })
                .catch(err => console.log(err));
          }
        }
      ]
    });
  
    alert.present();

    item.close();
  }
}
