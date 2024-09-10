import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from 'frontend/src/app/store/app.reducer';
import { Subscription } from 'rxjs';
import {
  selectPostMatches,
  selectSelectedPost,
} from 'frontend/src/app/store/post/post.selectors';
import { IPost } from '@dog-finder/models';
import { PostComponent } from '../../post/post.component';
import { PostsComponent } from '../../posts/posts.component';

@Component({
  selector: 'app-view-post',
  standalone: true,
  imports: [CommonModule, PostComponent, PostsComponent],
  templateUrl: './view-post.component.html',
  styleUrl: './view-post.component.css',
})
export class ViewPostComponent implements OnDestroy, OnInit {
  postSubscription: Subscription;
  matchesSubscription: Subscription;
  post: IPost | undefined;
  matches: IPost[];
  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {
    this.postSubscription = this.store
      .select(selectSelectedPost)
      .subscribe((post) => {
        this.post = post;
        if (post) {
          this.matchesSubscription = this.store
            .select(selectPostMatches)
            .subscribe((matches) => {
              this.matches = matches;
            });
        }
      });
  }

  ngOnDestroy(): void {
    if (this.postSubscription) this.postSubscription.unsubscribe();
    if (this.matchesSubscription) this.matchesSubscription.unsubscribe();
  }
}
