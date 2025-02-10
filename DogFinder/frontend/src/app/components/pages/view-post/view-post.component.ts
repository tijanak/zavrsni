import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from 'frontend/src/app/store/app.reducer';
import { skip, Subscription } from 'rxjs';
import {
  selectPostMatches,
  selectSelectedPost,
} from 'frontend/src/app/store/post/post.selectors';
import { IPost, IUser } from '@dog-finder/models';
import { PostComponent } from '../../post/post.component';
import { PostsComponent } from '../../posts/posts.component';
import { MatIconModule } from '@angular/material/icon';
import { selectProfile } from 'frontend/src/app/store/user/user.selector';
import { deletePost } from 'frontend/src/app/store/post/post.actions';

@Component({
  selector: 'app-view-post',
  standalone: true,
  imports: [CommonModule, PostComponent, PostsComponent, MatIconModule],
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css'],
})
export class ViewPostComponent implements OnDestroy, OnInit {
  postSubscription: Subscription;
  matchesSubscription: Subscription;
  userSubscription: Subscription;
  post: IPost | undefined;
  matches: IPost[];
  user: IUser | null = null;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.postSubscription = this.store
      .select(selectSelectedPost)
      .subscribe((post) => {
        if (post) {
          this.post = JSON.parse(JSON.stringify(post));
          this.matchesSubscription = this.store
            .select(selectPostMatches)
            .pipe(skip(1))
            .subscribe((matches) => {
              this.matches = matches;
            });
          console.log(this.post);
        }
      });
    this.userSubscription = this.store.select(selectProfile).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    if (this.postSubscription) this.postSubscription.unsubscribe();
    if (this.matchesSubscription) this.matchesSubscription.unsubscribe();
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  deletePost() {
    if (this.post) {
      this.store.dispatch(deletePost({ id: this.post.id }));
    }
  }
}

