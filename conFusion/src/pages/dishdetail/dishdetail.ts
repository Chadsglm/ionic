import { Component, Inject }                    from '@angular/core';
import { IonicPage, NavController, Platform,
         NavParams, ToastController,ModalController,
         ActionSheetController}                 from 'ionic-angular';
import { Dish }                                 from '../../shared/dish';
import { Comment }                              from '../../shared/comment';
import { FavoriteProvider }                     from '../../providers/favorite/favorite';
import { CommentPage }                          from '../../pages/comment/comment';

/**
 * Generated class for the DishdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              public platform: Platform,
              private toastCtrl: ToastController,
              private favoriteservice: FavoriteProvider,
              public modalCtrl: ModalController,
              @Inject('BaseURL') private BaseURL) {

    this.dish = navParams.get('dish');
    this.updateDetailsView();
  }

  updateDetailsView() {
    this.favorite = this.favoriteservice.isFavorite(this.dish.id);
    this.numcomments = this.dish.comments.length;
    
    let total = 0;
    this.dish.comments.forEach(comment => total += comment.rating );
    this.avgstars = (total/this.numcomments).toFixed(2);
  }

  ionViewDidLoad() { }

  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);

    this.toastCtrl.create({
      message: 'Dish ' + this.dish.id + ' added as favorite successfully',
      position: 'middle',
      duration: 3000}).present();
  }

  openComment() {
    let modal = this.modalCtrl.create(CommentPage, { dishId: this.dish.id });
    modal.onDidDismiss(data => {
      this.dish = data;
      this.updateDetailsView();
    });
    modal.present();
  }

  openMenu() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Actions',
      buttons: [
        {
          text: 'Add to Favorites',
          handler: () => {
            console.log('Add to Favorites clicked');
            this.addToFavorites();
          }
        },
        {
          text: 'Add a Comment',
          handler: () => {
            console.log('Add a Comment clicked');
            this.openComment();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
 
    actionSheet.present();
  }

}