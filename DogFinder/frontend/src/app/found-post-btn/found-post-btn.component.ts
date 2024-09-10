import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PostFormComponent } from '../post-form/post-form.component';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { uploadPost } from '../store/post/post.actions';

@Component({
  selector: 'app-found-post-btn',
  standalone: true,
  imports: [CommonModule, PostFormComponent, MatButtonModule],
  templateUrl: './found-post-btn.component.html',
  styleUrl: './found-post-btn.component.css',
})
export class FoundPostBtnComponent {
  constructor(private dialog: MatDialog, private store: Store<AppState>) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(PostFormComponent, {
      width: '400px',
      data: { looking_for: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          uploadPost({
            postDto: {
              title: result.title,
              body: result.body,
              looking_for: false,
            },
            images: { ...result.images, length: result.images.length },
          })
        );
      }
    });
  }
}
