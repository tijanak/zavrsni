import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { selectImagesForPost } from '../../store/images/images.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { IImage, IPost } from '@dog-finder/models';
import { ImageGalleryComponent } from '../image-gallery/image-gallery.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, ImageGalleryComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements OnDestroy, OnInit, OnChanges {
  @Input() post: IPost;
  images: IImage[];
  private subscription: Subscription;

  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {
    this.subscription = this.store
      .select(selectImagesForPost(this.post.id))
      .subscribe((images) => (this.images = images));
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post']) {
      this.subscription = this.store
        .select(selectImagesForPost(this.post.id))
        .subscribe((images) => (this.images = images));
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
