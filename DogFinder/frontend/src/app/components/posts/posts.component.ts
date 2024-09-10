import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../post/post.component';
import { IPost } from '@dog-finder/models';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, PostComponent, MatListModule, RouterModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent {
  @Input() posts: IPost[];
  constructor(private router: Router) {}
  openPost(id: number) {
    this.router.navigate(['/view-post', id]);
  }
}
