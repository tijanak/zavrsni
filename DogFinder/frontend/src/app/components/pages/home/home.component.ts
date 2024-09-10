import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { LogoutComponent } from '../../logout/logout.component';
import { IPost } from '@dog-finder/models';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'frontend/src/app/store/app.reducer';
import {
  selectFoundPosts,
  selectLostPosts,
} from 'frontend/src/app/store/post/post.selectors';
import { PostsComponent } from '../../posts/posts.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    LogoutComponent,
    PostsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private subscriptions: Subscription[] = [];
  foundPosts: IPost[] = [];
  lostPosts: IPost[] = [];

  constructor(private store: Store<AppState>) {
    this.subscriptions.push(
      this.store
        .select(selectFoundPosts)
        .subscribe((posts) => (this.foundPosts = posts))
    );
    this.subscriptions.push(
      this.store
        .select(selectLostPosts)
        .subscribe((posts) => (this.lostPosts = posts))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
