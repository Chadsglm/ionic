import { Component, Inject }                    from '@angular/core';
import { IonicPage, NavController, Platform,
         NavParams, ToastController,ModalController,
         ActionSheetController}                 from 'ionic-angular';
import { Dish }                                 from '../../shared/dish';
import { Comment }                              from '../../shared/comment';
import { FavoriteProvider }                     from '../../providers/favorite/favorite';
import { CommentPage }                          from '../../pages/comment/comment';
import { SocialSharing }                        from '@ionic-native/social-sharing';

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
              private socialSharing: SocialSharing,
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
    this.favoriteservice.addFavorite(this.dish.id)
        .then(res => {
          this.favorite = !this.favorite;
          this.toastCtrl.create({
            message: 'Dish ' + this.dish.id + ' added as favorite successfully',
            position: 'middle',
            duration: 3000}).present();
        })
        .catch(err =>{
          console.log('have a anymistake', err);
        });
  }

  openComment() {
    let modal = this.modalCtrl.create(CommentPage, this.dish);
    modal.onDidDismiss(dish => {
      this.dish = dish;
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
          text: 'Share via Facebook',
          handler: () => {
            this.socialSharing.shareViaFacebook(
              this.dish.name + ' -- ' + this.dish.description, 
              this.BaseURL + this.dish.image, '')
              .then(() => console.log('Posted successfully to Facebook'))
              .catch(() => console.log('Failed to post to Facebook'));
          }
        },
        {
          text: 'Share via Twitter',
          handler: () => {
            this.socialSharing.shareViaTwitter(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
              .then(() => console.log('Posted successfully to Twitter'))
              .catch(() => console.log('Failed to post to Twitter'));
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