import { Component }                    from '@angular/core';
import { IonicPage, NavController, 
         NavParams, ViewController }    from 'ionic-angular';
import { Validators, FormBuilder, 
         FormGroup }                    from '@angular/forms';
import { FormControl }                  from '@angular/forms/src/model';
import { DishProvider }                 from '../../providers/dish/dish';
import { Dish }                         from '../../shared/dish';
import { Comment }                      from '../../shared/comment';

/**
 * Generated class for the CommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {
  dish: Dish;
  commentForm: FormGroup;
  comment: Comment;


  constructor(private dishProvider: DishProvider,
              private params: NavParams,
              public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private formBuilder: FormBuilder) { 
    this.dish = params.data;
    this.commentForm = this.formBuilder.group({
      author: ['', Validators.required ],
      rating: [5 , Validators.required ],
      comment: ['', Validators.required ],
      date: new Date()
    });
  }

  ionViewDidLoad() { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onSubmit() {
    const comment = this.commentForm.value;
    comment.date = new Date().toISOString();
    this.dish.comments.push(comment);
    this.dishProvider.saveDish(this.dish)
    .subscribe(result => { 
      this.viewCtrl.dismiss(result);
    })
  }
}
