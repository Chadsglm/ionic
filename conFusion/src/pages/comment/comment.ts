import { Component }                    from '@angular/core';
import { IonicPage, NavController, 
         NavParams, ViewController }    from 'ionic-angular';
import { Validators, FormBuilder, 
         FormGroup }                    from '@angular/forms';
import { FormControl }                  from '@angular/forms/src/model';
import { DishProvider } from '../../providers/dish/dish';
import { Dish } from '../../shared/dish';

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

  constructor(private dishProvider: DishProvider,
              private params: NavParams,
              public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private formBuilder: FormBuilder) {
    
    this.getDish(params.get('dishId'));
    this.commentForm = this.formBuilder.group({
      author: ['', Validators.required ],
      rating: [5 , Validators.required ],
      comment: ['', Validators.required ],
      date: new Date()
    });
  }

  getDish(id: number) {
    this.dishProvider.getDish(id).subscribe(dish => {
      this.dish = dish;
    })
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
